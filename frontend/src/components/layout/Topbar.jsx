import { Menu } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Topbar = ({ title, subtitle, onMenuClick, actions }) => (
  <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-ink-100 bg-paper-100/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
    <div className="flex min-w-0 items-center gap-3">
      <button onClick={onMenuClick} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink-500 hover:bg-ink-100 lg:hidden">
        <Menu size={20} />
      </button>
      <div className="min-w-0">
        <h1 className="truncate font-display text-lg font-bold text-ink-950 sm:text-xl">{title}</h1>
        {subtitle && <p className="truncate text-sm text-ink-400">{subtitle}</p>}
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      {actions}
      <NotificationBell />
    </div>
  </header>
);

export default Topbar;
