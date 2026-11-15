const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { otpEmail } = require('../utils/emailTemplates');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OTP_TTL_MS = 10 * 60 * 1000; // OTP valid for 10 minutes
const RESEND_GAP_MS = 30 * 1000; // minimum gap between OTP emails
const MAX_OTP_ATTEMPTS = 5;

const normalizeEmail = (e) => String(e || '').trim().toLowerCase();

// Generates a 6-digit OTP, stores only its hash, and emails the plain code.
const issueOtp = async (user) => {
  const otp = crypto.randomInt(100000, 1000000).toString();
  user.otpHash = await bcrypt.hash(otp, 10);
  user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  user.otpAttempts = 0;
  user.lastOtpAt = new Date();
  await user.save();
  const { subject, html } = otpEmail(otp);
  await sendEmail({ to: user.email, subject, html });
};

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const { password, confirmPassword } = req.body;

    if (name.length < 3) return res.status(400).json({ message: 'Name must be at least 3 characters' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Enter a valid email address' });
    if (!password || password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    let user = await User.findOne({ email });
    if (user && user.isVerified) return res.status(409).json({ message: 'This email is already registered' });

    // Never store the plain password
    const passwordHash = await bcrypt.hash(password, 10);
    if (user) {
      // Unverified account from an earlier attempt: refresh details and resend OTP
      user.name = name;
      user.passwordHash = passwordHash;
    } else {
      user = new User({ name, email, passwordHash });
    }

    try {
      await issueOtp(user);
    } catch (mailErr) {
      console.error('OTP email failed:', mailErr.message);
      return res.status(502).json({ message: 'Could not send the OTP email. Please try again' });
    }
    res.status(201).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// POST /api/auth/verifyotp
exports.verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();
    const user = await User.findOne({ email });

    // otpHash is cleared after first use, so a used OTP lands here
    if (!user || !user.otpHash) return res.status(400).json({ message: 'OTP is invalid or already used' });
    if (user.otpExpiresAt < Date.now()) return res.status(400).json({ message: 'OTP expired. Request a new one' });
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS)
      return res.status(429).json({ message: 'Too many wrong attempts. Request a new OTP' });

    if (!/^\d{6}$/.test(otp) || !(await bcrypt.compare(otp, user.otpHash))) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    user.isVerified = true;
    user.otpHash = undefined; // invalidate after first use
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();
    res.json({ message: 'Email verified. You can log in now' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// POST /api/auth/resend-otp
exports.resendOtp = async (req, res) => {
  try {
    const user = await User.findOne({ email: normalizeEmail(req.body.email) });
    if (!user || user.isVerified) return res.status(400).json({ message: 'Cannot resend OTP for this email' });
    if (user.lastOtpAt && Date.now() - user.lastOtpAt < RESEND_GAP_MS)
      return res.status(429).json({ message: 'Please wait a few seconds before requesting another OTP' });

    try {
      await issueOtp(user);
    } catch (mailErr) {
      console.error('OTP email failed:', mailErr.message);
      return res.status(502).json({ message: 'Could not send the OTP email. Please try again' });
    }
    res.json({ message: 'A new OTP has been sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email });

    // Same message for unknown email and wrong password
    if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.passwordHash)))
      return res.status(401).json({ message: 'Incorrect email or password' });
    if (!user.isVerified)
      return res.status(403).json({ message: 'Please verify your email first', needsVerification: true });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
