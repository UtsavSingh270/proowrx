const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminUserSchema = new mongoose.Schema({
  username:      { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:      { type: String, required: true },
  isSuperAdmin:  { type: Boolean, default: false },
  permissions:   { type: String, enum: ['view', 'view-write'], default: 'view-write' },
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  lastLogin:     { type: Date, default: null },
  active:        { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving
AdminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
AdminUserSchema.methods.comparePassword = async function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
