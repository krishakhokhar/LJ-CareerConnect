import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Password input with a show/hide toggle.
 *
 * Icon reflects the CURRENT state (not the action a click will take):
 *   isPasswordHidden === true  (default) -> type="password", masked, EyeOff icon (password is currently hidden)
 *   isPasswordHidden === false           -> type="text",     plain,  Eye icon    (password is currently visible)
 *
 * The toggle is a type="button" so it can never submit the surrounding form,
 * and it's positioned inside a wrapper around the <input> only (not the
 * label), so it stays put even if the label text wraps to two lines.
 */
const PasswordField = ({ label, error, required, className = '', id, ...props }) => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const inputId = id || props.name;

  const toggleVisibility = () => setIsPasswordHidden((currentlyHidden) => !currentlyHidden);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={isPasswordHidden ? 'password' : 'text'}
          className={`input pr-11 ${error ? 'input-error' : ''}`}
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={isPasswordHidden ? 'Show password' : 'Hide password'}
          aria-pressed={!isPasswordHidden}
          tabIndex={-1}
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-ink-400 transition-colors hover:text-ink-600"
        >
          {isPasswordHidden ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};

export default PasswordField;
