// main.js
const nodemailer = require('nodemailer');
require('dotenv').config()

// setup mail transporter service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email.toString(), 
    pass: process.env.pass_email.toString()
  }
});

module.exports = transporter;