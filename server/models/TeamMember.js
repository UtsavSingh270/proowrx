const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  position:    { type: String, required: true, trim: true },
  image:       { type: String, default: '' },
  category:    { type: String, enum: ['featured', 'core'], default: 'core' },
  description: { type: String, default: '' },
  summary:     { type: String, default: '' },
  fullSummary: { type: String, default: '' },
  socialMedia: {
    twitter:    { type: String, default: '' },
    linkedin:   { type: String, default: '' },
    facebook:   { type: String, default: '' },
    instagram:  { type: String, default: '' },
    github:     { type: String, default: '' },
  },
  email:       { type: String, default: '', trim: true, lowercase: true },
  bookable:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

TeamMemberSchema.index({ category: 1, order: 1, createdAt: 1 });

module.exports = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
