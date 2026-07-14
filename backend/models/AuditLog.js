const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  username:     { type: String, required: true },
  adminUserId:  { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  section:      { type: String, enum: ['blogs', 'jobs', 'members', 'authors', 'contacts', 'meetings', 'resources', 'worklife'], required: true },
  action:       { type: String, enum: ['create', 'update', 'delete'], required: true },
  itemId:       { type: mongoose.Schema.Types.ObjectId, default: null },
  itemName:     { type: String, default: '' },
  changes:      { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp:    { type: Date, default: Date.now },
  expiresAt:    { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
}, { timestamps: true });

// TTL index: automatically delete logs after 30 days
AuditLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
