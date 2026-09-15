import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Briefcase, Trash2 } from 'lucide-react';
import jobService from '../../services/job.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate, formatSalaryRange } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobs({ limit: 100 });
      setJobs(data.jobs);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await jobService.deleteJob(deleteTarget._id);
      toast.success('Job removed.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Jobs" subtitle="Platform-wide oversight of all posted jobs." />

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Job</th><th>Company</th><th>Salary</th><th>Applicants</th><th>Deadline</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="font-medium text-ink-800">{job.title}</td>
                  <td>{job.company?.name}</td>
                  <td>{formatSalaryRange(job.salaryMin, job.salaryMax)}</td>
                  <td>{job.applicantsCount}</td>
                  <td>{formatDate(job.applicationDeadline)}</td>
                  <td><StatusBadge status={job.status} /></td>
                  <td><button onClick={() => setDeleteTarget(job)} className="text-ink-300 hover:text-red-500"><Trash2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete job?" message={`Delete "${deleteTarget?.title}"?`} confirmLabel="Delete" />
    </div>
  );
};

export default AdminJobs;
