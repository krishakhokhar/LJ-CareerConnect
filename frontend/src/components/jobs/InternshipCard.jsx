import { Link } from 'react-router-dom';
import { MapPin, Clock, Wallet, Sparkles, Building2 } from 'lucide-react';
import Avatar from '../common/Avatar';
import { daysUntil } from '../../utils/formatters';

const InternshipCard = ({ internship, linkTo }) => {
  const deadline = daysUntil(internship.applicationDeadline);

  return (
    <div className="card-hover flex flex-col gap-4 p-5 animate-slide-up">
      <div className="flex items-start gap-3">
        <Avatar name={internship.company?.name} src={internship.company?.logo} size={44} className="rounded-xl" />
        <div className="min-w-0">
          <Link to={linkTo} className="font-display text-base font-bold text-ink-950 hover:text-brand-600">{internship.title}</Link>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-500"><Building2 size={13} /> {internship.company?.name}</p>
        </div>
        {internship.ppoOpportunity && <span className="badge-brand ml-auto shrink-0"><Sparkles size={11} /> PPO</span>}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-500">
        <span className="flex items-center gap-1"><MapPin size={13} /> {internship.location}</span>
        <span className="flex items-center gap-1"><Clock size={13} /> {internship.duration}</span>
        <span className="flex items-center gap-1"><Wallet size={13} /> {internship.isPaid ? `₹${internship.stipend?.toLocaleString('en-IN')}/mo` : 'Unpaid'}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {internship.skills?.slice(0, 4).map((s) => <span key={s} className="badge-neutral">{s}</span>)}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-4">
        <p className="text-xs font-medium text-ink-400">{deadline >= 0 ? `${deadline} days left to apply` : 'Deadline passed'}</p>
        <Link to={linkTo} className="btn-outline btn-sm">View Details</Link>
      </div>
    </div>
  );
};

export default InternshipCard;
