import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { TextField } from '../../components/forms/FormField';
import PasswordField from '../../components/forms/PasswordField';
import GoogleAuthButton from '../../components/common/GoogleAuthButton';
import { getErrorMessage } from '../../services/api';

const ROLE_HOME = { ADMIN: '/admin/dashboard', STUDENT: '/student/dashboard', RECRUITER: '/recruiter/dashboard' };

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(form);
      toast.success('Welcome back!');
      const redirectTo = location.state?.from?.pathname || ROLE_HOME[data.user.role] || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-ink-950">Welcome back</h1>
      <p className="mt-1.5 text-sm text-ink-400">Log in to continue to your dashboard.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <TextField
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
        <PasswordField
          label="Password"
          name="password"
          required
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Logging in...' : (<><LogIn size={17} /> Login</>)}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink-100" />
        <span className="text-xs font-medium text-ink-300">OR</span>
        <div className="h-px flex-1 bg-ink-100" />
      </div>

      <GoogleAuthButton label="Continue with Google" />

      <p className="mt-6 text-center text-sm text-ink-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
          Get started
        </Link>
      </p>
    </div>
  );
};

export default Login;
