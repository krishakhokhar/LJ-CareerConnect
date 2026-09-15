import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { homePath, isAuthenticated } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-100 px-6 text-center">
      <Logo className="mb-10" />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <ShieldAlert size={30} />
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold text-ink-950">Access denied</h1>
      <p className="mt-2 max-w-sm text-ink-500">You don't have permission to view this page with your current account role.</p>
      <Link to={isAuthenticated ? homePath : '/'} className="btn-primary mt-6">
        {isAuthenticated ? 'Go to my dashboard' : 'Back to home'}
      </Link>
    </div>
  );
};

export default Unauthorized;
