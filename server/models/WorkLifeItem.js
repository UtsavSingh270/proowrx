const mongoose = require('mongoose');

const WorkLifeItemSchema = new mongoose.Schema({
  type:      { type: String, enum: ['image', 'video'], required: true },
  title:     { type: String, required: true },
  caption:   { type: String, default: '' },
  url:       { type: mongoose.Schema.Types.Mixed, required: true },
  posterUrl: { type: mongoose.Schema.Types.Mixed, default: '' },
  active:    { type: Boolean, default: true },
  order:     { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.WorkLifeItem || mongoose.model('WorkLifeItem', WorkLifeItemSchema);
