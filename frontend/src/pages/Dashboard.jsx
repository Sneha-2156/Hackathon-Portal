import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const Row = ({ label, children }) => (
  <div className="grid gap-1 py-2 sm:grid-cols-3">
    <dt className="text-sm text-slate-500">{label}</dt>
    <dd className="break-words sm:col-span-2">{children}</dd>
  </div>
);
const ExtLink = ({ href }) => (href ? <a href={href} target="_blank" rel="noreferrer" className="text-nova underline">{href}</a> : <span className="text-slate-400">Not provided</span>);

export default function Dashboard() {
  const { user } = useAuth();
  const [entry, setEntry] = useState(undefined); // undefined = loading, null = not registered
  const [error, setError] = useState('');

  useEffect(() => {
    api('/hackathon/myentry').then((d) => setEntry(d.entry)).catch((e) => setError(e.message));
  }, []);

  // Withdraw (DELETE) the registration after confirmation
  const withdraw = async () => {
    if (!window.confirm('Withdraw your registration? You can register again later.')) return;
    try {
      await api(`/hackathon/${entry._id}`, { method: 'DELETE' });
      setEntry(null);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-extrabold">Hi, {user.name}</h1>

      <section className="card">
        <h2 className="text-xl font-bold">Your profile</h2>
        <dl className="mt-3 divide-y divide-line">
          <Row label="Name">{user.name}</Row>
          <Row label="Email">{user.email}</Row>
        </dl>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold">Hackathon registration</h2>
        {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
        {entry === undefined && !error && <p className="mt-3 text-slate-500">Loading...</p>}

        {entry === null && (
          <div className="mt-3">
            <p className="text-slate-600">You have not registered yet. It takes about five minutes.</p>
            <Link to="/register" className="btn-primary mt-4">Register now</Link>
          </div>
        )}

        {entry && (
          <>
            <dl className="mt-3 divide-y divide-line">
              <Row label="Project">{entry.projectName}</Row>
              <Row label="Domain / track">{entry.track}</Row>
              <Row label="College">{entry.college}</Row>
              <Row label="Course">{entry.course}, {entry.branch}, {entry.year}</Row>
              <Row label="Mobile">{entry.mobile}</Row>
              <Row label="PPT"><ExtLink href={entry.pptLink} /></Row>
              <Row label="Prototype"><ExtLink href={entry.prototypeLink} /></Row>
              <Row label="Demo video"><ExtLink href={entry.demoLink} /></Row>
              <Row label="Team size">{entry.teamSize}</Row>
              {entry.members.length > 0 && (
                <Row label="Team members">
                  <ul className="space-y-1">{entry.members.map((m) => <li key={m.email}>{m.name} ({m.email})</li>)}</ul>
                </Row>
              )}
            </dl>
            <button onClick={withdraw} className="btn-ghost mt-4 text-red-700">Withdraw registration</button>
          </>
        )}
      </section>
    </div>
  );
}
