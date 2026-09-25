const mongoose = require('mongoose');

const AnalyticsEventSchema = new mongoose.Schema({
  eventType: { type: String, enum: ['page_view'], default: 'page_view', index: true },
  visitorId: { type: String, required: true, maxlength: 80, index: true },
  sessionId: { type: String, required: true, maxlength: 80, index: true },
  path: { type: String, required: true, maxlength: 500, index: true },
  title: { type: String, maxlength: 200, default: '' },
  referrer: { type: String, maxlength: 500, default: '' },
  device: { type: String, enum: ['desktop', 'tablet', 'mobile', 'unknown'], default: 'unknown' },
  browser: { type: String, maxlength: 40, default: 'Other' },
  operatingSystem: { type: String, maxlength: 40, default: 'Other' },
  language: { type: String, maxlength: 20, default: '' },
  timezone: { type: String, maxlength: 80, default: '' },
  campaign: {
    source: { type: String, maxlength: 100, default: '' },
    medium: { type: String, maxlength: 100, default: '' },
    name: { type: String, maxlength: 100, default: '' },
  },
  occurredAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true, versionKey: false });

AnalyticsEventSchema.index({ occurredAt: -1, path: 1 });
AnalyticsEventSchema.index({ occurredAt: -1, visitorId: 1 });

module.exports = mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
