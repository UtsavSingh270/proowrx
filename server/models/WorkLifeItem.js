const mongoose = require('mongoose');

const WorkLifeItemSchema = new mongoose.Schema({
  type:      { type: String, enum: ['image', 'video'], required: true },
  title:     { type: String, required: true },
  caption:   { type: String, default: '' },
  url:       { type: mongoose.Schema.Types.Mixed, required: true },
  posterUrl: { type: mongoose.Schema.Types.Mixed, default: '' },
  active:    { type: Boolean, default: true },
  order:     { type: Number, default: 0 },
  desktopOrder: { type: Number, default: null, min: 0, validate: { validator: value => value == null || Number.isSafeInteger(value), message: 'Desktop order must be a whole number.' } },
  mobileOrder: { type: Number, default: null, min: 0, validate: { validator: value => value == null || Number.isSafeInteger(value), message: 'Mobile order must be a whole number.' } },
  createdAt: { type: Date, default: Date.now },
});

const WorkLifeItem = mongoose.models.WorkLifeItem || mongoose.model('WorkLifeItem', WorkLifeItemSchema);
// Next.js development reloads can retain a model compiled before these fields existed.
const missingOrderFields = Object.fromEntries(['desktopOrder', 'mobileOrder']
  .filter(field => !WorkLifeItem.schema.path(field))
  .map(field => [field, WorkLifeItemSchema.obj[field]]));
if (Object.keys(missingOrderFields).length) {
  WorkLifeItem.schema.add(missingOrderFields);
  WorkLifeItem.recompileSchema();
}
module.exports = WorkLifeItem;
