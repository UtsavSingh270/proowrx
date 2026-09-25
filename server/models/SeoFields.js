const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  primaryKeywords: { type: String, default: '' },
  secondaryKeywords: { type: String, default: '' },
  canonical: { type: String, default: '' },
  ogTitle: { type: String, default: '' },
  ogDescription: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  noindex: { type: Boolean, default: false },
  nofollow: { type: Boolean, default: false },
}, { _id: false });
