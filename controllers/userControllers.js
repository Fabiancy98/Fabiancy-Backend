const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const User = require('../models/users');
require('dotenv').config();

const USER_MAIL = process.env.USER_MAIL;
const USER_PASS = process.env.USER_PASS;

// GET::HOME
module.exports.home_get = (req, res) => {
  res.status(200).send('skipper backend team 🚀');
};

// POST::SIGNUP
module.exports.signup_post = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;

  if (email) {
    await User.verifyEmail(email);
  } else {
    console.log('You have registered with this email.');
    return res.send({
      message: 'You have registered with this email.',
    });
  }

  if (phoneNumber) {
    await User.verifyPhoneNumber(phoneNumber);
  } else {
    console.log('You have registered with this phone number.');
    return res.send({
      message: 'You have registered with this phone number.',
    });
  }

  try {
    const newUser = await User.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    });

    await newUser.save();
    // send token to user
    const token = await newUser.generateAuthToken();
    res.status(201).send({
      newUser,
      token,
      message: `${newUser.firstName} you signed-up sucessfully!`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

// POST::LOGIN
module.exports.login_post = async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  try {
    let user;
    if (email) {
      user = await User.loginWithEmail(email, password);
    } else if (phoneNumber) {
      user = await User.loginWithPhoneNumber(phoneNumber, password);
    } else {
      return res.send({
        message: 'Please provide either email or phone number.',
      });
    }

    if (user) {
      const token = await user.generateAuthToken();
      return res.send({ user, token, message: 'you logged in sucessfully!' });
    } else {
      return res.send({ message: 'login attempt failed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'Failed',
      message: err.message,
    });
  }
};

// POST::LOGOUT
module.exports.logout_post = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send('logged out successfully');
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// POST::LOGOUT ALL
module.exports.logoutall_post = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send('logged out of all sessions successfully');
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log(err);
  }
};

// EDIT PROFILE CUSTOMER
module.exports.user_patch_customer = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['email', 'phoneNumber'];
  const isValidOperation = updates.every(updates => {
    return allowedUpdates.includes(updates);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    console.log(updates);
    const user = await User.findOne({ _id: req.params.id });

    updates.forEach(update => {
      user[update] = req.body[update];
    });
    // console.log(user[updates]);
    // console.log(req.body[updates])
    await user.save();
    res.send('succesfully updated user details!✔');
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failed',
      message: err.message,
    });
  }
};

// EDIT PROFILE ADMIN
module.exports.user_patch_admin = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'email', 'phoneNumber'];
  const isValidOperation = updates.every(updates => {
    return allowedUpdates.includes(updates);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    console.log(updates);
    const user = await User.findOne({ _id: req.params.id });

    updates.forEach(update => {
      user[update] = req.body[update];
    });
    // console.log(user[updates]);
    // console.log(req.body[updates])
    await user.save();
    res.send('succesfully updated user details!✔');
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failed',
      message: err.message,
    });
  }
};

// DELETE USER ADMIN
module.exports.delete_user = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json(`${User.firstName} has been deleted...`);
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: err.message,
    });
  }
};

// FIND USER ADMIN
module.exports.findUser = async (req, res) => {
  const { email } = req.params;
  try {
    if (!email) return res.status(400).send({ error: 'Invalid Email' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: `Couldn't find the user` });

    //remove password from user and convert data to JSON
    const { password, ...rest } = Object.assign({}, user.toJSON());
    return res.status(200).send(rest);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: `Can't find user data` });
  }
};

// FIND ALL USER ADMIN
module.exports.getUser = async (req, res) => {
  try {
    const users = await User.find();

    //remove password from users and convert data to JSON
    const result = users.map(user => {
      const { password, ...rest } = Object.assign({}, user.toJSON());
      return rest;
    });
    return res.status(200).send(result);
  } catch (error) {
    return res.status(404).send({ error: `Can't find users data` });
  }
};

// set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: USER_MAIL,
    pass: USER_PASS,
  },
});

// generate and send OTP to user email
module.exports.gen = (req, res) => {
  const { email } = req.body;

  // generate 6-digit OTP
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  // send OTP to user email
  transporter.sendMail(
    {
      from: USER_MAIL,
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is ${otp}`,
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to send OTP' });
      } else {
        console.log('Email sent: ' + info.response);
        // set OTP in local variable for verification
        req.app.locals.OTP = otp;
        console.log(req.app.locals);
        res.status(200).json({ message: 'OTP sent successfully' });
      }
    }
  );
};

// verify OTP
module.exports.verify = (req, res) => {
  const { otp } = req.body;
  console.log(req.app.locals);
  // compare user input with generated OTP
  if (otp === req.app.locals.OTP) {
    // OTP is valid
    req.app.locals.OTP = null; //reset the OTP value
    req.app.locals.resetSession = true; //start session for reset password
    console.log(req.app.locals);
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    // OTP is invalid
    res.status(400).json({ error: 'Invalid OTP' });
  }
};
// create reset session
module.exports.createResetSession = (req, res) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; // allow access to this route only once
    return res.status(201).send({ message: 'access granted' });
  }
  return res.status(404).send({ error: 'session expired' });
};

// RESET PASSWORD
module.exports.reset_password = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['password'];
  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  if (!req.app.locals.resetSession) {
    return res.status(440).send({ error: 'Session Expired' });
  }

  try {
    console.log(updates);
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();
    res.send('successfully password!✔');
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'Failed',
      message: err.message,
    });
  }
};
