import { useState } from 'react';
import { initials } from '../../utils/formatters';

const COLORS = ['bg-brand-100 text-brand-700', 'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700'];

const colorFor = (name = '') => {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return COLORS[sum % COLORS.length];
};

const Avatar = ({ name, src, size = 40, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const dimension = { width: size, height: size };

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        style={dimension}
        className={`rounded-full object-cover ring-1 ring-ink-100 ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      style={{ ...dimension, fontSize: size * 0.38 }}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${colorFor(name)} ${className}`}
    >
      {initials(name)}
    </div>
  );
};

export default Avatar;
