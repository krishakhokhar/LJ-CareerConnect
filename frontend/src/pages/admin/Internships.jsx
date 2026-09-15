import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GraduationCap, Trash2 } from 'lucide-react';
import internshipService from '../../services/internship.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const AdminInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await internshipService.getInternships({ limit: 100 });
      setInternships(data.internships);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await internshipService.deleteInternship(deleteTarget._id);
      toast.success('Internship removed.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Internships" subtitle="Platform-wide view of all internship postings." />

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : internships.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No internships found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Title</th><th>Company</th><th>Duration</th><th>Deadline</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {internships.map((i) => (
                <tr key={i._id}>
                  <td className="font-medium text-ink-800">{i.title}</td>
                  <td>{i.company?.name}</td>
                  <td>{i.duration}</td>
                  <td>{formatDate(i.applicationDeadline)}</td>
                  <td><StatusBadge status={i.status} /></td>
                  <td><button onClick={() => setDeleteTarget(i)} className="text-ink-300 hover:text-red-500"><Trash2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete internship?" message={`Delete "${deleteTarget?.title}"?`} confirmLabel="Delete" />
    </div>
  );
};

export default AdminInternships;
