// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // replace with your email service
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendMail(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending mail', error);
  }
}

module.exports = sendMail;
