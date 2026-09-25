const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  slug:      { type: String, required: true, unique: true },
  topic:     { type: String, default: 'General' },
  desc:      { type: String, default: '' },
  image:     { type: mongoose.Schema.Types.Mixed, default: '' },
  pdfUrl:    { type: mongoose.Schema.Types.Mixed, default: '' },
  filename:  { type: String, default: '' },
  seo: { type: require('./SeoFields'), default: () => ({}) },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
