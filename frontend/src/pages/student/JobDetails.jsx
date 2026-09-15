import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin, Briefcase, Calendar, Users, GraduationCap, Bookmark, CheckCircle2, ArrowLeft, Building2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import jobService from '../../services/job.service';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import { TextAreaField } from '../../components/forms/FormField';
import { formatDate, formatSalaryRange, daysUntil } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, setData } = useFetch(() => jobService.getJobById(id), [id]);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <PageLoader label="Loading job details..." />;
  if (error) return <EmptyState title="Job not found" description={error} action={<Link to="/student/jobs" className="btn-primary">Back to Jobs</Link>} />;

  const { job, aiMatchScore, hasApplied, isSaved } = data;
  const deadline = daysUntil(job.applicationDeadline);

  const handleApply = async () => {
    setSubmitting(true);
    try {
      await jobService.applyToJob(id, { coverNote });
      toast.success('Application submitted successfully!');
      setApplyOpen(false);
      setData({ ...data, hasApplied: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await jobService.toggleSaveJob(id);
      setData({ ...data, isSaved: res.saved });
      toast.success(res.saved ? 'Job saved' : 'Removed from saved jobs');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <Avatar name={job.company?.name} src={job.company?.logo} size={56} className="rounded-2xl" />
                <div>
                  <h1 className="font-display text-2xl font-bold text-ink-950">{job.title}</h1>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-500">
                    <Building2 size={14} /> {job.company?.name}
                  </p>
                </div>
              </div>
              {typeof aiMatchScore === 'number' && (
                <div className="rounded-2xl bg-brand-50 px-4 py-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-brand-700">AI Match</p>
                  <p className="font-display text-2xl font-extrabold text-brand-700">{aiMatchScore}%</p>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-100 pt-5 text-sm text-ink-600">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location} · {job.workMode}</span>
              <span className="flex items-center gap-1.5"><Briefcase size={14} /> {job.jobType}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> Apply by {formatDate(job.applicationDeadline)}</span>
              <span className="flex items-center gap-1.5"><Users size={14} /> {job.openings} openings</span>
            </div>
          </div>

          <div className="card space-y-6 p-6">
            <div>
              <h3 className="font-display text-base font-bold text-ink-950">Job Description</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-600">{job.description}</p>
            </div>

            {job.responsibilities?.length > 0 && (
              <div>
                <h3 className="font-display text-base font-bold text-ink-950">Responsibilities</h3>
                <ul className="mt-2 space-y-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-600"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-brand-500" /> {r}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div>
                <h3 className="font-display text-base font-bold text-ink-950">Requirements</h3>
                <ul className="mt-2 space-y-2">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-600"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-brand-500" /> {r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-display text-base font-bold text-ink-950">Required Skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.skills.map((s) => <span key={s} className="badge-neutral">{s}</span>)}
              </div>
            </div>

            {job.qualification && (
              <div className="flex items-center gap-2 text-sm text-ink-600">
                <GraduationCap size={16} className="text-ink-400" /> {job.qualification}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Salary Range</p>
            <p className="mt-1 font-display text-xl font-bold text-ink-950">{formatSalaryRange(job.salaryMin, job.salaryMax)}</p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-400">Experience</p>
            <p className="mt-1 text-sm font-medium text-ink-700">{job.experienceRequired}</p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-400">Application Deadline</p>
            <p className={`mt-1 text-sm font-medium ${deadline <= 3 ? 'text-red-600' : 'text-ink-700'}`}>
              {formatDate(job.applicationDeadline)} {deadline >= 0 ? `(${deadline}d left)` : '(closed)'}
            </p>

            <div className="mt-6 space-y-2.5">
              <button
                onClick={() => setApplyOpen(true)}
                disabled={hasApplied || deadline < 0}
                className="btn-primary w-full py-3"
              >
                {hasApplied ? 'Already Applied' : deadline < 0 ? 'Applications Closed' : 'Apply Now'}
              </button>
              <button onClick={handleSave} className={`btn-outline w-full ${isSaved ? 'border-brand-300 bg-brand-50 text-brand-700' : ''}`}>
                <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save Job'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title={`Apply to ${job.title}`}
        footer={
          <>
            <button className="btn-outline" onClick={() => setApplyOpen(false)} disabled={submitting}>Cancel</button>
            <button className="btn-primary" onClick={handleApply} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-500">Your current resume on file will be submitted with this application.</p>
        <TextAreaField
          label="Cover Note (optional)"
          className="mt-4"
          rows={5}
          placeholder="Tell the recruiter why you're a great fit..."
          value={coverNote}
          onChange={(e) => setCoverNote(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default JobDetails;
