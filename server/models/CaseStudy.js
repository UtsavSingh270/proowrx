const mongoose = require('mongoose');
const SeoFields = require('./SeoFields');
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  clientName: { type: String, default: '' },
  industry: { type: String, default: '' },
  service: { type: String, default: '' },
  duration: { type: String, default: '' },
  summary: { type: String, default: '' },
  image: { type: String, default: '' },
  challenge: { type: String, default: '' },
  approach: { type: String, default: '' },
  results: { type: String, default: '' },
  metrics: [{ label: String, value: String, _id: false }],
  testimonial: { type: String, default: '' },
  testimonialBy: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published', 'paused'], default: 'draft' },
  displayPages: { type: [String], default: [] },
  seo: { type: SeoFields, default: () => ({}) },
}, { timestamps: true });
schema.index({ status: 1, displayPages: 1 });
module.exports = mongoose.models.CaseStudy || mongoose.model('CaseStudy', schema);
