const mongoose = require('mongoose');

// mongoose schema
const transactionPinSchema = new mongoose.Schema(
  {
    transactionPin: {
      type: Number,
      required: true,
      minlength: 4,
    },
  },
  {
    timestamps: true,
  }
);

const Pin = mongoose.model('pin', transactionPinSchema);
module.exports = Pin;
