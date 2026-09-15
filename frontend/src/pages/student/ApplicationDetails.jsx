import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2, FileText } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import applicationService from '../../services/application.service';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import StatusTimeline from '../../components/common/StatusTimeline';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import { formatDate } from '../../utils/formatters';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: application, loading, error } = useFetch(() => applicationService.getApplicationById(id), [id]);

  if (loading) return <PageLoader label="Loading application..." />;
  if (error) return <EmptyState title="Application not found" description={error} action={<Link to="/student/applications" className="btn-primary">Back</Link>} />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar name={application.job?.company?.name} src={application.job?.company?.logo} size={52} className="rounded-2xl" />
              <div>
                <h1 className="font-display text-xl font-bold text-ink-950">{application.job?.title}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                  <Building2 size={14} /> {application.job?.company?.name}
                  <MapPin size={14} className="ml-2" /> {application.job?.company?.location}
                </p>
              </div>
            </div>
            <StatusBadge status={application.status} />
          </div>

          <div className="mt-8 border-t border-ink-100 pt-6">
            <h3 className="mb-5 font-display text-sm font-bold text-ink-950">Application Progress</h3>
            <StatusTimeline status={application.status} />
          </div>

          {application.coverNote && (
            <div className="border-t border-ink-100 pt-6">
              <h3 className="mb-2 font-display text-sm font-bold text-ink-950">Your Cover Note</h3>
              <p className="text-sm leading-relaxed text-ink-600">{application.coverNote}</p>
            </div>
          )}

          {application.recruiterNotes && (
            <div className="mt-4 rounded-xl bg-paper-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Recruiter Notes</p>
              <p className="mt-1 text-sm text-ink-600">{application.recruiterNotes}</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">AI Match Score</p>
            <p className="mt-1 font-display text-2xl font-bold text-brand-600">{application.matchScore}%</p>

            {application.matchedSkills?.length > 0 && (
              <div className="mt-4">
                <p className="mb-1.5 text-xs font-semibold text-ink-500">Matched Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {application.matchedSkills.map((s) => <span key={s} className="badge-brand">{s}</span>)}
                </div>
              </div>
            )}
            {application.missingSkills?.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-semibold text-ink-500">Missing Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {application.missingSkills.map((s) => <span key={s} className="badge-neutral">{s}</span>)}
                </div>
              </div>
            )}
          </div>

          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Applied On</p>
            <p className="mt-1 text-sm font-medium text-ink-700">{formatDate(application.createdAt)}</p>
            <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline mt-4 w-full">
              <FileText size={15} /> View Submitted Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
