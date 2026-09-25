const express = require('express');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../utils/auditLog');
const { isCloudinaryAsset, deleteCloudinaryAsset } = require('../utils/cloudinary');

const router = express.Router();
const Contact = require('../models/Contact');
const { normalizeSeo } = require('../utils/seo');
const { downloadDetails, createDownloadToken, verifyDownloadToken } = require('../utils/downloads');

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
    filename: String(body.filename || 'download').trim(),
    active: body.active !== false,
    ...('seo' in body ? { seo: normalizeSeo(body.seo) } : {}),
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
    if (!data.desc) return res.status(400).json({ error: 'Description is required' });
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
    if (!data.title || !data.desc || !data.pdfUrl) return res.status(400).json({ error: 'Title, description and file are required' });
    data.slug = existing.slug || await generateUniqueSlug(data.title, existing._id);

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

router.post('/request-download', async (req, res) => {
  try {
    const details = downloadDetails(req.body);
    const resource = await Resource.findOne({ slug: String(req.body.resourceSlug || ''), active: true });
    if (!resource || !resource.pdfUrl) return res.status(404).json({ error: 'Downloadable not found' });
    // A token is only returned after the enquiry has been durably saved.
    const token = createDownloadToken(resource._id);
    const sourcePage = typeof req.body.sourcePage === 'string' && /^\/(?!\/)/.test(req.body.sourcePage) ? req.body.sourcePage.split(/[?#]/)[0].slice(0, 500) : `/resources/${resource.slug}`;
    await Contact.create({ ...details, source: 'downloadable', sourcePage, sourceTitle: resource.title, resourceId: resource._id, interest: resource.title, message: `Download requested: ${resource.title}` });
    res.status(201).json({ downloadUrl: `/api/resources/download/${token}` });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

router.get('/download/:token', async (req, res) => {
  let resourceId;
  try { resourceId = verifyDownloadToken(req.params.token); }
  catch { return res.status(403).json({ error: 'Download link expired. Please enter your details again.' }); }
  try {
    const resource = await Resource.findOne({ _id: resourceId, active: true });
    if (!resource?.pdfUrl) return res.status(404).json({ error: 'File not available' });
    const url = typeof resource.pdfUrl === 'object' ? resource.pdfUrl.secure_url : resource.pdfUrl;
    if (/^https?:\/\//i.test(url)) return res.redirect(url);
    if (/^\/?uploads\//.test(url)) {
      const base = path.resolve(process.cwd(), 'server/uploads');
      const target = path.resolve(base, url.replace(/^\/?uploads\//, ''));
      if (!target.startsWith(base + path.sep) || !fs.existsSync(target)) return res.status(404).json({ error: 'File not found' });
      return res.download(target, resource.filename || path.basename(target));
    }
    return res.status(404).json({ error: 'File not available' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
