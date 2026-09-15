import { STATUS_BADGE_CLASS, STATUS_LABELS } from '../../utils/constants';

const StatusBadge = ({ status, className = '' }) => {
  const badgeClass = STATUS_BADGE_CLASS[status] || 'badge-neutral';
  const label = STATUS_LABELS[status] || status;
  return <span className={`${badgeClass} ${className}`}>{label}</span>;
};

export default StatusBadge;
