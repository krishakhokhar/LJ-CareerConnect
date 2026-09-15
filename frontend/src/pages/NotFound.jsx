import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Logo from '../components/common/Logo';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-paper-100 px-6 text-center">
    <Logo className="mb-10" />
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
      <Compass size={30} />
    </div>
    <h1 className="mt-6 font-display text-4xl font-bold text-ink-950">404</h1>
    <p className="mt-2 text-ink-500">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary mt-6">Back to home</Link>
  </div>
);

export default NotFound;
