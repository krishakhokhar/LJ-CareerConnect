import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Search, ShieldOff, ShieldCheck } from 'lucide-react';
import adminService from '../../services/admin.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import Pagination from '../../components/common/Pagination';
import { SelectField } from '../../components/forms/FormField';
import useDebounce from '../../hooks/useDebounce';
import { DEPARTMENTS } from '../../utils/constants';
import { getErrorMessage } from '../../services/api';

const Students = () => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 400);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getStudents({ search: debouncedSearch || undefined, department: department || undefined, page, limit: 15 });
      setStudents(data.students);
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
  }, [debouncedSearch, department, page]);

  const handleToggle = async (student) => {
    try {
      await adminService.toggleStudentStatus(student._id);
      toast.success('Student status updated.');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Students" subtitle="Manage all registered student accounts." />

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input className="input pl-9" placeholder="Search by name or ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <SelectField className="w-56" value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </SelectField>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : students.length === 0 ? (
        <EmptyState icon={Users} title="No students found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Student</th><th>Course</th><th>Department</th><th>Placed</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.fullName} size={32} />
                      <div>
                        <p className="font-medium text-ink-800">{s.fullName}</p>
                        <p className="text-xs text-ink-400">{s.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td>{s.course}</td>
                  <td>{s.department}</td>
                  <td>{s.isPlaced ? <span className="badge-brand">Placed</span> : <span className="badge-neutral">Not Placed</span>}</td>
                  <td>{s.user?.isActive ? <span className="badge-brand">Active</span> : <span className="badge-red">Inactive</span>}</td>
                  <td>
                    <button onClick={() => handleToggle(s)} className="flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-ink-800">
                      {s.user?.isActive ? <><ShieldOff size={13} /> Deactivate</> : <><ShieldCheck size={13} /> Activate</>}
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

export default Students;
