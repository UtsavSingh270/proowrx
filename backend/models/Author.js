const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, default: '', trim: true, lowercase: true },
  title:    { type: String, default: '', trim: true },
  image:    { type: String, default: '' },
  bio:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Author', AuthorSchema);
