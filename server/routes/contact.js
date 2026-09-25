const express    = require('express');
const nodemailer = require('nodemailer');
const Contact    = require('../models/Contact');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

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

/* ── Public ─────────────────────────────────────────────────── */

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, interest, message, source, sourcePage, sourceTitle } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    // Save to DB
    const entry = await Contact.create({ name, email, phone, company, interest, message, source: source || 'contact_page', sourcePage: typeof sourcePage === 'string' && /^\/(?!\/)/.test(sourcePage) ? sourcePage.split(/[?#]/)[0].slice(0, 500) : '', sourceTitle: String(sourceTitle || '').slice(0, 200) });

    // Send email notification
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to:   process.env.EMAIL_TO,
        subject: `New enquiry from ${name} — Proowrx`,
        html: `
          <h2>New Contact Enquiry</h2>
          <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
            <tr><td style="padding:8px;font-weight:bold;color:#374a6e">Name</td><td style="padding:8px">${name}</td></tr>
            <tr style="background:#f8f9fc"><td style="padding:8px;font-weight:bold;color:#374a6e">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#374a6e">Phone</td><td style="padding:8px">${phone || '—'}</td></tr>
            <tr style="background:#f8f9fc"><td style="padding:8px;font-weight:bold;color:#374a6e">Company</td><td style="padding:8px">${company || '—'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#374a6e">Interest</td><td style="padding:8px">${interest || '—'}</td></tr>
            <tr style="background:#f8f9fc"><td style="padding:8px;font-weight:bold;color:#374a6e">Message</td><td style="padding:8px">${message || '—'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#374a6e">Source</td><td style="padding:8px">${source || 'contact_page'}</td></tr>
          </table>
        `,
      });
    } catch (mailErr) {
      console.error('Email send error:', mailErr.message);
      // Don't fail the API call if email fails — entry is already saved to DB
    }

    res.status(201).json({ message: 'Enquiry received', id: entry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Admin ──────────────────────────────────────────────────── */

// GET /api/contact — list all enquiries (admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const entries = await Contact.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/contact/:id/read — mark as read
router.patch('/:id/read', requireAdmin, async (req, res) => {
  try {
    const entry = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/contact/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
