import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ClipboardList } from 'lucide-react';
import applicationService from '../../services/application.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import Pagination from '../../components/common/Pagination';
import { SelectField } from '../../components/forms/FormField';
import { APPLICATION_STATUSES, STATUS_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const AdminApplications = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getApplications({ status: status || undefined, page, limit: 15 });
      setApplications(data.applications);
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
  }, [status, page]);

  return (
    <div>
      <PageHeader title="Applications" subtitle="Platform-wide view of every job application." />

      <SelectField className="mb-5 w-56" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
        <option value="">All Statuses</option>
        {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
      </SelectField>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : applications.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Student</th><th>Job</th><th>Company</th><th>Match</th><th>Status</th><th>Applied</th></tr></thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td><div className="flex items-center gap-2"><Avatar name={app.student?.fullName} size={28} />{app.student?.fullName}</div></td>
                  <td className="font-medium text-ink-800">{app.job?.title}</td>
                  <td>{app.job?.company?.name}</td>
                  <td className="font-semibold text-brand-600">{app.matchScore}%</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>{formatDate(app.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination && <div className="px-4"><Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} /></div>}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
