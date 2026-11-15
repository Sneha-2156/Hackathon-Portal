// Server-side validation for the hackathon registration form.
const COURSES = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BSc', 'MSc', 'Other'];
const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'AI & DS', 'Other'];
const YEARS = ['1st year', '2nd year', '3rd year', '4th year'];
const TRACKS = ['AI/ML', 'Web Dev', 'IoT', 'Cyber Security', 'Blockchain', 'Other'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isUrl = (v) => {
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

// Returns an object of { field: message }. Empty object means valid.
module.exports = (b) => {
  const e = {};
  const s = (v) => String(v ?? '').trim();

  if (!/^[A-Za-z ]{3,}$/.test(s(b.fullName))) e.fullName = 'Use at least 3 letters (letters and spaces only)';
  if (!/^[6-9]\d{9}$/.test(s(b.mobile))) e.mobile = 'Enter a valid 10-digit Indian mobile number';
  if (!s(b.college)) e.college = 'Select your college';
  if (!COURSES.includes(b.course)) e.course = 'Select your course';
  if (!BRANCHES.includes(b.branch)) e.branch = 'Select your branch';
  if (!YEARS.includes(b.year)) e.year = 'Select your year of study';
  if (!TRACKS.includes(b.track)) e.track = 'Select a domain / track';
  if (s(b.projectName).length < 5) e.projectName = 'Project name needs at least 5 characters';
  if (!isUrl(s(b.pptLink))) e.pptLink = 'Enter a valid PPT link (https://...)';
  if (!isUrl(s(b.prototypeLink))) e.prototypeLink = 'Enter a valid prototype link (https://...)';
  if (s(b.demoLink) && !isUrl(s(b.demoLink))) e.demoLink = 'Enter a valid link or leave it empty';

  const size = Number(b.teamSize);
  if (!Number.isInteger(size) || size < 1 || size > 5) {
    e.teamSize = 'Team size must be between 1 and 5';
  } else {
    // The registrant counts as one member, so we expect size - 1 extra members
    const members = Array.isArray(b.members) ? b.members : [];
    if (members.length !== size - 1) e.members = `Add details for ${size - 1} other team member(s)`;
    else if (members.some((m) => s(m.name).length < 3 || !EMAIL_RE.test(s(m.email))))
      e.members = 'Each member needs a name (3+ characters) and a valid email';
  }
  return e;
};
