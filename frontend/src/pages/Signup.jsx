import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import AuthShell from '../components/AuthShell';
import Field from '../components/Field';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Client-side checks mirror the server rules
  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = 'Enter at least 3 characters';
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (form.password.length < 8) e.password = 'Use at least 8 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setServerError('');
    try {
      await api('/auth/signup', { method: 'POST', body: form });
      sessionStorage.setItem('otpEmail', form.email.trim().toLowerCase());
      navigate('/verify-otp', { state: { email: form.email.trim().toLowerCase() } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="We will email a 6-digit code to verify your address.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name" htmlFor="name" error={errors.name}><input id="name" className={`input ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={set('name')} autoComplete="name" /></Field>
        <Field label="Email" htmlFor="email" error={errors.email}><input id="email" type="email" className={`input ${errors.email ? 'input-error' : ''}`} value={form.email} onChange={set('email')} autoComplete="email" /></Field>
        <Field label="Password" htmlFor="password" error={errors.password} hint="At least 8 characters"><input id="password" type="password" className={`input ${errors.password ? 'input-error' : ''}`} value={form.password} onChange={set('password')} autoComplete="new-password" /></Field>
        <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}><input id="confirmPassword" type="password" className={`input ${errors.confirmPassword ? 'input-error' : ''}`} value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" /></Field>
        {serverError && <p className="text-sm text-red-600" role="alert">{serverError}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Sending code...' : 'Create account'}</button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-medium text-nova">Log in</Link></p>
    </AuthShell>
  );
}
