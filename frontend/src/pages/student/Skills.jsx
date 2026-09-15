import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Award, ExternalLink, X } from 'lucide-react';
import studentService from '../../services/student.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { TextField, SelectField } from '../../components/forms/FormField';
import FileDropzone from '../../components/forms/FileDropzone';
import { SKILL_CATEGORIES, SKILL_LEVELS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const LEVEL_TONE = { Beginner: 'badge-neutral', Intermediate: 'badge-amber', Advanced: 'badge-brand' };

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillForm, setSkillForm] = useState({ name: '', category: SKILL_CATEGORIES[0], level: 'Beginner' });
  const [savingSkill, setSavingSkill] = useState(false);
  const [deleteSkillTarget, setDeleteSkillTarget] = useState(null);

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState({ name: '', organization: '', issueDate: '', credentialId: '', credentialUrl: '' });
  const [certFile, setCertFile] = useState(null);
  const [savingCert, setSavingCert] = useState(false);
  const [deleteCertTarget, setDeleteCertTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([studentService.getSkills(), studentService.getCertifications()]);
      setSkills(s);
      setCertifications(c);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return toast.error('Skill name is required.');
    setSavingSkill(true);
    try {
      await studentService.addSkill(skillForm);
      toast.success('Skill added.');
      setSkillModalOpen(false);
      setSkillForm({ name: '', category: SKILL_CATEGORIES[0], level: 'Beginner' });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingSkill(false);
    }
  };

  const handleDeleteSkill = async () => {
    try {
      await studentService.deleteSkill(deleteSkillTarget._id);
      toast.success('Skill removed.');
      setDeleteSkillTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!certForm.name.trim() || !certForm.organization.trim()) return toast.error('Name and organization are required.');
    setSavingCert(true);
    try {
      const formData = new FormData();
      Object.entries(certForm).forEach(([k, v]) => v && formData.append(k, v));
      if (certFile) formData.append('certificate', certFile);
      await studentService.addCertification(formData);
      toast.success('Certification added.');
      setCertModalOpen(false);
      setCertForm({ name: '', organization: '', issueDate: '', credentialId: '', credentialUrl: '' });
      setCertFile(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingCert(false);
    }
  };

  const handleDeleteCert = async () => {
    try {
      await studentService.deleteCertification(deleteCertTarget._id);
      toast.success('Certification removed.');
      setDeleteCertTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <Spinner size={26} className="mx-auto mt-20" />;

  return (
    <div className="space-y-8">
      <PageHeader title="Skills & Certifications" subtitle="Showcase your expertise to recruiters and unlock better matches." />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="section-title">Skills</h3>
          <button onClick={() => setSkillModalOpen(true)} className="btn-primary btn-sm"><Plus size={15} /> Add Skill</button>
        </div>
        {skills.length === 0 ? (
          <EmptyState title="No skills added yet" description="Add your technical and soft skills to improve job matching." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <div key={skill._id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-ink-800">{skill.name}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{skill.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={LEVEL_TONE[skill.level]}>{skill.level}</span>
                  <button onClick={() => setDeleteSkillTarget(skill)} className="text-ink-300 hover:text-red-500"><X size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="section-title">Certifications</h3>
          <button onClick={() => setCertModalOpen(true)} className="btn-primary btn-sm"><Plus size={15} /> Add Certification</button>
        </div>
        {certifications.length === 0 ? (
          <EmptyState icon={Award} title="No certifications added yet" description="Add certifications to strengthen your profile." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {certifications.map((cert) => (
              <div key={cert._id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Award size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{cert.name}</p>
                      <p className="text-xs text-ink-500">{cert.organization}</p>
                      {cert.issueDate && <p className="mt-1 text-xs text-ink-400">Issued {formatDate(cert.issueDate)}</p>}
                    </div>
                  </div>
                  <button onClick={() => setDeleteCertTarget(cert)} className="text-ink-300 hover:text-red-500"><Trash2 size={15} /></button>
                </div>
                <div className="mt-3 flex gap-3 text-xs">
                  {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700"><ExternalLink size={12} /> Credential</a>}
                  {cert.fileUrl && <a href={cert.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700"><ExternalLink size={12} /> Certificate</a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        title="Add Skill"
        footer={<><button className="btn-outline" onClick={() => setSkillModalOpen(false)}>Cancel</button><button form="skill-form" className="btn-primary" disabled={savingSkill}>{savingSkill ? 'Adding...' : 'Add Skill'}</button></>}
      >
        <form id="skill-form" onSubmit={handleAddSkill} className="space-y-4">
          <TextField label="Skill Name" required value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="React" />
          <SelectField label="Category" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
            {SKILL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </SelectField>
          <SelectField label="Proficiency Level" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}>
            {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </SelectField>
        </form>
      </Modal>

      <Modal
        open={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title="Add Certification"
        footer={<><button className="btn-outline" onClick={() => setCertModalOpen(false)}>Cancel</button><button form="cert-form" className="btn-primary" disabled={savingCert}>{savingCert ? 'Adding...' : 'Add Certification'}</button></>}
      >
        <form id="cert-form" onSubmit={handleAddCert} className="space-y-4">
          <TextField label="Certificate Name" required value={certForm.name} onChange={(e) => setCertForm({ ...certForm, name: e.target.value })} placeholder="AWS Cloud Practitioner" />
          <TextField label="Organization" required value={certForm.organization} onChange={(e) => setCertForm({ ...certForm, organization: e.target.value })} placeholder="Amazon Web Services" />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Issue Date" type="date" value={certForm.issueDate} onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })} />
            <TextField label="Credential ID" value={certForm.credentialId} onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })} />
          </div>
          <TextField label="Credential URL" value={certForm.credentialUrl} onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })} placeholder="https://..." />
          <FileDropzone accept=".pdf,.png,.jpg,.jpeg" hint="PDF or image, up to 5MB" fileName={certFile?.name} onFileSelect={setCertFile} onClear={() => setCertFile(null)} label="Certificate File (optional)" />
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteSkillTarget)} onClose={() => setDeleteSkillTarget(null)} onConfirm={handleDeleteSkill} title="Remove skill?" message={`Remove "${deleteSkillTarget?.name}" from your profile?`} confirmLabel="Remove" />
      <ConfirmDialog open={Boolean(deleteCertTarget)} onClose={() => setDeleteCertTarget(null)} onConfirm={handleDeleteCert} title="Remove certification?" message={`Remove "${deleteCertTarget?.name}" from your profile?`} confirmLabel="Remove" />
    </div>
  );
};

export default Skills;
