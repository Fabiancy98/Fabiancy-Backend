const { Router } = require('express');
const {
  auth,
  isAdmin,
  customer,
  localVariables,
} = require('../middleware/auth');
const mailer = require('../controllers/mailer');
const router = Router();

router.post('/registerMail', mailer.registerMail);
