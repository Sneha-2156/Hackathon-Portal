// GET /api/user/me - profile of the logged-in user
exports.getMe = (req, res) => {
  const { _id, name, email, role, createdAt } = req.user;
  res.json({ id: _id, name, email, role, createdAt });
};

// PUT /api/user/update - update display name
exports.updateMe = async (req, res) => {
  const name = String(req.body.name || '').trim();
  if (name.length < 3) return res.status(400).json({ message: 'Name must be at least 3 characters' });
  req.user.name = name;
  await req.user.save();
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role });
};
