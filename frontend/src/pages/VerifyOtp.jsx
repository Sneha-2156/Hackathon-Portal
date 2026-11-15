import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import AuthShell from '../components/AuthShell';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  // Email comes from signup; sessionStorage keeps it across a page refresh
  const email = location.state?.email || sessionStorage.getItem('otpEmail');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  // Countdown for the Resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!email) return <Navigate to="/signup" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit code');
    setBusy(true);
    setError('');
    try {
      await api('/auth/verifyotp', { method: 'POST', body: { email, otp } });
      sessionStorage.removeItem('otpEmail');
      navigate('/login', { state: { message: 'Email verified. Log in to continue.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError('');
    setInfo('');
    try {
      const data = await api('/auth/resend-otp', { method: 'POST', body: { email } });
      setInfo(data.message);
      setCooldown(30);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthShell title="Verify your email" subtitle={`Enter the 6-digit code sent to ${email}. It expires in 10 minutes.`}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <label htmlFor="otp" className="sr-only">6-digit code</label>
        <input
          id="otp"
          className="input text-center text-2xl tracking-[0.5em]"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
        />
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {info && <p className="text-sm text-green-700" role="status">{info}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Verifying...' : 'Verify email'}</button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <button type="button" onClick={resend} disabled={cooldown > 0} className="font-medium text-nova disabled:text-slate-400">
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
        <Link to="/signup" className="text-slate-600">Change email</Link>
      </div>
    </AuthShell>
  );
}
