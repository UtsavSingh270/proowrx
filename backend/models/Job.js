const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  department:  { type: String, default: '' },
  location:    { type: String, default: 'Jaipur, India' },
  type:        { type: String, default: 'Full-time' },
  experience:  { type: String, default: '' },
  applyLink:   { type: String, required: true },
  tags:        [String],
  status:      { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Job', JobSchema);
