import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import Field from '../components/Field';
import { colleges, courses, branches, years, tracks } from '../eventConfig';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isUrl = (v) => {
  try { const u = new URL(v); return u.protocol === 'http:' || u.protocol === 'https:'; } catch { return false; }
};

// Reusable <select> with a placeholder option
function Select({ id, value, onChange, options, error }) {
  return (
    <select id={id} value={value} onChange={onChange} className={`input ${error ? 'input-error' : ''}`}>
      <option value="">Select</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function Register() {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [form, setForm] = useState({
    fullName: user.name, mobile: '', college: '', course: '', branch: '', year: '', track: '',
    projectName: '', pptLink: '', prototypeLink: '', demoLink: '', teamSize: '1', members: [],
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null); // { emailSent } after a successful submit

  // Registered users go straight back to the dashboard
  useEffect(() => {
    api('/hackathon/myentry').then((d) => setAlreadyRegistered(!!d.entry)).finally(() => setChecking(false));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Team size includes the registrant, so we render (size - 1) member boxes
  const changeTeamSize = (e) => {
    const size = Number(e.target.value);
    const members = Array.from({ length: size - 1 }, (_, i) => form.members[i] || { name: '', email: '' });
    setForm({ ...form, teamSize: e.target.value, members });
  };
  const setMember = (i, k, v) => {
    const members = form.members.map((m, idx) => (idx === i ? { ...m, [k]: v } : m));
    setForm({ ...form, members });
  };

  // Client-side checks mirror server/utils/validateRegistration.js
  const validate = () => {
    const e = {};
    if (!/^[A-Za-z ]{3,}$/.test(form.fullName.trim())) e.fullName = 'Use at least 3 letters (letters and spaces only)';
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number';
    ['college', 'course', 'branch', 'year', 'track'].forEach((k) => { if (!form[k]) e[k] = 'Please select an option'; });
    if (form.projectName.trim().length < 5) e.projectName = 'Use at least 5 characters';
    if (!isUrl(form.pptLink.trim())) e.pptLink = 'Enter a valid link (https://...)';
    if (!isUrl(form.prototypeLink.trim())) e.prototypeLink = 'Enter a valid link (https://...)';
    if (form.demoLink.trim() && !isUrl(form.demoLink.trim())) e.demoLink = 'Enter a valid link or leave it empty';
    const memberErrors = form.members.map((m) => ({
      name: m.name.trim().length < 3 ? 'At least 3 characters' : '',
      email: EMAIL_RE.test(m.email.trim()) ? '' : 'Enter a valid email',
    }));
    if (memberErrors.some((m) => m.name || m.email)) e.members = memberErrors;
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setServerError('');
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const data = await api('/hackathon/register', { method: 'POST', body: { ...form, teamSize: Number(form.teamSize) } });
      setDone({ emailSent: data.emailSent });
    } catch (err) {
      setServerError(err.message);
      if (err.data?.errors) setErrors(err.data.errors);
    } finally {
      setBusy(false);
    }
  };

  if (checking) return <p className="p-10 text-center text-slate-500">Loading...</p>;
  if (alreadyRegistered && !done) return <Navigate to="/dashboard" replace />;

  // Success screen
  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold">You are registered</h1>
        <p className="mt-3 text-slate-600">
          {done.emailSent ? `A confirmation email is on its way to ${user.email}.` : 'Your registration is saved, but we could not send the confirmation email. You can see your details on the dashboard.'}
        </p>
        <Link to="/dashboard" className="btn-primary mt-6">Go to dashboard</Link>
      </div>
    );
  }

  const memberErr = Array.isArray(errors.members) ? errors.members : [];
  const err = (k) => (typeof errors[k] === 'string' ? errors[k] : '');

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Hackathon registration</h1>
      <p className="mt-2 text-slate-600">All fields are required unless marked optional.</p>

      <form onSubmit={submit} className="mt-6 space-y-6" noValidate>
        <fieldset className="card grid gap-4 sm:grid-cols-2">
          <legend className="sr-only">About you</legend>
          <Field label="Full name" htmlFor="fullName" error={err('fullName')}><input id="fullName" className={`input ${err('fullName') ? 'input-error' : ''}`} value={form.fullName} onChange={set('fullName')} /></Field>
          <Field label="Email" htmlFor="email" hint="Taken from your account"><input id="email" className="input" value={user.email} disabled readOnly /></Field>
          <Field label="Mobile number" htmlFor="mobile" error={err('mobile')}><input id="mobile" inputMode="numeric" maxLength={10} className={`input ${err('mobile') ? 'input-error' : ''}`} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })} /></Field>
          <Field label="College name" htmlFor="college" error={err('college')}><Select id="college" value={form.college} onChange={set('college')} options={colleges} error={err('college')} /></Field>
          <Field label="Course" htmlFor="course" error={err('course')}><Select id="course" value={form.course} onChange={set('course')} options={courses} error={err('course')} /></Field>
          <Field label="Branch" htmlFor="branch" error={err('branch')}><Select id="branch" value={form.branch} onChange={set('branch')} options={branches} error={err('branch')} /></Field>
          <Field label="Year of study" htmlFor="year" error={err('year')}><Select id="year" value={form.year} onChange={set('year')} options={years} error={err('year')} /></Field>
        </fieldset>

        <fieldset className="card grid gap-4 sm:grid-cols-2">
          <legend className="sr-only">Your project</legend>
          <Field label="Domain / track" htmlFor="track" error={err('track')}><Select id="track" value={form.track} onChange={set('track')} options={tracks} error={err('track')} /></Field>
          <Field label="Project name" htmlFor="projectName" error={err('projectName')}><input id="projectName" className={`input ${err('projectName') ? 'input-error' : ''}`} value={form.projectName} onChange={set('projectName')} /></Field>
          <Field label="PPT link" htmlFor="pptLink" error={err('pptLink')} hint="Google Drive or OneDrive shareable link"><input id="pptLink" type="url" className={`input ${err('pptLink') ? 'input-error' : ''}`} value={form.pptLink} onChange={set('pptLink')} /></Field>
          <Field label="Prototype link" htmlFor="prototypeLink" error={err('prototypeLink')} hint="GitHub, Figma or live demo"><input id="prototypeLink" type="url" className={`input ${err('prototypeLink') ? 'input-error' : ''}`} value={form.prototypeLink} onChange={set('prototypeLink')} /></Field>
          <div className="sm:col-span-2">
            <Field label="Demo video link (optional)" htmlFor="demoLink" error={err('demoLink')} hint="YouTube or Drive link"><input id="demoLink" type="url" className={`input ${err('demoLink') ? 'input-error' : ''}`} value={form.demoLink} onChange={set('demoLink')} /></Field>
          </div>
        </fieldset>

        <fieldset className="card space-y-4">
          <legend className="sr-only">Your team</legend>
          <Field label="Team size (including you)" htmlFor="teamSize" error={err('teamSize')}>
            <select id="teamSize" className="input sm:max-w-[12rem]" value={form.teamSize} onChange={changeTeamSize}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}{n === 1 ? ' (solo)' : ''}</option>)}
            </select>
          </Field>
          {form.members.map((m, i) => (
            <div key={i} className="grid gap-4 rounded-xl border border-line p-4 sm:grid-cols-2">
              <p className="font-bold sm:col-span-2">Team member {i + 2}</p>
              <Field label="Member name" htmlFor={`mn${i}`} error={memberErr[i]?.name}><input id={`mn${i}`} className={`input ${memberErr[i]?.name ? 'input-error' : ''}`} value={m.name} onChange={(e) => setMember(i, 'name', e.target.value)} /></Field>
              <Field label="Member email" htmlFor={`me${i}`} error={memberErr[i]?.email}><input id={`me${i}`} type="email" className={`input ${memberErr[i]?.email ? 'input-error' : ''}`} value={m.email} onChange={(e) => setMember(i, 'email', e.target.value)} /></Field>
            </div>
          ))}
          {typeof errors.members === 'string' && <p className="text-sm text-red-600" role="alert">{errors.members}</p>}
        </fieldset>

        {serverError && <p className="text-sm text-red-600" role="alert">{serverError}</p>}
        <button className="btn-primary w-full sm:w-auto" disabled={busy}>{busy ? 'Submitting...' : 'Submit registration'}</button>
      </form>
    </div>
  );
}
