const jwt = require('jsonwebtoken');
const User = require('../models/users');

// Authentication
const auth = async (req, res, next) => {
  try {
    const token = await req.header('Authorization').replace('Bearer ', ''); //
    // console.log(token);
    const decoded = await jwt.verify(token, 'Skipper api secret key');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
    // console.log('Authentication error', e);
  }
};

const isAdmin = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(401).send('please Authenticate');
    } else if (user.role !== 'admin') {
      return res.status(403).send('access denied');
    }
    password;
    next();
  } catch (err) {
    console.log(err);
  }
};

const customer = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(401).send('please Authenticate');
    } else if (user.role !== 'customer') {
      return res.status(403).send('access denied');
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

const localVariables = (req, res, next) => {
  req.app.locals = {
    OTP: null, // OTP local variable initialized to null
    resetSession: false,
  };
  next();
};

module.exports = {
  auth,
  isAdmin,
  customer,
  localVariables,
};
