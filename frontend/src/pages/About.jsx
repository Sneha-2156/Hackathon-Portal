import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-4xl font-extrabold">About Code-a-Nova</h1>
      <p className="mt-5 text-lg text-slate-600">
        Code-a-Nova brings students together to build real projects in a short time. You choose a domain, build with
        your team and submit your slides, prototype and an optional demo video.
      </p>
      <h2 className="mt-10 text-2xl font-bold">How registration works</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
        <li>Create an account and verify your email with a 6-digit code.</li>
        <li>Log in to your dashboard.</li>
        <li>Fill in the registration form with your team and project details.</li>
        <li>Check your inbox for the confirmation email.</li>
      </ol>
      <Link to="/signup" className="btn-primary mt-8">Create an account</Link>
    </div>
  );
}
