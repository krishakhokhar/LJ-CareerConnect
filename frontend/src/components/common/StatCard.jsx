const TONE_STYLES = {
  brand: 'bg-brand-50 text-brand-700',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  purple: 'bg-purple-50 text-purple-700',
  ink: 'bg-ink-100 text-ink-700',
  red: 'bg-red-50 text-red-700',
};

const StatCard = ({ label, value, icon: Icon, tone = 'brand', trend }) => (
  <div className="stat-card animate-slide-up">
    <div>
      <p className="text-sm font-medium text-ink-400">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-bold text-ink-950">{value}</p>
      {trend && <p className="mt-1 text-xs font-medium text-brand-600">{trend}</p>}
    </div>
    {Icon && (
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TONE_STYLES[tone]}`}>
        <Icon size={22} />
      </div>
    )}
  </div>
);

export default StatCard;
