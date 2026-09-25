const mongoose = require('mongoose');

const BlogCommentSchema = new mongoose.Schema({
  postId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  name:    { type: String, required: true, trim: true, maxlength: 80 },
  email:   { type: String, required: true, trim: true, lowercase: true, maxlength: 160, select: false },
  comment: { type: String, required: true, trim: true, maxlength: 1500 },
}, { timestamps: true });

BlogCommentSchema.index({ postId: 1, createdAt: -1 });

module.exports = mongoose.models.BlogComment || mongoose.model('BlogComment', BlogCommentSchema);
