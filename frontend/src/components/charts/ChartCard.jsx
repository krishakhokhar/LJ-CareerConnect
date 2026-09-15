import { BarChart3 } from 'lucide-react';

const ChartCard = ({ title, subtitle, action, children, isEmpty, emptyLabel = 'No data yet' }) => (
  <div className="card p-5 sm:p-6">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <p className="font-display text-sm font-bold text-ink-950">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
      </div>
      {action}
    </div>
    {isEmpty ? (
      <div className="flex h-52 flex-col items-center justify-center gap-2 text-ink-300">
        <BarChart3 size={28} />
        <p className="text-xs font-medium">{emptyLabel}</p>
      </div>
    ) : (
      children
    )}
  </div>
);

export default ChartCard;
