const mongoose = require('mongoose');

// mongoose schema
const logsSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ['transfer', 'deposit'],
      required: true,
    },

    transactionDate: {
      type: String,
      enum: ['transfer', 'deposit'],
      required: true,
    },

    transactionTime: {
      type: String,
      enum: ['transfer', 'deposit'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: 'pending',
    },

    profile_id: {
      type: String,
    },
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

const Logs = mongoose.model('logs', logsSchema);
module.exports = Logs;
