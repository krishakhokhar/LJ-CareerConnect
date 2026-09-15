import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 20, className = '' }) => (
  <Loader2 size={size} className={`animate-spin text-brand-600 ${className}`} />
);

export const PageLoader = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 text-ink-400">
    <Spinner size={30} />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export default Spinner;
