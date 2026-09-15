import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ClipboardList } from 'lucide-react';
import applicationService from '../../services/application.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import { formatDate } from '../../utils/formatters';
import { APPLICATION_STATUSES, STATUS_LABELS } from '../../utils/constants';
import { getErrorMessage } from '../../services/api';

const Applications = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getApplications({ status: status || undefined, page, limit: 10 });
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
      <PageHeader title="My Applications" subtitle="Track the status of every job you've applied to." />

      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => { setStatus(''); setPage(1); }} className={`btn-sm ${!status ? 'btn-secondary' : 'btn-outline'}`}>All</button>
        {APPLICATION_STATUSES.map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} className={`btn-sm ${status === s ? 'btn-secondary' : 'btn-outline'}`}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : applications.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications found" description="Applications you submit will appear here." action={<Link to="/student/jobs" className="btn-primary">Browse Jobs</Link>} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Match Score</th>
                <th>Status</th>
                <th>Applied On</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="font-medium text-ink-800">{app.job?.title}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={app.job?.company?.name} src={app.job?.company?.logo} size={26} />
                      {app.job?.company?.name}
                    </div>
                  </td>
                  <td className="font-semibold text-brand-600">{app.matchScore}%</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>
                    <Link to={`/student/applications/${app._id}`} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default Applications;
