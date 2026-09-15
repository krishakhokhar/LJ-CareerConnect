import { Outlet, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Logo from '../components/common/Logo';

const POINTS = [
  'AI-matched jobs and internships tailored to your skills',
  'Track every application from applied to offer',
  'Real-time interview scheduling and notifications',
  'Skill gap analysis to guide your career growth',
];

const AuthLayout = () => (
  <div className="grid min-h-screen bg-paper-100 lg:grid-cols-2">
    <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-950 p-12 text-white lg:flex">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand-700/20 blur-3xl" />

      <Logo dark showText size={32} className="relative" />

      <div className="relative">
        <h2 className="font-display text-3xl font-bold leading-snug">
          Your career journey starts with the right connection.
        </h2>
        <ul className="mt-8 space-y-4">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm text-ink-300">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-400" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-ink-500">© {new Date().getFullYear()} LJ CareerConnect. All rights reserved.</p>
    </div>

    <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-10">
      <div className="mb-8 lg:hidden">
        <Logo />
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
      <p className="mt-8 text-center text-xs text-ink-400">
        <Link to="/" className="hover:text-ink-600">← Back to home</Link>
      </p>
    </div>
  </div>
);

export default AuthLayout;
