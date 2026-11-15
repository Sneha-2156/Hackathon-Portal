import { Link } from 'react-router-dom';
import Logo from './Logo';
import { contactEmail } from '../eventConfig';

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-3 max-w-xs text-sm">A hackathon for students who like to build things that work.</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Quick links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/signup" className="hover:text-white">Register</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Get in touch</h3>
          <a href={`mailto:${contactEmail}`} className="text-sm hover:text-white">{contactEmail}</a>
          {/* Replace the # links with your real social profiles */}
          <ul className="mt-3 flex gap-4 text-sm">
            <li><a href="#" className="hover:text-white">Instagram</a></li>
            <li><a href="#" className="hover:text-white">LinkedIn</a></li>
            <li><a href="#" className="hover:text-white">X</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} Code-a-Nova. All rights reserved.</p>
    </footer>
  );
}
