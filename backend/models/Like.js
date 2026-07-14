const mongoose = require('mongoose');

// Tracks one like per device per post via a device fingerprint stored in localStorage
const LikeSchema = new mongoose.Schema({
  postId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  deviceId: { type: String, required: true },
}, { timestamps: true });

LikeSchema.index({ postId: 1, deviceId: 1 }, { unique: true });

module.exports = mongoose.model('Like', LikeSchema);
