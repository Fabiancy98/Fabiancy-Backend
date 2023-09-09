const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

require('dotenv').config();

const MAIL_EMAIL = process.env.MAIL_EMAIL;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

let nodeConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, //true for 465, false for other ports
  auth: {
    user: MAIL_EMAIL, // generated ethereal user
    pass: MAIL_PASSWORD, // generated ethereal password
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let Mailgenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Mailgen',
    link: 'https://mailgen.js',
  },
});

module.exports.registerMail = async (req, res) => {
  const { firstname, lastname, email, text, subject } = req.body;

  //body of the email
  var mail = {
    body: {
      name: firstname + ' ' + lastname,
      intro: text || 'default text',
      outro: 'text',
    },
  };

  var emailBody = Mailgenerator.generate(mail);

  let message = {
    from: MAIL_EMAIL,
    to: email,
    subject: subject || 'Sign up Successful',
    html: emailBody,
  };

  //send mail
  try {
    await transporter.sendMail(message);
    return res
      .status(200)
      .send({ message: 'You should receive an email from us!!' });
  } catch (error) {
    return res.status(500).send({ error: 'Email not sent' });
  }
};
