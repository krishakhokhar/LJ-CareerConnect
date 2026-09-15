import { useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, Download, Trash2, RefreshCw, ShieldCheck } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import studentService from '../../services/student.service';
import PageHeader from '../../components/common/PageHeader';
import { PageLoader } from '../../components/common/Spinner';
import FileDropzone from '../../components/forms/FileDropzone';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDateTime } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const MAX_SIZE = 5 * 1024 * 1024;

const Resume = () => {
  const { data: profile, loading, refetch } = useFetch(() => studentService.getProfile(), []);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (loading) return <PageLoader label="Loading resume..." />;

  const resume = profile?.resume;

  const handleFileSelect = (selected) => {
    if (selected.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      return;
    }
    if (selected.size > MAX_SIZE) {
      toast.error('File size must be under 5MB.');
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      await studentService.uploadResume(formData);
      toast.success('Resume uploaded successfully.');
      setFile(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await studentService.deleteResume();
      toast.success('Resume deleted.');
      setConfirmDelete(false);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Resume" subtitle="Keep your resume up to date - it's submitted automatically when you apply." />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-6">
          {resume?.resumeUrl ? (
            <div>
              <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-paper-50 p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <FileText size={26} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-900">{resume.fileName || 'resume.pdf'}</p>
                  <p className="mt-0.5 text-xs text-ink-400">Uploaded {formatDateTime(resume.uploadedAt)}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <a href={resume.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline btn-sm"><Download size={14} /> View / Download</a>
                <button onClick={() => setConfirmDelete(true)} className="btn-outline btn-sm text-red-600 hover:bg-red-50"><Trash2 size={14} /> Delete</button>
              </div>

              <div className="mt-8 border-t border-ink-100 pt-6">
                <p className="mb-3 text-sm font-semibold text-ink-700 flex items-center gap-2"><RefreshCw size={14} /> Replace Resume</p>
                <FileDropzone accept=".pdf" hint="PDF only, up to 5MB" fileName={file?.name} onFileSelect={handleFileSelect} onClear={() => setFile(null)} />
                {file && (
                  <button onClick={handleUpload} disabled={uploading} className="btn-primary mt-4 w-full">
                    {uploading ? 'Uploading...' : 'Upload New Resume'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <FileDropzone accept=".pdf" hint="PDF only, up to 5MB" fileName={file?.name} onFileSelect={handleFileSelect} onClear={() => setFile(null)} label="Upload your resume" />
              {file && (
                <button onClick={handleUpload} disabled={uploading} className="btn-primary mt-4 w-full">
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><ShieldCheck size={18} /></div>
          <p className="mt-3 font-display text-sm font-bold text-ink-950">Resume Tips</p>
          <ul className="mt-3 space-y-2.5 text-xs text-ink-500">
            <li>• Keep it to 1-2 pages, focused on relevant experience.</li>
            <li>• List measurable achievements, not just responsibilities.</li>
            <li>• Match keywords to the roles you're targeting.</li>
            <li>• Export as PDF to preserve formatting across devices.</li>
          </ul>
        </div>
      </div>

      <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={handleDelete} title="Delete resume?" message="You'll need to upload a new resume before applying to jobs again." confirmLabel="Delete" />
    </div>
  );
};

export default Resume;
