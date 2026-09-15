import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import Logo from '../common/Logo';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ items, roleLabel, mobileOpen, onCloseMobile }) => {
  const { user, profile, logout } = useAuth();

  const displayName = profile?.fullName || profile?.recruiterName || user?.email || 'User';

  const content = (
    <div className="flex h-full flex-col bg-ink-950">
      <div className="flex items-center justify-between px-5 py-6">
        <Logo dark showText size={30} to={null} />
        <button onClick={onCloseMobile} className="text-ink-400 hover:text-white lg:hidden">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            className={({ isActive }) => (isActive ? 'sidebar-link-active' : 'sidebar-link')}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <Avatar name={displayName} size={34} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{displayName}</p>
            <p className="truncate text-xs text-ink-400">{roleLabel}</p>
          </div>
        </div>
        <button onClick={logout} className="sidebar-link w-full text-red-300 hover:bg-red-500/10 hover:text-red-300">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">{content}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/60" onClick={onCloseMobile} />
          <div className="absolute left-0 top-0 h-full w-72 animate-slide-in-left">{content}</div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
