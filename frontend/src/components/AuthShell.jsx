// Centered card used by Signup, OTP and Login pages
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      <div className="card mt-6">{children}</div>
    </div>
  );
}
