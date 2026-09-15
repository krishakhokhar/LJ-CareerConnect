import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Bookmark, Clock, Building2 } from 'lucide-react';
import { formatSalaryRange, daysUntil } from '../../utils/formatters';
import Avatar from '../common/Avatar';

const matchTone = (score) => {
  if (score >= 80) return 'text-brand-700 bg-brand-100';
  if (score >= 60) return 'text-blue-700 bg-blue-100';
  if (score >= 40) return 'text-amber-700 bg-amber-100';
  return 'text-ink-500 bg-ink-100';
};

const JobCard = ({ job, isSaved, onToggleSave, linkTo }) => {
  const deadline = daysUntil(job.applicationDeadline);

  return (
    <div className="card-hover flex flex-col gap-4 p-5 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar name={job.company?.name} src={job.company?.logo} size={44} className="rounded-xl" />
          <div>
            <Link to={linkTo} className="font-display text-base font-bold text-ink-950 hover:text-brand-600">
              {job.title}
            </Link>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-500">
              <Building2 size={13} /> {job.company?.name}
            </p>
          </div>
        </div>
        {typeof job.aiMatchScore === 'number' && job.aiMatchScore !== null && (
          <div className={`shrink-0 rounded-xl px-3 py-1.5 text-center ${matchTone(job.aiMatchScore)}`}>
            <p className="text-[10px] font-bold uppercase tracking-wide">AI Match</p>
            <p className="font-display text-lg font-extrabold leading-none">{job.aiMatchScore}%</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-500">
        <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
        <span className="flex items-center gap-1"><Briefcase size={13} /> {job.jobType}</span>
        <span className="flex items-center gap-1"><Clock size={13} /> {deadline >= 0 ? `${deadline}d left` : 'Closed'}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.skills?.slice(0, 4).map((s) => (
          <span key={s} className="badge-neutral">{s}</span>
        ))}
        {job.skills?.length > 4 && <span className="badge-neutral">+{job.skills.length - 4}</span>}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-4">
        <p className="text-sm font-bold text-ink-800">{formatSalaryRange(job.salaryMin, job.salaryMax)}</p>
        <div className="flex items-center gap-2">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(job._id)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                isSaved ? 'border-brand-300 bg-brand-50 text-brand-600' : 'border-ink-200 text-ink-400 hover:border-ink-300'
              }`}
            >
              <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}
          <Link to={linkTo} className="btn-outline btn-sm">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
