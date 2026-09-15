import { Video, MapPin, Calendar, Clock, Building2, Link as LinkIcon } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import interviewService from '../../services/interview.service';
import PageHeader from '../../components/common/PageHeader';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import { formatDate } from '../../utils/formatters';

const Interviews = () => {
  const { data: interviews, loading, error } = useFetch(() => interviewService.getInterviews(), []);

  if (loading) return <PageLoader label="Loading interviews..." />;
  if (error) return <EmptyState title="Couldn't load interviews" description={error} />;

  return (
    <div>
      <PageHeader title="Interviews" subtitle="All your scheduled and past interviews in one place." />

      {interviews.length === 0 ? (
        <EmptyState icon={Video} title="No interviews yet" description="Interviews scheduled by recruiters will show up here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {interviews.map((iv) => (
            <div key={iv._id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Avatar name={iv.job?.company?.name} src={iv.job?.company?.logo} size={42} className="rounded-xl" />
                  <div>
                    <p className="font-display text-sm font-bold text-ink-950">{iv.job?.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500"><Building2 size={12} /> {iv.job?.company?.name}</p>
                  </div>
                </div>
                <StatusBadge status={iv.status} />
              </div>

              <div className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm text-ink-600">
                <p className="flex items-center gap-2"><Calendar size={14} className="text-ink-400" /> {formatDate(iv.scheduledDate)}</p>
                <p className="flex items-center gap-2"><Clock size={14} className="text-ink-400" /> {iv.scheduledTime} · {iv.round}</p>
                <p className="flex items-center gap-2">
                  {iv.interviewType === 'Online' ? <LinkIcon size={14} className="text-ink-400" /> : <MapPin size={14} className="text-ink-400" />}
                  {iv.interviewType === 'Online' ? 'Online Interview' : iv.location || 'In-person'}
                </p>
              </div>

              {iv.meetingLink && iv.status === 'SCHEDULED' && (
                <a href={iv.meetingLink} target="_blank" rel="noreferrer" className="btn-primary mt-4 w-full">
                  Join Meeting
                </a>
              )}
              {iv.feedback && (
                <div className="mt-3 rounded-xl bg-paper-100 p-3">
                  <p className="text-xs font-semibold text-ink-500">Feedback</p>
                  <p className="mt-1 text-xs text-ink-600">{iv.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Interviews;
