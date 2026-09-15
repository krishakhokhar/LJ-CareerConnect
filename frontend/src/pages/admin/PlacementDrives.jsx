import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarClock, Plus, Pencil, Trash2, Users } from 'lucide-react';
import placementDriveService from '../../services/placementDrive.service';
import companyService from '../../services/company.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { TextField, TextAreaField, SelectField } from '../../components/forms/FormField';
import { COURSES, DEPARTMENTS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const initial = {
  company: '', driveName: '', jobRole: '', driveDate: '', driveTime: '', mode: 'On-campus', venue: '',
  minCgpa: '', courses: [], departments: [], requiredSkills: '', salaryPackage: '', openings: 1,
  applicationDeadline: '', description: '',
};

const PlacementDrives = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [d, c] = await Promise.all([placementDriveService.getDrives(), companyService.getCompanies()]);
      setDrives(d);
      setCompanies(c);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(initial); setFormOpen(true); };
  const openEdit = (d) => {
    setEditing(d);
    setForm({
      company: d.company?._id, driveName: d.driveName, jobRole: d.jobRole,
      driveDate: d.driveDate?.slice(0, 10), driveTime: d.driveTime, mode: d.mode, venue: d.venue,
      minCgpa: d.eligibility?.minCgpa || '', courses: d.eligibility?.courses || [], departments: d.eligibility?.departments || [],
      requiredSkills: (d.requiredSkills || []).join(', '), salaryPackage: d.salaryPackage, openings: d.openings,
      applicationDeadline: d.applicationDeadline?.slice(0, 10), description: d.description,
    });
    setFormOpen(true);
  };

  const toggleMulti = (field, value) => {
    setForm((f) => ({ ...f, [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      company: form.company, driveName: form.driveName, jobRole: form.jobRole, driveDate: form.driveDate,
      driveTime: form.driveTime, mode: form.mode, venue: form.venue,
      eligibility: { minCgpa: Number(form.minCgpa) || 0, courses: form.courses, departments: form.departments, graduationYear: [] },
      requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      salaryPackage: form.salaryPackage, openings: Number(form.openings), applicationDeadline: form.applicationDeadline,
      description: form.description,
    };
    try {
      if (editing) {
        await placementDriveService.updateDrive(editing._id, payload);
        toast.success('Drive updated.');
      } else {
        await placementDriveService.createDrive(payload);
        toast.success('Drive created and students notified.');
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
      await placementDriveService.deleteDrive(deleteTarget._id);
      toast.success('Drive deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Placement Drives" subtitle="Create and manage campus placement drives." actions={<button onClick={openCreate} className="btn-primary"><Plus size={16} /> New Drive</button>} />

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : drives.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No placement drives yet" action={<button onClick={openCreate} className="btn-primary">Create a Drive</button>} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Drive</th><th>Company</th><th>Date</th><th>Registered</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {drives.map((d) => (
                <tr key={d._id}>
                  <td className="font-medium text-ink-800">{d.driveName}</td>
                  <td>{d.company?.name}</td>
                  <td>{formatDate(d.driveDate)}</td>
                  <td><span className="flex items-center gap-1"><Users size={13} /> {d.registeredStudents?.length || 0}</span></td>
                  <td><StatusBadge status={d.status} /></td>
                  <td>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(d)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteTarget(d)} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50"><Trash2 size={15} /></button>
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
        title={editing ? 'Edit Drive' : 'New Placement Drive'}
        size="lg"
        footer={<><button className="btn-outline" onClick={() => setFormOpen(false)}>Cancel</button><button form="drive-form" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button></>}
      >
        <form id="drive-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Company" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}>
              <option value="">Select company</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </SelectField>
            <TextField label="Drive Name" required value={form.driveName} onChange={(e) => setForm({ ...form, driveName: e.target.value })} />
          </div>
          <TextField label="Job Role" required value={form.jobRole} onChange={(e) => setForm({ ...form, jobRole: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="Date" type="date" required value={form.driveDate} onChange={(e) => setForm({ ...form, driveDate: e.target.value })} />
            <TextField label="Time" value={form.driveTime} onChange={(e) => setForm({ ...form, driveTime: e.target.value })} placeholder="10:00 AM" />
            <SelectField label="Mode" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
              <option>On-campus</option><option>Online</option>
            </SelectField>
          </div>
          <TextField label="Venue / Meeting Info" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="Min CGPA" type="number" step="0.1" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: e.target.value })} />
            <TextField label="Salary Package" value={form.salaryPackage} onChange={(e) => setForm({ ...form, salaryPackage: e.target.value })} placeholder="6 LPA" />
            <TextField label="Openings" type="number" min="1" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Eligible Courses</label>
            <div className="flex flex-wrap gap-2">
              {COURSES.map((c) => (
                <button type="button" key={c} onClick={() => toggleMulti('courses', c)} className={`badge ${form.courses.includes(c) ? 'badge-brand' : 'badge-neutral'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">Eligible Departments</label>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((d) => (
                <button type="button" key={d} onClick={() => toggleMulti('departments', d)} className={`badge ${form.departments.includes(d) ? 'badge-brand' : 'badge-neutral'}`}>{d}</button>
              ))}
            </div>
          </div>
          <TextField label="Required Skills (comma separated)" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} />
          <TextField label="Application Deadline" type="date" required value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} />
          <TextAreaField label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete drive?" message={`Delete "${deleteTarget?.driveName}"?`} confirmLabel="Delete" />
    </div>
  );
};

export default PlacementDrives;
