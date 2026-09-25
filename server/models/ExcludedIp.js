const mongoose = require('mongoose');

const ExcludedIpSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true, trim: true, maxlength: 64 },
  label: { type: String, trim: true, maxlength: 120, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.models.ExcludedIp || mongoose.model('ExcludedIp', ExcludedIpSchema);
