const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/hackathonController');

router.post('/register', auth, c.register);
router.get('/myentry', auth, c.myEntry);
router.delete('/:id', auth, c.remove);

module.exports = router;
