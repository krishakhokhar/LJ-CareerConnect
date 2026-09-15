import toast from 'react-hot-toast';
import GoogleIcon from './GoogleIcon';

/**
 * Google OAuth is not configured in this project's backend yet (no
 * passport/google-auth-library dependency and no OAuth routes exist - see
 * the TODO in backend/src/routes/auth.routes.js). This button is fully
 * rendered and accessible, but intentionally does not perform or fake any
 * authentication - it explains that clearly instead of failing silently.
 */
const GoogleAuthButton = ({ label = 'Continue with Google' }) => {
  const handleClick = () => {
    toast('Google sign-in isn’t configured yet — please use email and password.', { icon: 'ℹ️' });
  };

  return (
    <button type="button" onClick={handleClick} aria-label={label} title={label} className="btn-outline w-full">
      <GoogleIcon size={18} />
      <span>{label}</span>
    </button>
  );
};

export default GoogleAuthButton;
