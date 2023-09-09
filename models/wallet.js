const mongoose = require('mongoose');

// mongoose schema
const walletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model('wallet', walletSchema);
module.exports = walletPassword;
