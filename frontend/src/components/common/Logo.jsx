import { Link } from 'react-router-dom';

const Mark = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
    <rect width="32" height="32" rx="9" className="fill-ink-950" />
    <circle cx="10" cy="12" r="3.4" className="fill-brand-400" />
    <circle cx="22" cy="20" r="3.4" className="fill-brand-400" />
    <path d="M12.6 14.2L19.4 17.8" className="stroke-brand-400" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Logo = ({ to = '/', dark = false, className = '', showText = true, size = 34 }) => {
  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Mark size={size} />
      {showText && (
        <span className={`font-display font-bold leading-none tracking-tight ${dark ? 'text-white' : 'text-ink-950'}`}>
          LJ <span className="text-brand-500">CareerConnect</span>
        </span>
      )}
    </div>
  );

  if (!to) return content;
  return (
    <Link to={to} className="inline-flex">
      {content}
    </Link>
  );
};

export default Logo;
