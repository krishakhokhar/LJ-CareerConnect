import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo';

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Students', href: '#students' },
  { label: 'For Recruiters', href: '#recruiters' },
  { label: 'About', href: '#about' },
];

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-paper-100/85 backdrop-blur-md">
      <nav className="page-shell flex items-center justify-between py-4">
        <Logo />

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-950">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login" className="btn-ghost btn-sm">
            Login
          </Link>
          <Link to="/register" className="btn-primary btn-sm">
            Get Started
          </Link>
        </div>

        <button onClick={() => setOpen((o) => !o)} className="text-ink-600 lg:hidden">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-100 bg-white px-4 py-4 animate-slide-up lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-paper-100"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2 border-t border-ink-100 pt-3">
              <Link to="/login" className="btn-outline btn-sm flex-1">
                Login
              </Link>
              <Link to="/register" className="btn-primary btn-sm flex-1">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
