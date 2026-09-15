import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GraduationCap, Plus, Pencil, Trash2, Users, FileText } from 'lucide-react';
import internshipService from '../../services/internship.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { TextField, TextAreaField, SelectField } from '../../components/forms/FormField';
import { WORK_MODES, APPLICATION_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const initial = { title: '', description: '', skills: '', duration: '', location: '', workMode: 'On-site', stipend: '', isPaid: true, openings: 1, applicationDeadline: '', ppoOpportunity: false };
const INTERN_STATUSES = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'COMPLETED'];

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [applicantsTarget, setApplicantsTarget] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await internshipService.getInternships({ limit: 50 });
      setInternships(data.internships);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(initial); setFormOpen(true); };
  const openEdit = (i) => {
    setEditing(i);
    setForm({
      title: i.title, description: i.description, skills: (i.skills || []).join(', '), duration: i.duration,
      location: i.location, workMode: i.workMode, stipend: i.stipend, isPaid: i.isPaid, openings: i.openings,
      applicationDeadline: i.applicationDeadline?.slice(0, 10), ppoOpportunity: i.ppoOpportunity,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean), stipend: Number(form.stipend) || 0, openings: Number(form.openings) };
    try {
      if (editing) {
        await internshipService.updateInternship(editing._id, payload);
        toast.success('Internship updated.');
      } else {
        await internshipService.createInternship(payload);
        toast.success('Internship posted.');
      }
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await internshipService.deleteInternship(deleteTarget._id);
      toast.success('Internship deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const openApplicants = async (internship) => {
    setApplicantsTarget(internship);
    setLoadingApplicants(true);
    try {
      const data = await internshipService.getInternshipApplicants(internship._id);
      setApplicants(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleApplicantStatus = async (app, status) => {
    try {
      await internshipService.updateApplicationStatus(app._id, status);
      toast.success('Status updated.');
      openApplicants(applicantsTarget);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Internships" subtitle="Post and manage internship opportunities." actions={<button onClick={openCreate} className="btn-primary"><Plus size={16} /> Post Internship</button>} />

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : internships.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No internships posted yet" action={<button onClick={openCreate} className="btn-primary">Post an Internship</button>} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Title</th><th>Duration</th><th>Stipend</th><th>Deadline</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {internships.map((i) => (
                <tr key={i._id}>
                  <td className="font-medium text-ink-800">{i.title}</td>
                  <td>{i.duration}</td>
                  <td>{i.isPaid ? `₹${i.stipend?.toLocaleString('en-IN')}/mo` : 'Unpaid'}</td>
                  <td>{formatDate(i.applicationDeadline)}</td>
                  <td><StatusBadge status={i.status} /></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openApplicants(i)} title="Applicants" className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100"><Users size={15} /></button>
                      <button onClick={() => openEdit(i)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteTarget(i)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Internship' : 'Post Internship'}
        size="lg"
        footer={<><button className="btn-outline" onClick={() => setFormOpen(false)}>Cancel</button><button form="internship-form" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button></>}
      >
        <form id="internship-form" onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextAreaField label="Description" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Duration" required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="3 months" />
            <TextField label="Location" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <SelectField label="Work Mode" value={form.workMode} onChange={(e) => setForm({ ...form, workMode: e.target.value })}>
              {WORK_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </SelectField>
            <TextField label="Stipend (₹/month)" type="number" value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} />
            <TextField label="Openings" type="number" min="1" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} />
            <TextField label="Application Deadline" type="date" required value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ink-600"><input type="checkbox" checked={form.isPaid} onChange={(e) => setForm({ ...form, isPaid: e.target.checked })} /> Paid</label>
            <label className="flex items-center gap-2 text-sm text-ink-600"><input type="checkbox" checked={form.ppoOpportunity} onChange={(e) => setForm({ ...form, ppoOpportunity: e.target.checked })} /> PPO Opportunity</label>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(applicantsTarget)} onClose={() => setApplicantsTarget(null)} title={`Applicants — ${applicantsTarget?.title || ''}`} size="lg">
        {loadingApplicants ? (
          <div className="flex h-40 items-center justify-center"><Spinner size={22} /></div>
        ) : applicants.length === 0 ? (
          <EmptyState title="No applicants yet" />
        ) : (
          <div className="space-y-3">
            {applicants.map((app) => (
              <div key={app._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-100 p-3.5">
                <div className="flex items-center gap-3">
                  <Avatar name={app.student?.fullName} size={36} />
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{app.student?.fullName}</p>
                    <p className="text-xs text-ink-400">{app.student?.course}, Sem {app.student?.semester}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100"><FileText size={15} /></a>
                  <select value={app.status} onChange={(e) => handleApplicantStatus(app, e.target.value)} className="select w-40 py-1.5 text-xs">
                    {INTERN_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete internship?" message={`Delete "${deleteTarget?.title}"?`} confirmLabel="Delete" />
    </div>
  );
};

export default Internships;
