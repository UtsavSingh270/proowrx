const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  contactCcEmails: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
