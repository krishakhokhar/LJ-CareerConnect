import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-paper-50 px-6 py-14 text-center animate-fade-in">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
      <Icon size={26} />
    </div>
    <div>
      <p className="font-display text-base font-semibold text-ink-800">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-400">{description}</p>}
    </div>
    {action}
  </div>
);

export default EmptyState;
