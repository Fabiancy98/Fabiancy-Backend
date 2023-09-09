const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const walletController = require('../controllers/walletControllers');

router.get('/balance', auth, walletController.getWalletBalance);
router.post('/top-up', auth, walletController.topUpWallet);
router.post('/tranfer', auth, walletController.transferFunds);

module.exports = router;
