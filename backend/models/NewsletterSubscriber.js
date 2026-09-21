const mongoose = require('mongoose');

const NewsletterSubscriberSchema = new mongoose.Schema({
  email:  { type: String, required: true, trim: true, lowercase: true, unique: true },
  source: { type: String, default: 'website_footer' },
}, { timestamps: true });

NewsletterSubscriberSchema.index({ createdAt: -1 });

module.exports = mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);
