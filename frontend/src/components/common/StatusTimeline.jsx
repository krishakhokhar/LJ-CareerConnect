import { Check, X } from 'lucide-react';

const FLOW = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];
const LABELS = { APPLIED: 'Applied', UNDER_REVIEW: 'Under Review', SHORTLISTED: 'Shortlisted', INTERVIEW: 'Interview', SELECTED: 'Selected' };

const StatusTimeline = ({ status }) => {
  const isRejected = status === 'REJECTED';
  const currentIndex = FLOW.indexOf(status);

  return (
    <div className="flex flex-col gap-0">
      {FLOW.map((step, i) => {
        const done = !isRejected && i <= currentIndex;
        const isCurrent = !isRejected && i === currentIndex;
        return (
          <div key={step} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-400'
                } ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}
              >
                {done ? <Check size={15} /> : i + 1}
              </div>
              {i < FLOW.length - 1 && <div className={`h-9 w-0.5 ${i < currentIndex && !isRejected ? 'bg-brand-500' : 'bg-ink-100'}`} />}
            </div>
            <div className="pb-9 pt-1">
              <p className={`text-sm font-semibold ${done ? 'text-ink-900' : 'text-ink-400'}`}>{LABELS[step]}</p>
            </div>
          </div>
        );
      })}
      {isRejected && (
        <div className="flex gap-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
            <X size={15} />
          </div>
          <div className="pt-1">
            <p className="text-sm font-semibold text-red-600">Rejected</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusTimeline;
