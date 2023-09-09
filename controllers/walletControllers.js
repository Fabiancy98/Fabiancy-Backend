const Wallet = require('../controllers/walletControllers');

module.exports.getWalletBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user_id: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    return res
      .status(200)
      .json({ balance: wallet.balance, user_id: wallet.user_id });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports.topUpWallet = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ user_id: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // const paymentProcessor = await ({
    //       amount: amount,
    //       source: hjsd ,
    //       description: `Top-up wallet for user: ${req.user.email}`
    // })

    wallet.balance += amount;
    await wallet.save();
    return res.status(500).json({ balance: wallet.balance });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports.transferFunds = async (req, res, next) => {
  try {
    const { to_user_id, amount } = req.body;
    const from_wallet = await Wallet.findOne({ user_id: req.user.id });
    const to_wallet = await Wallet.findOne({ user_id: to_user_id });
    if (!from_wallet || !to_wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (from_wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    from_wallet.balance -= amount;
    to_wallet.balance += amount;
    await from_wallet.save();
    await to_wallet.save();
    return res.status(200).json({ message: 'Funds transfered successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
