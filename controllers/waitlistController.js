const userWaitlist = require('../models/waitlist');

module.exports.join_waitlist = async (req, res) => {
  const { fullName, email } = req.body;
  console.log(req.body);

  const check = userWaitlist.find({ fullName, email });
  if (check === null) {
    console.log('Data not found in the database');
  } else {
    throw Error('you have joined our waitlist before');
  }

  try {
    const users = await userWaitlist.create({ fullName, email });
    await users.save();
    return res.status(201).send({
      users,
      message: `${users.fullName} you have joined our waitlist sucessfully`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.test_wait = (req, res) => {
  res.status(200).send('waitlist');
  console.log('waitlist working well');
};
