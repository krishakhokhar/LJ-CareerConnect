import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, FileText, Award } from 'lucide-react';
import studentService from '../../services/student.service';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import { PageLoader } from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import { TextField, TextAreaField, SelectField } from '../../components/forms/FormField';
import { COURSES, DEPARTMENTS } from '../../utils/constants';
import { getErrorMessage } from '../../services/api';

const emptyExperience = { title: '', organization: '', type: 'Internship', startDate: '', endDate: '', description: '' };
const emptyProject = { title: '', description: '', techStack: '', projectUrl: '', repoUrl: '' };

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

const Profile = () => {
  const { setProfile: setAuthProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await studentService.getProfile();
      setProfile(data);
      setForm({
        fullName: data.fullName || '',
        dateOfBirth: toDateInput(data.dateOfBirth),
        gender: data.gender || '',
        course: data.course || '',
        department: data.department || '',
        semester: data.semester || '',
        graduationYear: data.graduationYear || '',
        cgpa: data.cgpa || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || '',
        portfolioUrl: data.portfolioUrl || '',
        experience: (data.experience || []).map((e) => ({ ...e, startDate: toDateInput(e.startDate), endDate: toDateInput(e.endDate) })),
        projects: (data.projects || []).map((p) => ({ ...p, techStack: (p.techStack || []).join(', ') })),
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading || !form) return <PageLoader label="Loading profile..." />;

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateExperience = (i, field, value) => {
    const next = [...form.experience];
    next[i] = { ...next[i], [field]: value };
    setForm((f) => ({ ...f, experience: next }));
  };
  const addExperience = () => setForm((f) => ({ ...f, experience: [...f.experience, { ...emptyExperience }] }));
  const removeExperience = (i) => setForm((f) => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }));

  const updateProject = (i, field, value) => {
    const next = [...form.projects];
    next[i] = { ...next[i], [field]: value };
    setForm((f) => ({ ...f, projects: next }));
  };
  const addProject = () => setForm((f) => ({ ...f, projects: [...f.projects, { ...emptyProject }] }));
  const removeProject = (i) => setForm((f) => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        semester: Number(form.semester),
        graduationYear: Number(form.graduationYear),
        cgpa: form.cgpa ? Number(form.cgpa) : undefined,
        projects: form.projects.map((p) => ({ ...p, techStack: p.techStack.split(',').map((t) => t.trim()).filter(Boolean) })),
      };
      const updated = await studentService.updateProfile(payload);
      toast.success('Profile updated successfully.');
      setAuthProfile(updated);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle={`${profile.profileCompletion}% complete — keep your profile updated for better job matches.`}
        actions={<button form="profile-form" className="btn-primary" disabled={saving}><Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}</button>}
      />

      <div className="mb-6 card flex items-center gap-4 p-5">
        <Avatar name={form.fullName} size={64} />
        <div>
          <p className="font-display text-lg font-bold text-ink-950">{form.fullName}</p>
          <p className="text-sm text-ink-400">{profile.studentId} · {profile.course}, {profile.department}</p>
        </div>
        <div className="ml-auto hidden gap-2 sm:flex">
          <Link to="/student/skills" className="btn-outline btn-sm"><Award size={14} /> Skills</Link>
          <Link to="/student/resume" className="btn-outline btn-sm"><FileText size={14} /> Resume</Link>
        </div>
      </div>

      <form id="profile-form" onSubmit={handleSave} className="space-y-6">
        <section className="card p-6">
          <h3 className="section-title mb-4">Personal Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Full Name" required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
            <TextField label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
            <SelectField label="Gender" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
              <option value="">Select</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </SelectField>
          </div>
        </section>

        <section className="card p-6">
          <h3 className="section-title mb-4">Academic Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Course" value={form.course} onChange={(e) => update('course', e.target.value)}>
              {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </SelectField>
            <SelectField label="Department" value={form.department} onChange={(e) => update('department', e.target.value)}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </SelectField>
            <SelectField label="Semester" value={form.semester} onChange={(e) => update('semester', e.target.value)}>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </SelectField>
            <TextField label="Graduation Year" type="number" value={form.graduationYear} onChange={(e) => update('graduationYear', e.target.value)} />
            <TextField label="CGPA" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={(e) => update('cgpa', e.target.value)} />
          </div>
        </section>

        <section className="card p-6">
          <h3 className="section-title mb-4">Contact Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Phone" required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            <TextField label="City" value={form.city} onChange={(e) => update('city', e.target.value)} />
            <TextField label="State" value={form.state} onChange={(e) => update('state', e.target.value)} />
            <TextField label="Address" value={form.address} onChange={(e) => update('address', e.target.value)} className="sm:col-span-2" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <TextField label="LinkedIn" value={form.linkedinUrl} onChange={(e) => update('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." />
            <TextField label="GitHub" value={form.githubUrl} onChange={(e) => update('githubUrl', e.target.value)} placeholder="https://github.com/..." />
            <TextField label="Portfolio" value={form.portfolioUrl} onChange={(e) => update('portfolioUrl', e.target.value)} placeholder="https://..." />
          </div>
        </section>

        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="section-title">Experience</h3>
            <button type="button" onClick={addExperience} className="btn-outline btn-sm"><Plus size={14} /> Add</button>
          </div>
          <div className="space-y-4">
            {form.experience.length === 0 && <p className="text-sm text-ink-400">No experience added yet.</p>}
            {form.experience.map((exp, i) => (
              <div key={i} className="rounded-xl border border-ink-100 p-4">
                <div className="mb-3 flex justify-end"><button type="button" onClick={() => removeExperience(i)} className="text-ink-300 hover:text-red-500"><Trash2 size={15} /></button></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Title" value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} />
                  <TextField label="Organization" value={exp.organization} onChange={(e) => updateExperience(i, 'organization', e.target.value)} />
                  <TextField label="Start Date" type="date" value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} />
                  <TextField label="End Date" type="date" value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} />
                </div>
                <TextAreaField label="Description" className="mt-3" rows={2} value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="section-title">Projects</h3>
            <button type="button" onClick={addProject} className="btn-outline btn-sm"><Plus size={14} /> Add</button>
          </div>
          <div className="space-y-4">
            {form.projects.length === 0 && <p className="text-sm text-ink-400">No projects added yet.</p>}
            {form.projects.map((proj, i) => (
              <div key={i} className="rounded-xl border border-ink-100 p-4">
                <div className="mb-3 flex justify-end"><button type="button" onClick={() => removeProject(i)} className="text-ink-300 hover:text-red-500"><Trash2 size={15} /></button></div>
                <TextField label="Title" value={proj.title} onChange={(e) => updateProject(i, 'title', e.target.value)} />
                <TextAreaField label="Description" className="mt-3" rows={2} value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} />
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <TextField label="Tech Stack (comma separated)" value={proj.techStack} onChange={(e) => updateProject(i, 'techStack', e.target.value)} />
                  <TextField label="Project URL" value={proj.projectUrl} onChange={(e) => updateProject(i, 'projectUrl', e.target.value)} />
                  <TextField label="Repository URL" value={proj.repoUrl} onChange={(e) => updateProject(i, 'repoUrl', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </form>
    </div>
  );
};

export default Profile;
