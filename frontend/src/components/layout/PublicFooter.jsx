import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import Logo from '../common/Logo';

const PublicFooter = () => (
  <footer className="border-t border-ink-800 bg-ink-950 text-ink-300">
    <div className="page-shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Logo dark showText size={30} />
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
          The AI-powered placement and career management platform connecting LJ University students, recruiters and the placement team.
        </p>
        <div className="mt-5 flex gap-3">
          {[Linkedin, Twitter, Instagram, Mail].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-ink-300 transition-colors hover:bg-brand-500/20 hover:text-brand-300"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <p className="font-display text-sm font-semibold text-white">Platform</p>
        <ul className="mt-4 space-y-2.5 text-sm">
          <li><a href="#features" className="hover:text-white">Features</a></li>
          <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
          <li><a href="#students" className="hover:text-white">For Students</a></li>
          <li><a href="#recruiters" className="hover:text-white">For Recruiters</a></li>
        </ul>
      </div>

      <div>
        <p className="font-display text-sm font-semibold text-white">Account</p>
        <ul className="mt-4 space-y-2.5 text-sm">
          <li><Link to="/login" className="hover:text-white">Login</Link></li>
          <li><Link to="/register?role=student" className="hover:text-white">Student Sign Up</Link></li>
          <li><Link to="/register?role=recruiter" className="hover:text-white">Recruiter Sign Up</Link></li>
        </ul>
      </div>

      <div>
        <p className="font-display text-sm font-semibold text-white">LJ University</p>
        <ul className="mt-4 space-y-2.5 text-sm">
          <li>LJ Campus, Ahmedabad, Gujarat</li>
          <li>placements@ljcareerconnect.edu</li>
          <li>+91 79 0000 0000</li>
        </ul>
      </div>
    </div>

    <div className="border-t border-white/10 py-6">
      <div className="page-shell flex flex-col items-center justify-between gap-3 text-xs text-ink-500 sm:flex-row">
        <p>© {new Date().getFullYear()} LJ CareerConnect. All rights reserved.</p>
        <p>Built for LJ University Placement & Career Management</p>
      </div>
    </div>
  </footer>
);

export default PublicFooter;
