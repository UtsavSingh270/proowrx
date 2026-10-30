const SiteSettings = require('../models/SiteSettings');

async function getNotificationCc(extra = []) {
  try {
    const settings = await SiteSettings.findOne({ key: 'notifications' }).select('contactCcEmails').lean();
    return [...new Set([...(settings?.contactCcEmails || []), ...extra].map(email => String(email || '').trim()).filter(Boolean))];
  } catch (error) {
    console.error('Notification settings error:', error.message);
    return extra.filter(Boolean);
  }
}

module.exports = { getNotificationCc };
