import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Users, FileText, Star, XCircle, CalendarPlus, Eye } from 'lucide-react';
import recruiterService from '../../services/recruiter.service';
import jobService from '../../services/job.service';
import applicationService from '../../services/application.service';
import interviewService from '../../services/interview.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { TextField, SelectField, TextAreaField } from '../../components/forms/FormField';
import { APPLICATION_STATUSES, STATUS_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const scheduleInitial = { scheduledDate: '', scheduledTime: '', interviewType: 'Online', meetingLink: '', location: '', round: 'Round 1', notes: '' };

const Applicants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const jobFilter = searchParams.get('job') || '';
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [profileTarget, setProfileTarget] = useState(null);
  const [scheduleTarget, setScheduleTarget] = useState(null);
  const [scheduleForm, setScheduleForm] = useState(scheduleInitial);
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    jobService.getJobs({ limit: 100 }).then((d) => setJobs(d.jobs)).catch(() => {});
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await recruiterService.getApplicants({ jobId: jobFilter || undefined, status: status || undefined, page, limit: 10 });
      setApplicants(data.applicants);
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
  }, [jobFilter, status, page]);

  const handleStatusChange = async (app, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(app._id, { status: newStatus });
      toast.success(`Application marked as ${STATUS_LABELS[newStatus]}.`);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setScheduling(true);
    try {
      await interviewService.scheduleInterview({ applicationId: scheduleTarget._id, ...scheduleForm });
      toast.success('Interview scheduled successfully.');
      setScheduleTarget(null);
      setScheduleForm(scheduleInitial);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div>
      <PageHeader title="Applicants" subtitle="Review and manage candidates across all your job postings." />

      <div className="mb-5 flex flex-wrap gap-3">
        <SelectField className="w-56" value={jobFilter} onChange={(e) => { setSearchParams(e.target.value ? { job: e.target.value } : {}); setPage(1); }}>
          <option value="">All Jobs</option>
          {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
        </SelectField>
        <SelectField className="w-48" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </SelectField>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : applicants.length === 0 ? (
        <EmptyState icon={Users} title="No applicants found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr><th>Student</th><th>Course</th><th>Applied</th><th>Match Score</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app._id}>
                  <td>
                    <button onClick={() => setProfileTarget(app)} className="flex items-center gap-2.5 text-left hover:text-brand-600">
                      <Avatar name={app.student?.fullName} src={app.student?.profilePhoto} size={32} />
                      <span className="font-medium text-ink-800">{app.student?.fullName}</span>
                    </button>
                  </td>
                  <td>{app.student?.course}, Sem {app.student?.semester}</td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td className="font-semibold text-brand-600">{app.matchScore}%</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button title="View Profile" onClick={() => setProfileTarget(app)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100"><Eye size={15} /></button>
                      <a title="Resume" href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100"><FileText size={15} /></a>
                      <button title="Shortlist" onClick={() => handleStatusChange(app, 'SHORTLISTED')} className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50"><Star size={15} /></button>
                      <button title="Schedule Interview" onClick={() => setScheduleTarget(app)} className="flex h-8 w-8 items-center justify-center rounded-lg text-purple-500 hover:bg-purple-50"><CalendarPlus size={15} /></button>
                      <button title="Reject" onClick={() => handleStatusChange(app, 'REJECTED')} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"><XCircle size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination && <div className="px-4"><Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} /></div>}
        </div>
      )}

      <Modal open={Boolean(profileTarget)} onClose={() => setProfileTarget(null)} title="Candidate Profile" size="lg">
        {profileTarget && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={profileTarget.student?.fullName} size={56} />
              <div>
                <p className="font-display text-lg font-bold text-ink-950">{profileTarget.student?.fullName}</p>
                <p className="text-sm text-ink-500">{profileTarget.student?.course}, {profileTarget.student?.department} · Semester {profileTarget.student?.semester}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-paper-100 p-4">
                <p className="text-xs font-semibold text-ink-400">Match Score</p>
                <p className="mt-1 font-display text-xl font-bold text-brand-600">{profileTarget.matchScore}%</p>
              </div>
              <div className="rounded-xl bg-paper-100 p-4">
                <p className="text-xs font-semibold text-ink-400">Status</p>
                <StatusBadge status={profileTarget.status} className="mt-1.5" />
              </div>
            </div>
            {profileTarget.matchedSkills?.length > 0 && (
              <div className="mt-4">
                <p className="mb-1.5 text-xs font-semibold text-ink-500">Matched Skills</p>
                <div className="flex flex-wrap gap-1.5">{profileTarget.matchedSkills.map((s) => <span key={s} className="badge-brand">{s}</span>)}</div>
              </div>
            )}
            {profileTarget.coverNote && (
              <div className="mt-4">
                <p className="mb-1.5 text-xs font-semibold text-ink-500">Cover Note</p>
                <p className="text-sm text-ink-600">{profileTarget.coverNote}</p>
              </div>
            )}
            <a href={profileTarget.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline mt-5 w-full"><FileText size={15} /> View Resume</a>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(scheduleTarget)}
        onClose={() => setScheduleTarget(null)}
        title={`Schedule Interview — ${scheduleTarget?.student?.fullName || ''}`}
        footer={<><button className="btn-outline" onClick={() => setScheduleTarget(null)}>Cancel</button><button form="schedule-form" className="btn-primary" disabled={scheduling}>{scheduling ? 'Scheduling...' : 'Schedule'}</button></>}
      >
        <form id="schedule-form" onSubmit={handleSchedule} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Date" type="date" required value={scheduleForm.scheduledDate} onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })} />
            <TextField label="Time" type="time" required value={scheduleForm.scheduledTime} onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Interview Type" value={scheduleForm.interviewType} onChange={(e) => setScheduleForm({ ...scheduleForm, interviewType: e.target.value })}>
              <option>Online</option><option>In-person</option><option>Telephonic</option>
            </SelectField>
            <TextField label="Round" value={scheduleForm.round} onChange={(e) => setScheduleForm({ ...scheduleForm, round: e.target.value })} />
          </div>
          {scheduleForm.interviewType === 'Online' ? (
            <TextField label="Meeting Link" value={scheduleForm.meetingLink} onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })} placeholder="https://meet.google.com/..." />
          ) : (
            <TextField label="Location" value={scheduleForm.location} onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })} />
          )}
          <TextAreaField label="Notes" rows={3} value={scheduleForm.notes} onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
};

export default Applicants;
