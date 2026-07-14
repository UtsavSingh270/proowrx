const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  slug:          { type: String, unique: true, sparse: true, index: true },
  excerpt:       { type: String, default: '' },
  htmlContent:   { type: String, default: '' },
  image:         { type: String, default: '' },
  category:      { type: String, default: 'General' },
  categoryColor: { type: String, default: 'var(--gold)' },
  categoryGlow:  { type: String, default: 'var(--gold-pale)' },
  author:        { type: String, default: '' },
  authorId:      { type: mongoose.Schema.Types.ObjectId, default: null },
  authorProfile: {
    name:     { type: String, default: '' },
    email:    { type: String, default: '' },
    title:    { type: String, default: '' },
    image:    { type: String, default: '' },
    bio:      { type: String, default: '' },
  },
  date:          { type: String, default: '' },
  scheduledAt:   { type: Date, default: null },
  readTime:      { type: String, default: '1 min read' },
  tags:          [String],
  faqs: [{
    question: { type: String, default: '' },
    answer:   { type: String, default: '' },
  }],
  featured:      { type: Boolean, default: false },
  status:        { type: String, enum: ['published', 'draft', 'paused', 'scheduled'], default: 'draft' },
  views:         { type: Number, default: 0 },
  likes:         { type: Number, default: 0 },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

PostSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
