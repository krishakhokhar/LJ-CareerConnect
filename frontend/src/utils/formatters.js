export const formatDate = (date, options = {}) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const timeAgo = (date) => {
  if (!date) return '-';
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units = [
    { label: 'y', secs: 31536000 },
    { label: 'mo', secs: 2592000 },
    { label: 'd', secs: 86400 },
    { label: 'h', secs: 3600 },
    { label: 'm', secs: 60 },
  ];
  for (const u of units) {
    const val = Math.floor(seconds / u.secs);
    if (val >= 1) return `${val}${u.label} ago`;
  }
  return 'just now';
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '-';
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} LPA`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatSalaryRange = (min, max) => {
  if (!min && !max) return 'Not disclosed';
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
};

export const initials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};

export const daysUntil = (date) => {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
