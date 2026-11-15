const sendEmail = require('../utils/sendEmail');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// POST /api/contact - forwards the message to the project inbox
exports.sendContact = async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim();
  const message = String(req.body.message || '').trim();
  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10)
    return res.status(400).json({ message: 'Please fill in your name, a valid email and a message (10+ characters)' });

  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: 'New contact form message',
      html: `<p><b>${esc(name)}</b> (${esc(email)}) wrote:</p><p>${esc(message).replace(/\n/g, '<br>')}</p>`,
    });
    res.json({ message: 'Message sent. We will get back to you soon' });
  } catch (err) {
    console.error('Contact email failed:', err.message);
    res.status(502).json({ message: 'Could not send your message. Please try again' });
  }
};
