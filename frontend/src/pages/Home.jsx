import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { highlights, timeline, prizes } from '../eventConfig';

// Slow-turning orbit graphic: the one memorable element of the hero
function Orbit() {
  return (
    <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-sm" aria-hidden="true">
      <g fill="none" stroke="#12142B" strokeOpacity="0.18">
        <circle cx="200" cy="200" r="70" />
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="175" />
      </g>
      <g className="orbit">
        <circle cx="200" cy="130" r="9" fill="#3B3BF5" />
        <circle cx="320" cy="200" r="7" fill="#12142B" />
      </g>
      <g className="orbit orbit-reverse">
        <circle cx="200" cy="25" r="11" fill="#FFB800" />
        <circle cx="76" cy="290" r="6" fill="#3B3BF5" />
      </g>
      <circle cx="200" cy="200" r="26" fill="#FFB800" />
    </svg>
  );
}

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">Build the project you would want to show off.</h1>
          <p className="mt-5 max-w-md text-lg text-slate-600">
            Code-a-Nova is a student hackathon. Register your team, pick a domain and submit a working prototype.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={user ? '/register' : '/signup'} className="btn-primary">Register now</Link>
            {!user && <Link to="/login" className="btn-ghost">Login</Link>}
          </div>
        </div>
        <Orbit />
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title}>
              <h2 className="text-xl font-bold">{h.title}</h2>
              <p className="mt-2 text-slate-600">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-extrabold">Timeline</h2>
        {/* A real sequence, so a vertical rail with markers is appropriate */}
        <ol className="mt-8 max-w-2xl border-l-2 border-nova/30">
          {timeline.map((t) => (
            <li key={t.when} className="relative pb-8 pl-6 last:pb-0">
              <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-nova" />
              <h3 className="font-bold">{t.when}</h3>
              <p className="text-slate-600">{t.what}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold">Prizes</h2>
          <dl className="mt-8 grid gap-4 md:grid-cols-3">
            {prizes.map((p) => (
              <div key={p.place} className="rounded-2xl border border-white/15 p-6">
                <dt className="text-slate-300">{p.place}</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold text-flare">{p.amount}</dd>
              </div>
            ))}
          </dl>
          <Link to={user ? '/register' : '/signup'} className="btn mt-10 bg-flare text-ink hover:bg-yellow-300">Save your team's spot</Link>
        </div>
      </section>
    </>
  );
}
