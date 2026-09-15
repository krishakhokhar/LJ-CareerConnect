import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../../services/auth.service';
import { TextField } from '../../components/forms/FormField';
import { getErrorMessage } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      setSent(true);
      if (data?.resetUrl) setDevResetUrl(data.resetUrl);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="animate-fade-in text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <MailCheck size={26} />
        </div>
        <h1 className="mt-5 font-display text-xl font-bold text-ink-950">Check your email</h1>
        <p className="mt-2 text-sm text-ink-500">
          If an account exists for <span className="font-semibold text-ink-700">{email}</span>, a password reset link has been sent.
        </p>
        {devResetUrl && (
          <div className="mt-5 rounded-xl border border-dashed border-brand-300 bg-brand-50 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Demo Mode</p>
            <p className="mt-1 text-xs text-ink-500">No email service is configured. Use this link to reset your password:</p>
            <Link to={devResetUrl.replace(window.location.origin, '')} className="mt-2 block break-all text-xs font-medium text-brand-700 underline">
              {devResetUrl}
            </Link>
          </div>
        )}
        <Link to="/login" className="btn-outline mt-6 w-full">Back to login</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-ink-950">Forgot your password?</h1>
      <p className="mt-1.5 text-sm text-ink-400">Enter your email and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Sending...' : (<><Send size={16} /> Send Reset Link</>)}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Log in</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
