import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserCircle2, Plus, Trash2, Pencil } from 'lucide-react';
import alumniService from '../../services/alumni.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ChartCard from '../../components/charts/ChartCard';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import StatCard from '../../components/common/StatCard';
import { TextField, SelectField } from '../../components/forms/FormField';
import Pagination from '../../components/common/Pagination';
import { COURSES, DEPARTMENTS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const initial = { name: '', graduationYear: '', course: '', department: '', company: '', jobRole: '', salaryPackage: '', employmentType: 'Full-time', joiningDate: '' };

const Alumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [a, an] = await Promise.all([alumniService.getAlumni({ page, limit: 12 }), alumniService.getAnalytics()]);
      setAlumni(a.alumni);
      setPagination(a.pagination);
      setAnalytics(an);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openCreate = () => { setEditing(null); setForm(initial); setFormOpen(true); };
  const openEdit = (a) => {
    setEditing(a);
    setForm({ ...a, joiningDate: a.joiningDate?.slice(0, 10) });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, graduationYear: Number(form.graduationYear), salaryPackage: Number(form.salaryPackage) };
    try {
      if (editing) {
        await alumniService.updateAlumni(editing._id, payload);
        toast.success('Alumni record updated.');
      } else {
        await alumniService.createAlumni(payload);
        toast.success('Alumni record added.');
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
      await alumniService.deleteAlumni(deleteTarget._id);
      toast.success('Alumni record deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Alumni" subtitle="Track alumni employment outcomes." actions={<button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Alumni</button>} />

      {analytics && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total Alumni" value={analytics.totalAlumni} icon={UserCircle2} tone="blue" />
            <StatCard label="Avg. Package" value={`${analytics.averagePackage} LPA`} icon={UserCircle2} tone="brand" />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard title="Alumni by Company" isEmpty={!analytics.byCompany?.length}>
              <SimpleBarChart data={analytics.byCompany} xKey="company" series={[{ key: 'count', label: 'Alumni' }]} horizontal />
            </ChartCard>
            <ChartCard title="Alumni by Graduation Year" isEmpty={!analytics.byYear?.length}>
              <SimpleBarChart data={analytics.byYear} xKey="year" series={[{ key: 'count', label: 'Alumni' }]} />
            </ChartCard>
          </div>
        </>
      )}

      {alumni.length === 0 ? (
        <EmptyState icon={UserCircle2} title="No alumni records yet" action={<button onClick={openCreate} className="btn-primary">Add Alumni</button>} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead><tr><th>Name</th><th>Company</th><th>Role</th><th>Package</th><th>Year</th><th></th></tr></thead>
            <tbody>
              {alumni.map((a) => (
                <tr key={a._id}>
                  <td><div className="flex items-center gap-2"><Avatar name={a.name} size={28} /> {a.name}</div></td>
                  <td>{a.company}</td>
                  <td>{a.jobRole}</td>
                  <td>{a.salaryPackage} LPA</td>
                  <td>{a.graduationYear}</td>
                  <td>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(a)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteTarget(a)} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination && <div className="px-4"><Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} limit={pagination.limit} onPageChange={setPage} /></div>}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Alumni' : 'Add Alumni'}
        footer={<><button className="btn-outline" onClick={() => setFormOpen(false)}>Cancel</button><button form="alumni-form" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button></>}
      >
        <form id="alumni-form" onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
              <option value="">Select</option>{COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </SelectField>
            <SelectField label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
              <option value="">Select</option>{DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </SelectField>
            <TextField label="Graduation Year" type="number" required value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} />
            <TextField label="Joining Date" type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
          </div>
          <TextField label="Company" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Job Role" required value={form.jobRole} onChange={(e) => setForm({ ...form, jobRole: e.target.value })} />
            <TextField label="Salary Package (LPA)" type="number" step="0.1" required value={form.salaryPackage} onChange={(e) => setForm({ ...form, salaryPackage: e.target.value })} />
          </div>
          <SelectField label="Employment Type" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
            <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Self-employed</option><option>Entrepreneur</option>
          </SelectField>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete record?" message={`Delete alumni record for "${deleteTarget?.name}"?`} confirmLabel="Delete" />
    </div>
  );
};

export default Alumni;
