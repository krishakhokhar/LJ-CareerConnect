import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, Clock, Wallet, Calendar, Sparkles, Building2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import internshipService from '../../services/internship.service';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import { TextAreaField } from '../../components/forms/FormField';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, setData } = useFetch(() => internshipService.getInternshipById(id), [id]);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <PageLoader label="Loading internship..." />;
  if (error) return <EmptyState title="Internship not found" description={error} action={<Link to="/student/internships" className="btn-primary">Back</Link>} />;

  const { internship, hasApplied } = data;

  const handleApply = async () => {
    setSubmitting(true);
    try {
      await internshipService.applyToInternship(id, { coverNote });
      toast.success('Application submitted successfully!');
      setApplyOpen(false);
      setData({ ...data, hasApplied: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <Avatar name={internship.company?.name} src={internship.company?.logo} size={56} className="rounded-2xl" />
              <div>
                <h1 className="font-display text-2xl font-bold text-ink-950">{internship.title}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-500"><Building2 size={14} /> {internship.company?.name}</p>
              </div>
              {internship.ppoOpportunity && <span className="badge-brand ml-auto"><Sparkles size={12} /> PPO Opportunity</span>}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-100 pt-5 text-sm text-ink-600">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {internship.location} · {internship.workMode}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {internship.duration}</span>
              <span className="flex items-center gap-1.5"><Wallet size={14} /> {internship.isPaid ? `₹${internship.stipend?.toLocaleString('en-IN')}/month` : 'Unpaid'}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> Apply by {formatDate(internship.applicationDeadline)}</span>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-base font-bold text-ink-950">Description</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-600">{internship.description}</p>

            <h3 className="mt-6 font-display text-base font-bold text-ink-950">Required Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {internship.skills?.map((s) => <span key={s} className="badge-neutral">{s}</span>)}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-6">
            <button onClick={() => setApplyOpen(true)} disabled={hasApplied} className="btn-primary w-full py-3">
              {hasApplied ? 'Already Applied' : 'Apply Now'}
            </button>
            <p className="mt-3 text-center text-xs text-ink-400">Your resume on file will be submitted with this application.</p>
          </div>
        </div>
      </div>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title={`Apply to ${internship.title}`}
        footer={
          <>
            <button className="btn-outline" onClick={() => setApplyOpen(false)} disabled={submitting}>Cancel</button>
            <button className="btn-primary" onClick={handleApply} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Application'}</button>
          </>
        }
      >
        <TextAreaField label="Cover Note (optional)" rows={5} value={coverNote} onChange={(e) => setCoverNote(e.target.value)} placeholder="Why are you a great fit for this internship?" />
      </Modal>
    </div>
  );
};

export default InternshipDetails;
