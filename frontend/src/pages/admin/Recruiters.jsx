import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserCheck, Search, ShieldOff, ShieldCheck } from 'lucide-react';
import adminService from '../../services/admin.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import Pagination from '../../components/common/Pagination';
import useDebounce from '../../hooks/useDebounce';
import { getErrorMessage } from '../../services/api';

const Recruiters = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [recruiters, setRecruiters] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 400);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getRecruiters({ search: debouncedSearch || undefined, page, limit: 15 });
      setRecruiters(data.recruiters);
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
  }, [debouncedSearch, page]);

  const handleToggle = async (r) => {
    try {
      await adminService.toggleRecruiterStatus(r._id);
      toast.success('Recruiter status updated.');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Recruiters" subtitle="Manage recruiter accounts and their companies." />

      <div className="relative mb-5 w-64">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
        <input className="input pl-9" placeholder="Search recruiters..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : recruiters.length === 0 ? (
        <EmptyState icon={UserCheck} title="No recruiters found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Recruiter</th><th>Company</th><th>Location</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {recruiters.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={r.recruiterName} size={32} />
                      <div>
                        <p className="font-medium text-ink-800">{r.recruiterName}</p>
                        <p className="text-xs text-ink-400">{r.officialEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td>{r.company?.name}{r.company?.isVerified && <span className="badge-brand ml-2">Verified</span>}</td>
                  <td>{r.company?.location}</td>
                  <td>{r.user?.isActive ? <span className="badge-brand">Active</span> : <span className="badge-red">Inactive</span>}</td>
                  <td>
                    <button onClick={() => handleToggle(r)} className="flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-ink-800">
                      {r.user?.isActive ? <><ShieldOff size={13} /> Deactivate</> : <><ShieldCheck size={13} /> Activate</>}
                    </button>
                  </td>
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

export default Recruiters;
