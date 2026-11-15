const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const c = require('../controllers/authController');

// Slows down OTP brute-forcing and email spamming
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { message: 'Too many requests. Try again later' } });

router.post('/signup', limiter, c.signup);
router.post('/verifyotp', limiter, c.verifyOtp);
router.post('/resend-otp', limiter, c.resendOtp);
router.post('/login', limiter, c.login);

module.exports = router;
