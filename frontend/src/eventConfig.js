// Event content and form options in one place.
// NOTE: dates, prizes and the contact email below are SAMPLE values. Replace them with the real event details.

export const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'hello@code-a-nova.example';

export const highlights = [
  { title: 'Build in teams of up to 5', text: 'Go solo or bring friends from your college. Register your whole team in one form.' },
  { title: 'Six domains to pick from', text: 'AI/ML, Web Dev, IoT, Cyber Security, Blockchain and more.' },
  { title: 'Submit a working prototype', text: 'Share your slides, prototype link and an optional demo video for review.' },
];

export const timeline = [
  { when: 'Registrations open', what: 'Create an account, verify your email and register your team.' },
  { when: 'Registrations close', what: 'Final team and project details are locked.' },
  { when: 'Project review', what: 'Judges go through your slides, prototype and demo video.' },
  { when: 'Results', what: 'Winners are announced and notified by email.' },
];

export const prizes = [
  { place: 'Winner', amount: '₹50,000' },
  { place: 'Runner-up', amount: '₹30,000' },
  { place: 'Best in each track', amount: '₹10,000' },
];

// Form options (keep in sync with server/utils/validateRegistration.js)
export const colleges = [
  'Sir M. Visvesvaraya Institute of Technology',
  'RV College of Engineering',
  'BMS College of Engineering',
  'PES University',
  'Ramaiah Institute of Technology',
  'Dayananda Sagar College of Engineering',
  'Other',
];
export const courses = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BSc', 'MSc', 'Other'];
export const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'AI & DS', 'Other'];
export const years = ['1st year', '2nd year', '3rd year', '4th year'];
export const tracks = ['AI/ML', 'Web Dev', 'IoT', 'Cyber Security', 'Blockchain', 'Other'];
