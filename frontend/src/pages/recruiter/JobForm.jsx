import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import jobService from '../../services/job.service';
import PageHeader from '../../components/common/PageHeader';
import { PageLoader } from '../../components/common/Spinner';
import { TextField, TextAreaField, SelectField } from '../../components/forms/FormField';
import { JOB_TYPES, WORK_MODES } from '../../utils/constants';
import { getErrorMessage } from '../../services/api';

const initial = {
  title: '', description: '', responsibilities: '', requirements: '', skills: '',
  qualification: '', experienceRequired: '0-2 years', location: '', jobType: 'Full-time',
  workMode: 'On-site', salaryMin: '', salaryMax: '', openings: 1, applicationDeadline: '',
};

const toLines = (arr) => (arr || []).join('\n');
const fromLines = (text) => text.split('\n').map((s) => s.trim()).filter(Boolean);
const fromCsv = (text) => text.split(',').map((s) => s.trim()).filter(Boolean);

const JobForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    jobService.getJobById(id).then(({ job }) => {
      setForm({
        title: job.title,
        description: job.description,
        responsibilities: toLines(job.responsibilities),
        requirements: toLines(job.requirements),
        skills: (job.skills || []).join(', '),
        qualification: job.qualification || '',
        experienceRequired: job.experienceRequired || '',
        location: job.location,
        jobType: job.jobType,
        workMode: job.workMode,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        openings: job.openings,
        applicationDeadline: job.applicationDeadline?.slice(0, 10),
      });
    }).catch((err) => toast.error(getErrorMessage(err))).finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.skills.trim()) e.skills = 'At least one skill is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.salaryMin || Number(form.salaryMin) < 0) e.salaryMin = 'Valid minimum salary is required';
    if (!form.salaryMax || Number(form.salaryMax) < Number(form.salaryMin)) e.salaryMax = 'Maximum salary must be >= minimum';
    if (!form.openings || Number(form.openings) < 1) e.openings = 'At least 1 opening is required';
    if (!form.applicationDeadline) e.applicationDeadline = 'Deadline is required';
    else if (new Date(form.applicationDeadline) <= new Date()) e.applicationDeadline = 'Deadline must be in the future';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      responsibilities: fromLines(form.responsibilities),
      requirements: fromLines(form.requirements),
      skills: fromCsv(form.skills),
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
      openings: Number(form.openings),
    };
    try {
      if (isEdit) {
        await jobService.updateJob(id, payload);
        toast.success('Job updated successfully.');
      } else {
        await jobService.createJob(payload);
        toast.success('Job posted successfully.');
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="Loading job..." />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft size={15} /> Back
      </button>
      <PageHeader title={isEdit ? 'Edit Job' : 'Create Job'} subtitle="Fill in the details to publish this role." />

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <TextField label="Job Title" required value={form.title} error={errors.title} onChange={(e) => update('title', e.target.value)} placeholder="Frontend Developer" />
        <TextAreaField label="Description" required rows={4} value={form.description} error={errors.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the role..." />
        <TextAreaField label="Responsibilities (one per line)" rows={4} value={form.responsibilities} onChange={(e) => update('responsibilities', e.target.value)} />
        <TextAreaField label="Requirements (one per line)" rows={4} value={form.requirements} onChange={(e) => update('requirements', e.target.value)} />
        <TextField label="Required Skills (comma separated)" required value={form.skills} error={errors.skills} onChange={(e) => update('skills', e.target.value)} placeholder="React, JavaScript, CSS" />
        <TextField label="Qualification" value={form.qualification} onChange={(e) => update('qualification', e.target.value)} placeholder="B.Tech in Computer Science" />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Location" required value={form.location} error={errors.location} onChange={(e) => update('location', e.target.value)} placeholder="Ahmedabad, Gujarat" />
          <TextField label="Experience Required" value={form.experienceRequired} onChange={(e) => update('experienceRequired', e.target.value)} placeholder="0-2 years" />
          <SelectField label="Job Type" value={form.jobType} onChange={(e) => update('jobType', e.target.value)}>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </SelectField>
          <SelectField label="Work Mode" value={form.workMode} onChange={(e) => update('workMode', e.target.value)}>
            {WORK_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </SelectField>
          <TextField label="Salary Min (₹/year)" type="number" required value={form.salaryMin} error={errors.salaryMin} onChange={(e) => update('salaryMin', e.target.value)} />
          <TextField label="Salary Max (₹/year)" type="number" required value={form.salaryMax} error={errors.salaryMax} onChange={(e) => update('salaryMax', e.target.value)} />
          <TextField label="Openings" type="number" min="1" required value={form.openings} error={errors.openings} onChange={(e) => update('openings', e.target.value)} />
          <TextField label="Application Deadline" type="date" required value={form.applicationDeadline} error={errors.applicationDeadline} onChange={(e) => update('applicationDeadline', e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary"><Save size={15} /> {saving ? 'Saving...' : isEdit ? 'Update Job' : 'Publish Job'}</button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
