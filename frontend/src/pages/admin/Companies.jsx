import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Building2, Search, BadgeCheck, Trash2, Globe, MapPin } from 'lucide-react';
import companyService from '../../services/company.service';
import adminService from '../../services/admin.service';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import useDebounce from '../../hooks/useDebounce';
import { getErrorMessage } from '../../services/api';

const Companies = () => {
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  const load = async () => {
    setLoading(true);
    try {
      const data = await companyService.getCompanies({ search: debouncedSearch || undefined });
      setCompanies(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleVerify = async (c) => {
    try {
      await adminService.verifyCompany(c._id);
      toast.success('Verification status updated.');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await companyService.deleteCompany(deleteTarget._id);
      toast.success('Company deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Companies" subtitle="Manage companies registered on the platform." />

      <div className="relative mb-5 w-64">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
        <input className="input pl-9" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
      ) : companies.length === 0 ? (
        <EmptyState icon={Building2} title="No companies found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <div key={c._id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} src={c.logo} size={42} className="rounded-xl" />
                  <div>
                    <p className="font-display text-sm font-bold text-ink-950">{c.name}</p>
                    <p className="text-xs text-ink-400">{c.industry}</p>
                  </div>
                </div>
                {c.isVerified && <span className="badge-brand"><BadgeCheck size={12} /> Verified</span>}
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-ink-500">
                <p className="flex items-center gap-1.5"><MapPin size={12} /> {c.location}</p>
                {c.website && <p className="flex items-center gap-1.5 truncate"><Globe size={12} /> {c.website}</p>}
              </div>
              <div className="mt-4 flex gap-2 border-t border-ink-100 pt-4">
                <button onClick={() => handleVerify(c)} className="btn-outline btn-sm flex-1">{c.isVerified ? 'Unverify' : 'Verify'}</button>
                <button onClick={() => setDeleteTarget(c)} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete company?" message={`Delete "${deleteTarget?.name}"? Associated jobs may be affected.`} confirmLabel="Delete" />
    </div>
  );
};

export default Companies;
