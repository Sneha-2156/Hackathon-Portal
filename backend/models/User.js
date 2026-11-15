const mongoose = require('mongoose');

// A participant account. OTP data is stored hashed and cleared after use.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otpHash: String,
    otpExpiresAt: Date,
    otpAttempts: { type: Number, default: 0 },
    lastOtpAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
