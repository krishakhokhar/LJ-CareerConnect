import { useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarClock, MapPin, Wallet, Users, CheckCircle2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import placementDriveService from '../../services/placementDrive.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { PageLoader } from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';

const PlacementDrives = () => {
  const { data: drives, loading, error, refetch } = useFetch(() => placementDriveService.getDrives(), []);
  const [registering, setRegistering] = useState(null);

  if (loading) return <PageLoader label="Loading placement drives..." />;
  if (error) return <EmptyState title="Couldn't load drives" description={error} />;

  const handleRegister = async (drive) => {
    setRegistering(drive._id);
    try {
      await placementDriveService.registerForDrive(drive._id);
      toast.success('Successfully registered for the drive!');
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div>
      <PageHeader title="Placement Drives" subtitle="Register for upcoming placement drives you're eligible for." />

      {drives.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No placement drives yet" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {drives.map((drive) => (
            <div key={drive._id} className="card-hover flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Avatar name={drive.company?.name} src={drive.company?.logo} size={42} className="rounded-xl" />
                  <div>
                    <p className="font-display text-sm font-bold text-ink-950">{drive.driveName}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{drive.jobRole}</p>
                  </div>
                </div>
                <StatusBadge status={drive.status} />
              </div>

              <div className="space-y-1.5 text-xs text-ink-500">
                <p className="flex items-center gap-1.5"><CalendarClock size={13} /> {formatDate(drive.driveDate)} · {drive.driveTime}</p>
                <p className="flex items-center gap-1.5"><MapPin size={13} /> {drive.mode === 'Online' ? 'Online' : drive.venue}</p>
                <p className="flex items-center gap-1.5"><Wallet size={13} /> {drive.salaryPackage}</p>
                <p className="flex items-center gap-1.5"><Users size={13} /> {drive.openings} openings · {drive.registeredStudents?.length || 0} registered</p>
              </div>

              {drive.requiredSkills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {drive.requiredSkills.slice(0, 4).map((s) => <span key={s} className="badge-neutral">{s}</span>)}
                </div>
              )}

              <div className="mt-auto border-t border-ink-100 pt-4">
                {drive.isEligible === false ? (
                  <p className="text-center text-xs font-medium text-ink-400">You don't meet the eligibility criteria for this drive.</p>
                ) : drive.isRegistered ? (
                  <div className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-50 py-2.5 text-sm font-semibold text-brand-700">
                    <CheckCircle2 size={16} /> Registered
                  </div>
                ) : (
                  <button onClick={() => handleRegister(drive)} disabled={registering === drive._id} className="btn-primary w-full">
                    {registering === drive._id ? 'Registering...' : 'Register Now'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacementDrives;
