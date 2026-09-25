const mongoose = require('mongoose');
const SeoFields = require('./SeoFields');
const schema = new mongoose.Schema({
  path: { type: String, required: true, unique: true },
  seo: { type: SeoFields, default: () => ({}) },
}, { timestamps: true });
module.exports = mongoose.models.PageSeo || mongoose.model('PageSeo', schema);
