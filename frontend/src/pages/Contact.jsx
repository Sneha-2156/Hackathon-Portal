import { useState } from 'react';
import { api } from '../api';
import Field from '../components/Field';
import { contactEmail } from '../eventConfig';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus({ type: '', text: '' });
    try {
      const data = await api('/contact', { method: 'POST', body: form });
      setStatus({ type: 'ok', text: data.message });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <h1 className="text-4xl font-extrabold">Contact us</h1>
      <p className="mt-3 text-slate-600">
        Questions about the hackathon? Write to <a className="font-medium text-nova underline" href={`mailto:${contactEmail}`}>{contactEmail}</a> or use the form.
      </p>
      <form onSubmit={submit} className="card mt-6 space-y-4" noValidate>
        <Field label="Name" htmlFor="name"><input id="name" className="input" value={form.name} onChange={set('name')} required /></Field>
        <Field label="Email" htmlFor="email"><input id="email" type="email" className="input" value={form.email} onChange={set('email')} required /></Field>
        <Field label="Message" htmlFor="message"><textarea id="message" rows="5" className="input" value={form.message} onChange={set('message')} required /></Field>
        {status.text && <p role="status" className={`text-sm ${status.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}>{status.text}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Sending...' : 'Send message'}</button>
      </form>
    </div>
  );
}
