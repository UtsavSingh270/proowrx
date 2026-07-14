const crypto = require('crypto');
const express = require('express');
const nodemailer = require('nodemailer');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../utils/auditLog');
const { isCloudinaryAsset, deleteCloudinaryAsset } = require('../utils/cloudinary');

const router = express.Router();
const otpRequests = new Map();
const downloadTokens = new Map();

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function normalizeAssetField(value) {
  if (value && typeof value === 'object' && typeof value.public_id === 'string' && typeof value.secure_url === 'string') {
    return value;
  }
  return String(value || '').trim();
}

function normalizeResourceInput(body) {
  return {
    title: String(body.title || '').trim(),
    slug: String(body.slug || '').trim(),
    topic: String(body.topic || 'General').trim(),
    desc: String(body.desc || '').trim(),
    image: normalizeAssetField(body.image),
    pdfUrl: normalizeAssetField(body.pdfUrl),
    filename: String(body.filename || 'resource.pdf').trim(),
    active: body.active !== false,
  };
}

async function generateUniqueSlug(title, excludeId) {
  const base = slugify(title, { lower: true, strict: true }) || 'resource';
  let slug = base;
  let suffix = 2;
  while (await Resource.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

function cleanupExpired() {
  const now = Date.now();
  otpRequests.forEach((value, key) => {
    if (value.expiresAt < now) otpRequests.delete(key);
  });
  downloadTokens.forEach((value, key) => {
    if (value.expiresAt < now) downloadTokens.delete(key);
  });
}

router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find({ active: true })
      .sort({ createdAt: -1 })
      .select('title slug topic desc image');
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const data = normalizeResourceInput(req.body);
    if (!data.title) return res.status(400).json({ error: 'Title is required' });
    if (!data.pdfUrl) return res.status(400).json({ error: 'PDF file URL is required' });
    data.slug = await generateUniqueSlug(data.title);
    const resource = await Resource.create(data);
    await logAudit(req.adminUsername, req.adminId, 'resources', 'create', resource._id, resource.title, data);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const data = normalizeResourceInput(req.body);
    const existing = await Resource.findById(req.params.id).select('slug title image pdfUrl');
    if (!existing) return res.status(404).json({ error: 'Resource not found' });
    if (!data.slug) {
      data.slug = existing.slug || await generateUniqueSlug(data.title, existing._id);
    }

    const oldResource = existing.toObject();
    const resource = await Resource.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });

    if (isCloudinaryAsset(oldResource.image) && (!isCloudinaryAsset(data.image) || data.image.public_id !== oldResource.image.public_id)) {
      try { await deleteCloudinaryAsset(oldResource.image.public_id); } catch (err) { console.warn('Failed to delete old image asset', err.message); }
    }
    if (isCloudinaryAsset(oldResource.pdfUrl) && (!isCloudinaryAsset(data.pdfUrl) || data.pdfUrl.public_id !== oldResource.pdfUrl.public_id)) {
      try { await deleteCloudinaryAsset(oldResource.pdfUrl.public_id); } catch (err) { console.warn('Failed to delete old pdf asset', err.message); }
    }

    await logAudit(req.adminUsername, req.adminId, 'resources', 'update', resource._id, resource.title, { old: oldResource, new: data });
    res.json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    if (isCloudinaryAsset(resource.image)) {
      try { await deleteCloudinaryAsset(resource.image.public_id); } catch (err) { console.warn('Failed to delete resource image', err.message); }
    }
    if (isCloudinaryAsset(resource.pdfUrl)) {
      try { await deleteCloudinaryAsset(resource.pdfUrl.public_id); } catch (err) { console.warn('Failed to delete resource pdf', err.message); }
    }

    await Resource.findByIdAndDelete(req.params.id);
    await logAudit(req.adminUsername, req.adminId, 'resources', 'delete', resource._id, resource.title, resource.toObject());
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/request-otp', async (req, res) => {
  try {
    cleanupExpired();
    const { resourceSlug, name, email, phone, company } = req.body;
    const resource = await Resource.findOne({ slug: resourceSlug, active: true });
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    const otp = String(crypto.randomInt(100000, 999999));
    const requestId = crypto.randomUUID();
    otpRequests.set(requestId, {
      otp,
      resourceSlug,
      name,
      email,
      phone: phone || '',
      company: company || '',
      attempts: 0,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Your Proowrx download OTP: ${otp}`,
        html: `
          <p>Hello ${name},</p>
          <p>Your OTP to download <strong>${resource.title}</strong> is:</p>
          <h2 style="letter-spacing:4px">${otp}</h2>
          <p>This code expires in 10 minutes.</p>
        `,
      });

      if (process.env.EMAIL_TO) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: process.env.EMAIL_TO,
          subject: `Resource download request - ${resource.title}`,
          html: `
            <h2>Resource Download Request</h2>
            <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif">
              <tr><td style="padding:8px;font-weight:bold">Resource</td><td style="padding:8px">${resource.title}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${email}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${phone || '-'}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">Company</td><td style="padding:8px">${company || '-'}</td></tr>
            </table>
          `,
        });
      }
    } catch (mailErr) {
      console.error('Resource OTP email send error:', mailErr.message);
      return res.status(500).json({ error: 'Could not send OTP email. Please try again later.' });
    }

    res.json({ requestId, message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify-otp', (req, res) => {
  cleanupExpired();
  const { requestId, otp } = req.body;
  const request = otpRequests.get(requestId);
  if (!request) return res.status(400).json({ error: 'OTP expired. Please request a new code.' });
  if (request.attempts >= 5) {
    otpRequests.delete(requestId);
    return res.status(429).json({ error: 'Too many attempts. Please request a new code.' });
  }
  if (String(otp).trim() !== request.otp) {
    request.attempts += 1;
    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
  }

  const token = crypto.randomUUID();
  downloadTokens.set(token, {
    resourceSlug: request.resourceSlug,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
  otpRequests.delete(requestId);
  res.json({ downloadUrl: `/api/resources/download/${token}` });
});

router.get('/download/:token', async (req, res) => {
  cleanupExpired();
  const record = downloadTokens.get(req.params.token);
  if (!record) return res.status(403).json({ error: 'Download link expired or invalid.' });
  const resource = await Resource.findOne({ slug: record.resourceSlug, active: true });
  if (!resource) return res.status(404).json({ error: 'Resource not found' });

  if (!resource.pdfUrl) {
    return res.status(404).json({ error: 'File not available' });
  }

  if (typeof resource.pdfUrl === 'object' && resource.pdfUrl.secure_url) {
    return res.redirect(resource.pdfUrl.secure_url);
  }

  if (typeof resource.pdfUrl === 'string' && (resource.pdfUrl.startsWith('/uploads/') || resource.pdfUrl.startsWith('uploads/'))) {
    const filePath = path.join(__dirname, '..', resource.pdfUrl.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'PDF file missing' });
    }
    return res.download(filePath, resource.filename || path.basename(filePath));
  }

  if (typeof resource.pdfUrl === 'string' && (resource.pdfUrl.startsWith('http://') || resource.pdfUrl.startsWith('https://'))) {
    return res.redirect(resource.pdfUrl);
  }

  res.status(400).json({ error: 'Unsupported PDF file location' });
});

module.exports = router;
