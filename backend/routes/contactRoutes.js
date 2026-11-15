const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { sendContact } = require('../controllers/contactController');

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many messages. Try again later' } });
router.post('/', limiter, sendContact);

module.exports = router;
