const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// mongoose schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: [true, 'please provide your first name'],
      lowercase: true,
    },

    lastName: {
      type: String,
      required: [true, 'please provide your email your last name'],
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate: [isEmail, 'please provide valid email address'],
    },

    password: {
      type: String,
      required: [true, 'please provide a password'],
      minlength: [6, 'minimum password length is 6 characters'],
    },

    role: {
      type: String,
      required: true,
      enum: ['admin', 'customer'],
      default: 'customer',
    },

    profile_id: {
      type: String,
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    'Skipper api secret key'
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Find a user by email and password
userSchema.statics.loginWithEmail = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email.');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password.');
  }
  return user;
};

// Find a user by phone number and password
userSchema.statics.loginWithPhoneNumber = async function (
  phoneNumber,
  password
) {
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    throw new Error('Invalid phone number.');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password.');
  }
  return user;
};

// Find a user by email
userSchema.statics.verifyEmail = async function (email) {
  await User.findOne({ email });
};

// Find a user by phone number
userSchema.statics.verifyPhoneNumber = async function (phoneNumber) {
  await User.findOne({ phoneNumber });
};

// hash pin before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  }
  next();
});

const User = mongoose.model('user', userSchema);
module.exports = User;
