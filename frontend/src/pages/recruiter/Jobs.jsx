import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Briefcase, Plus, Pencil, Trash2, Users, MoreVertical } from 'lucide-react';
import jobService from '../../services/job.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate, formatSalaryRange } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobs({ limit: 50 });
      setJobs(data.jobs);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (job, status) => {
    try {
      await jobService.updateJobStatus(job._id, status);
      toast.success(`Job marked as ${status.toLowerCase()}.`);
      setMenuOpen(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await jobService.deleteJob(deleteTarget._id);
      toast.success('Job deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="My Jobs" subtitle="Manage the roles you've posted." actions={<Link to="/recruiter/jobs/create" className="btn-primary"><Plus size={16} /> Post a Job</Link>} />

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs posted yet" description="Post your first job to start receiving applications." action={<Link to="/recruiter/jobs/create" className="btn-primary">Post a Job</Link>} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr><th>Job Title</th><th>Type</th><th>Salary</th><th>Applicants</th><th>Deadline</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="font-medium text-ink-800">{job.title}</td>
                  <td>{job.jobType}</td>
                  <td>{formatSalaryRange(job.salaryMin, job.salaryMax)}</td>
                  <td>
                    <Link to={`/recruiter/applicants?job=${job._id}`} className="flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700">
                      <Users size={13} /> {job.applicantsCount}
                    </Link>
                  </td>
                  <td>{formatDate(job.applicationDeadline)}</td>
                  <td><StatusBadge status={job.status} /></td>
                  <td className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === job._id ? null : job._id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100">
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === job._id && (
                      <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-ink-100 bg-white py-1.5 shadow-lift animate-slide-up">
                        <Link to={`/recruiter/jobs/${job._id}/edit`} className="flex items-center gap-2 px-3.5 py-2 text-sm text-ink-600 hover:bg-paper-100"><Pencil size={14} /> Edit</Link>
                        {job.status !== 'PUBLISHED' && <button onClick={() => handleStatusChange(job, 'PUBLISHED')} className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink-600 hover:bg-paper-100">Publish</button>}
                        {job.status !== 'CLOSED' && <button onClick={() => handleStatusChange(job, 'CLOSED')} className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink-600 hover:bg-paper-100">Close</button>}
                        <button onClick={() => { setDeleteTarget(job); setMenuOpen(null); }} className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"><Trash2 size={14} /> Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete job?" message={`Delete "${deleteTarget?.title}"? This will also remove all its applications.`} confirmLabel="Delete" />
    </div>
  );
};

export default Jobs;
