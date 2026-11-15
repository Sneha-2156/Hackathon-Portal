const mongoose = require('mongoose');

// One hackathon registration per user (enforced by the unique index on `user`).
const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    mobile: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: String, required: true },
    track: { type: String, required: true },
    projectName: { type: String, required: true, trim: true },
    pptLink: { type: String, required: true },
    prototypeLink: { type: String, required: true },
    demoLink: { type: String, default: '' }, // optional
    teamSize: { type: Number, min: 1, max: 5, required: true },
    // Extra members besides the registrant (teamSize - 1 entries)
    members: [
      {
        _id: false,
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', registrationSchema);
