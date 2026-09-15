import { useEffect, useState } from 'react';
import { GraduationCap, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import internshipService from '../../services/internship.service';
import InternshipCard from '../../components/jobs/InternshipCard';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import Spinner from '../../components/common/Spinner';
import FileDropzone from '../../components/forms/FileDropzone';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const Internships = () => {
  const [tab, setTab] = useState('browse');
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadTarget, setUploadTarget] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      if (tab === 'browse') {
        const data = await internshipService.getInternships({ limit: 12 });
        setInternships(data.internships);
      } else {
        const data = await internshipService.getMyApplications();
        setApplications(data);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleUploadDocument = async () => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('certificate', uploadFile);
      await internshipService.uploadDocument(uploadTarget._id, formData);
      toast.success('Document uploaded successfully.');
      setUploadTarget(null);
      setUploadFile(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Internships" subtitle="Discover internships and track your applications." />

      <div className="mb-6 flex gap-2 rounded-xl bg-ink-100 p-1 sm:w-fit">
        <button onClick={() => setTab('browse')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === 'browse' ? 'bg-white text-ink-950 shadow-soft' : 'text-ink-500'}`}>
          Browse
        </button>
        <button onClick={() => setTab('applications')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === 'applications' ? 'bg-white text-ink-950 shadow-soft' : 'text-ink-500'}`}>
          My Applications
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : tab === 'browse' ? (
        internships.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No internships available" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {internships.map((i) => <InternshipCard key={i._id} internship={i} linkTo={`/student/internships/${i._id}`} />)}
          </div>
        )
      ) : applications.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No internship applications yet" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr><th>Internship</th><th>Company</th><th>Status</th><th>Applied</th><th>Documents</th></tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="font-medium text-ink-800">{app.internship?.title}</td>
                  <td><div className="flex items-center gap-2"><Avatar name={app.internship?.company?.name} src={app.internship?.company?.logo} size={26} /> {app.internship?.company?.name}</div></td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>
                    <button onClick={() => setUploadTarget(app)} className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                      <Upload size={13} /> Upload ({app.documents?.length || 0})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(uploadTarget)}
        onClose={() => { setUploadTarget(null); setUploadFile(null); }}
        title="Upload Internship Document"
        footer={
          <>
            <button className="btn-outline" onClick={() => setUploadTarget(null)} disabled={uploading}>Cancel</button>
            <button className="btn-primary" onClick={handleUploadDocument} disabled={uploading || !uploadFile}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </>
        }
      >
        <FileDropzone
          accept=".pdf,.png,.jpg,.jpeg"
          hint="PDF or image, up to 5MB"
          fileName={uploadFile?.name}
          onFileSelect={setUploadFile}
          onClear={() => setUploadFile(null)}
        />
      </Modal>
    </div>
  );
};

export default Internships;
