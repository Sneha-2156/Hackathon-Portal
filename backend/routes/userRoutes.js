const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/userController');

router.get('/me', auth, c.getMe);
router.put('/update', auth, c.updateMe);

module.exports = router;
