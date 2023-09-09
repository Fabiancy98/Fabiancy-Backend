const { Router } = require('express');
const waitlistController = require('../controllers/waitlistController');
const router = Router();

router.post('/waitlist', waitlistController.join_waitlist);
router.get('/test', waitlistController.test_wait);
module.exports = router;
