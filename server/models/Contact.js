const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, trim: true, lowercase: true },
  phone:    { type: String, default: '' },
  company:  { type: String, default: '' },
  interest: { type: String, default: '' },
  message:  { type: String, default: '' },
  source:   { type: String, default: 'contact_page' }, // contact_page | popup | chatbot
  sourcePage: { type: String, default: '' },
  sourceTitle: { type: String, default: '' },
  resourceId: { type: mongoose.Schema.Types.ObjectId, default: null },
  read:     { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
