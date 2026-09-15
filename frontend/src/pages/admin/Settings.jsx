import { useState } from 'react';
import toast from 'react-hot-toast';
import { Megaphone, Send, Info } from 'lucide-react';
import notificationService from '../../services/notification.service';
import PageHeader from '../../components/common/PageHeader';
import { TextField, TextAreaField, SelectField } from '../../components/forms/FormField';
import { APP_NAME } from '../../utils/constants';
import { getErrorMessage } from '../../services/api';

const Settings = () => {
  const [form, setForm] = useState({ title: '', message: '', audience: 'ALL' });
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return toast.error('Title and message are required.');
    setSending(true);
    try {
      const res = await notificationService.createAnnouncement(form);
      toast.success(`Announcement sent to ${res.recipients} users.`);
      setForm({ title: '', message: '', audience: 'ALL' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Platform configuration and announcements." />

      <div className="card p-6">
        <div className="mb-4 flex items-center gap-2"><Megaphone size={17} className="text-brand-600" /><h3 className="section-title">Send Announcement</h3></div>
        <form onSubmit={handleSend} className="space-y-4">
          <TextField label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Placement Season Kickoff" />
          <TextAreaField label="Message" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your announcement..." />
          <SelectField label="Audience" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
            <option value="ALL">Everyone</option>
            <option value="STUDENT">Students Only</option>
            <option value="RECRUITER">Recruiters Only</option>
          </SelectField>
          <button type="submit" disabled={sending} className="btn-primary"><Send size={15} /> {sending ? 'Sending...' : 'Send Announcement'}</button>
        </form>
      </div>

      <div className="card p-6">
        <div className="mb-3 flex items-center gap-2"><Info size={17} className="text-ink-400" /><h3 className="section-title">Platform Information</h3></div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p className="text-ink-500">Platform Name<span className="mt-0.5 block font-semibold text-ink-800">{APP_NAME}</span></p>
          <p className="text-ink-500">Version<span className="mt-0.5 block font-semibold text-ink-800">1.0.0</span></p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
