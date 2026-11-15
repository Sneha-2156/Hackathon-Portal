const Registration = require('../models/Registration');
const validateRegistration = require('../utils/validateRegistration');
const sendEmail = require('../utils/sendEmail');
const { confirmationEmail } = require('../utils/emailTemplates');

// POST /api/hackathon/register
exports.register = async (req, res) => {
  try {
    const errors = validateRegistration(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Please fix the highlighted fields', errors });

    if (await Registration.findOne({ user: req.user._id }))
      return res.status(409).json({ message: 'You have already registered for this hackathon' });

    const b = req.body;
    const size = Number(b.teamSize);
    const entry = await Registration.create({
      user: req.user._id,
      fullName: b.fullName.trim(),
      email: req.user.email, // always taken from the session, never from the form
      mobile: b.mobile.trim(),
      college: b.college,
      course: b.course,
      branch: b.branch,
      year: b.year,
      track: b.track,
      projectName: b.projectName.trim(),
      pptLink: b.pptLink.trim(),
      prototypeLink: b.prototypeLink.trim(),
      demoLink: (b.demoLink || '').trim(),
      teamSize: size,
      members: b.members.slice(0, size - 1).map((m) => ({ name: m.name.trim(), email: m.email.trim() })),
    });

    // The registration is already saved, so an email failure should not fail the request
    let emailSent = true;
    try {
      const { subject, html } = confirmationEmail(entry);
      await sendEmail({ to: entry.email, subject, html });
    } catch (mailErr) {
      emailSent = false;
      console.error('Confirmation email failed:', mailErr.message);
    }
    res.status(201).json({ entry, emailSent });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'You have already registered' });
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// GET /api/hackathon/myentry - returns { entry: null } when not registered yet
exports.myEntry = async (req, res) => {
  const entry = await Registration.findOne({ user: req.user._id });
  res.json({ entry });
};

// DELETE /api/hackathon/:id - owner can withdraw; admins can delete any entry
exports.remove = async (req, res) => {
  try {
    const entry = await Registration.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Registration not found' });
    const isOwner = String(entry.user) === String(req.user._id);
    if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ message: 'Not allowed' });
    await entry.deleteOne();
    res.json({ message: 'Registration deleted' });
  } catch {
    res.status(400).json({ message: 'Invalid registration id' });
  }
};
