import { useState } from 'react';
import toast from 'react-hot-toast';
import { Video, Calendar, Clock, MapPin, Link as LinkIcon } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import interviewService from '../../services/interview.service';
import PageHeader from '../../components/common/PageHeader';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import { TextAreaField, SelectField } from '../../components/forms/FormField';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const Interviews = () => {
  const { data: interviews, loading, error, refetch } = useFetch(() => interviewService.getInterviews(), []);
  const [target, setTarget] = useState(null);
  const [status, setStatus] = useState('COMPLETED');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading) return <PageLoader label="Loading interviews..." />;
  if (error) return <EmptyState title="Couldn't load interviews" description={error} />;

  const openUpdate = (iv) => {
    setTarget(iv);
    setStatus(iv.status === 'SCHEDULED' ? 'COMPLETED' : iv.status);
    setFeedback(iv.feedback || '');
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await interviewService.updateInterview(target._id, { status, feedback });
      toast.success('Interview updated.');
      setTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Interviews" subtitle="Manage interviews scheduled with candidates." />

      {interviews.length === 0 ? (
        <EmptyState icon={Video} title="No interviews scheduled" description="Schedule interviews from the Applicants page." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {interviews.map((iv) => (
            <div key={iv._id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Avatar name={iv.student?.fullName} size={42} />
                  <div>
                    <p className="font-display text-sm font-bold text-ink-950">{iv.student?.fullName}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{iv.job?.title}</p>
                  </div>
                </div>
                <StatusBadge status={iv.status} />
              </div>
              <div className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm text-ink-600">
                <p className="flex items-center gap-2"><Calendar size={14} className="text-ink-400" /> {formatDate(iv.scheduledDate)}</p>
                <p className="flex items-center gap-2"><Clock size={14} className="text-ink-400" /> {iv.scheduledTime} · {iv.round}</p>
                <p className="flex items-center gap-2">
                  {iv.interviewType === 'Online' ? <LinkIcon size={14} className="text-ink-400" /> : <MapPin size={14} className="text-ink-400" />}
                  {iv.interviewType === 'Online' ? (iv.meetingLink || 'Online') : iv.location || 'In-person'}
                </p>
              </div>
              <button onClick={() => openUpdate(iv)} className="btn-outline btn-sm mt-4 w-full">Update Status / Feedback</button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title="Update Interview"
        footer={<><button className="btn-outline" onClick={() => setTarget(null)}>Cancel</button><button className="btn-primary" onClick={handleUpdate} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button></>}
      >
        <SelectField label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </SelectField>
        <TextAreaField label="Feedback" className="mt-4" rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Interview feedback notes..." />
      </Modal>
    </div>
  );
};

export default Interviews;
