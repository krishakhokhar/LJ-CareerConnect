import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../../services/auth.service';
import PasswordField from '../../components/forms/PasswordField';
import { getErrorMessage } from '../../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      toast.success('Password reset successful!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="animate-fade-in text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <CheckCircle2 size={26} />
        </div>
        <h1 className="mt-5 font-display text-xl font-bold text-ink-950">Password reset!</h1>
        <p className="mt-2 text-sm text-ink-500">You can now log in with your new password.</p>
        <button onClick={() => navigate('/login')} className="btn-primary mt-6 w-full">Go to login</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-ink-950">Set a new password</h1>
      <p className="mt-1.5 text-sm text-ink-400">Choose a strong password for your account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <PasswordField label="New Password" name="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <PasswordField label="Confirm Password" name="confirm-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" error={error} />
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Resetting...' : (<><KeyRound size={16} /> Reset Password</>)}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Back to login</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
