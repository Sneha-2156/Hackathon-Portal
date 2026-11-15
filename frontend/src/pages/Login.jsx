import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AuthShell from '../components/AuthShell';
import Field from '../components/Field';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [busy, setBusy] = useState(false);

  // Already logged in: skip the form
  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) return setError('Enter your email and password');
    setBusy(true);
    setError('');
    setNeedsVerification(false);
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      if (err.data?.needsVerification) {
        sessionStorage.setItem('otpEmail', form.email.trim().toLowerCase());
        setNeedsVerification(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Log in" subtitle="Welcome back.">
      {location.state?.message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800" role="status">{location.state.message}</p>}
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" htmlFor="email"><input id="email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></Field>
        <Field label="Password" htmlFor="password"><input id="password" type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" /></Field>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {needsVerification && <Link to="/verify-otp" className="block text-sm font-medium text-nova">Enter your verification code</Link>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">New here? <Link to="/signup" className="font-medium text-nova">Create an account</Link></p>
    </AuthShell>
  );
}
