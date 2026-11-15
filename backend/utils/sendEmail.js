const nodemailer = require('nodemailer');

// Gmail by default. Set SMTP_HOST (and SMTP_PORT) to use another provider.
const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })
  : nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

// The sender name is always "Code-a-Nova" (task requirement).
const sendEmail = ({ to, subject, html, replyTo }) =>
  transporter.sendMail({
    from: `"Code-a-Nova" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    replyTo,
  });

module.exports = sendEmail;
