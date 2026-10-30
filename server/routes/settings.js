const router = require('express').Router();
const SiteSettings = require('../models/SiteSettings');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

function normalizeEmails(value) {
  const values = Array.isArray(value) ? value : String(value || '').split(/[\n,;]+/);
  return [...new Set(values.map(item => String(item).trim().toLowerCase()).filter(item => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item)))].slice(0, 20);
}

router.get('/notifications', async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({ key: 'notifications' }).lean();
    res.json({ contactCcEmails: settings?.contactCcEmails || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/notifications', async (req, res) => {
  try {
    const contactCcEmails = normalizeEmails(req.body.contactCcEmails);
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'notifications' },
      { key: 'notifications', contactCcEmails },
      { new: true, upsert: true, runValidators: true },
    ).lean();
    res.json({ contactCcEmails: settings.contactCcEmails });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
