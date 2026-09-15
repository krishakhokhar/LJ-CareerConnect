import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import notificationService from '../../services/notification.service';
import { timeAgo } from '../../utils/formatters';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const load = async () => {
    try {
      const data = await notificationService.getNotifications({ limit: 8 });
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      // silent - notifications are non-critical
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleMarkAll = async () => {
    await notificationService.markAllAsRead();
    load();
  };

  const handleClickNotification = async (n) => {
    if (!n.isRead) await notificationService.markAsRead(n._id);
    load();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-ink-100"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 animate-slide-up rounded-2xl border border-ink-100 bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
            <p className="font-display text-sm font-bold text-ink-950">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={handleMarkAll} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-400">You're all caught up.</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  to={n.link || '#'}
                  onClick={() => handleClickNotification(n)}
                  className={`block border-b border-ink-50 px-4 py-3 transition-colors hover:bg-paper-100 ${!n.isRead ? 'bg-brand-50/40' : ''}`}
                >
                  <p className="text-sm font-semibold text-ink-800">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{n.message}</p>
                  <p className="mt-1 text-[11px] text-ink-300">{timeAgo(n.createdAt)}</p>
                </Link>
              ))
            )}
          </div>
          <Link
            to="notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-ink-100 px-4 py-2.5 text-center text-xs font-semibold text-brand-600 hover:bg-paper-100"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
