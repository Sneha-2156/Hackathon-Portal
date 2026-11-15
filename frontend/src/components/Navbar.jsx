import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : [{ to: '/login', label: 'Login' }, { to: '/signup', label: 'Signup' }]),
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `block rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-nova/10 text-nova' : 'text-ink hover:bg-slate-100'}`;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main">
        <Link to="/" onClick={() => setOpen(false)}><Logo /></Link>

        {/* Hamburger (mobile) */}
        <button
          className="rounded-md p-2 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <ul className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-1 border-b border-line bg-paper p-3 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>{l.label}</NavLink>
            </li>
          ))}
          <li className="md:ml-2">
            {user ? (
              <button onClick={handleLogout} className="btn-ghost w-full">Logout</button>
            ) : (
              <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary w-full">Register now</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
