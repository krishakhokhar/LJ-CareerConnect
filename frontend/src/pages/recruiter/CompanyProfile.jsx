import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Building2 } from 'lucide-react';
import recruiterService from '../../services/recruiter.service';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import { PageLoader } from '../../components/common/Spinner';
import { TextField, TextAreaField } from '../../components/forms/FormField';
import { getErrorMessage } from '../../services/api';

const CompanyProfile = () => {
  const { setProfile: setAuthProfile } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await recruiterService.getProfile();
      setForm({
        recruiterName: data.recruiterName || '',
        designation: data.designation || '',
        phone: data.phone || '',
        company: {
          name: data.company?.name || '',
          website: data.company?.website || '',
          location: data.company?.location || '',
          industry: data.company?.industry || '',
          description: data.company?.description || '',
        },
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading || !form) return <PageLoader label="Loading company profile..." />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await recruiterService.updateProfile(form);
      toast.success('Company profile updated.');
      setAuthProfile(updated);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Company Profile" subtitle="Keep your company information up to date for candidates." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="card p-6">
          <h3 className="section-title mb-4">Your Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Your Name" required value={form.recruiterName} onChange={(e) => setForm({ ...form, recruiterName: e.target.value })} />
            <TextField label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </section>

        <section className="card p-6">
          <div className="mb-4 flex items-center gap-2"><Building2 size={17} className="text-ink-400" /><h3 className="section-title">Company Details</h3></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Company Name" required value={form.company.name} onChange={(e) => setForm({ ...form, company: { ...form.company, name: e.target.value } })} />
            <TextField label="Website" value={form.company.website} onChange={(e) => setForm({ ...form, company: { ...form.company, website: e.target.value } })} />
            <TextField label="Location" value={form.company.location} onChange={(e) => setForm({ ...form, company: { ...form.company, location: e.target.value } })} />
            <TextField label="Industry" value={form.company.industry} onChange={(e) => setForm({ ...form, company: { ...form.company, industry: e.target.value } })} />
          </div>
          <TextAreaField label="Company Description" className="mt-4" rows={4} value={form.company.description} onChange={(e) => setForm({ ...form, company: { ...form.company, description: e.target.value } })} />
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary"><Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
