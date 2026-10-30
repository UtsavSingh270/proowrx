const express    = require('express');
const Contact    = require('../models/Contact');
const { requireAdmin } = require('../middleware/auth');
const { sendContactNotifications } = require('../utils/mailer');

const router = express.Router();

/* ── Public ─────────────────────────────────────────────────── */

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, interest, message, source, sourcePage, sourceTitle } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!String(name || '').trim() || !normalizedEmail || !String(phone || '').trim()) {
      return res.status(400).json({ error: 'Name, email and phone are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Enter a valid email address' });
    }

    // Save to DB
    const entry = await Contact.create({ name: String(name).trim(), email: normalizedEmail, phone: String(phone).trim(), company, interest, message, source: source || 'contact_page', sourcePage: typeof sourcePage === 'string' && /^\/(?!\/)/.test(sourcePage) ? sourcePage.split(/[?#]/)[0].slice(0, 500) : '', sourceTitle: String(sourceTitle || '').slice(0, 200) });

    // Notify the support inbox and send the enquirer an acknowledgement.
    try {
      const mailResult = await sendContactNotifications(entry.toObject());
      if (mailResult.skipped) console.warn('Email notifications skipped: SMTP is not configured');
    } catch (mailErr) {
      console.error('Email send error:', mailErr.message);
      // Don't fail the API call if email fails - entry is already saved to DB
    }

    res.status(201).json({ message: 'Enquiry received', id: entry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Admin ──────────────────────────────────────────────────── */

// GET /api/contact - list all enquiries (admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const entries = await Contact.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/contact/:id/read - mark as read
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
