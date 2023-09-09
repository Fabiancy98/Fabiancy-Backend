const mongoose = require('mongoose');
const { isEmail } = require('validator');

const waitlistSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: [true, 'please enter your full name'],
    lowercase: true,
  },

  email: {
    type: String,
    require: true,
    lowercase: true,
    unique: true,
    validate: [isEmail, 'please enter your email'],
  },
});

waitlistSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return userObject;
};

const Waitlist = mongoose.model('waitlist', waitlistSchema);
module.exports = Waitlist;
