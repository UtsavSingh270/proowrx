const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  person:      { type: String, required: true },       // 'Deepika Dixit' | 'Kshitij Verma'
  personEmail: { type: String, default: '' },
  date:        { type: String, required: true },        // 'YYYY-MM-DD'
  time:        { type: String, required: true },        // '09:00'
  timezone:    { type: String, default: 'Australia/Sydney' },
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, trim: true, lowercase: true },
  phone:       { type: String, default: '' },
  reason:      { type: String, default: '' },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.models.Meeting || mongoose.model('Meeting', MeetingSchema);
