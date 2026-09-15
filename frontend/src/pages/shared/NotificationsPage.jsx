import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import notificationService from '../../services/notification.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import { timeAgo } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications({ page, limit: 15 });
      setNotifications(data.notifications);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    load();
  };

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    load();
  };

  const handleDelete = async (id) => {
    await notificationService.deleteNotification(id);
    toast.success('Notification deleted.');
    load();
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on applications, interviews and announcements."
        actions={<button onClick={handleMarkAllRead} className="btn-outline btn-sm"><CheckCheck size={14} /> Mark all read</button>}
      />

      {loading ? (
        <div className="flex h-52 items-center justify-center"><Spinner size={24} /></div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="card divide-y divide-ink-100">
          {notifications.map((n) => (
            <div key={n._id} className={`flex items-start justify-between gap-3 p-4 ${!n.isRead ? 'bg-brand-50/30' : ''}`}>
              <Link to={n.link || '#'} onClick={() => !n.isRead && handleMarkRead(n._id)} className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-800">{n.title}</p>
                <p className="mt-0.5 text-sm text-ink-500">{n.message}</p>
                <p className="mt-1.5 text-xs text-ink-300">{timeAgo(n.createdAt)}</p>
              </Link>
              <button onClick={() => handleDelete(n._id)} className="shrink-0 text-ink-300 hover:text-red-500"><Trash2 size={15} /></button>
            </div>
          ))}
          {pagination && (
            <div className="px-4">
              <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
