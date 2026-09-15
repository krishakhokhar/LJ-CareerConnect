import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Briefcase } from 'lucide-react';
import jobService from '../../services/job.service';
import JobFilters from '../../components/jobs/JobFilters';
import JobCard from '../../components/jobs/JobCard';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import useDebounce from '../../hooks/useDebounce';
import { getErrorMessage } from '../../services/api';

const Jobs = () => {
  const [filters, setFilters] = useState({ page: 1 });
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(filters.search, 400);

  const load = async () => {
    setLoading(true);
    try {
      const params = { ...filters, search: debouncedSearch, page: filters.page || 1, limit: 9 };
      const data = await jobService.getJobs(params);
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.jobType, filters.location, filters.minSalary, filters.skills, filters.sort, filters.page]);

  const handleFilterChange = (next) => setFilters({ ...next, page: 1 });
  const handleReset = () => setFilters({ page: 1 });

  const handleToggleSave = async (jobId) => {
    try {
      const res = await jobService.toggleSaveJob(jobId);
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (res.saved) next.add(jobId); else next.delete(jobId);
        return next;
      });
      toast.success(res.saved ? 'Job saved' : 'Removed from saved jobs');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Job Portal" subtitle="Discover AI-matched opportunities based on your profile." />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <JobFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />
        </div>

        <div>
          {loading ? (
            <div className="flex h-64 items-center justify-center"><Spinner size={26} /></div>
          ) : jobs.length === 0 ? (
            <EmptyState icon={Briefcase} title="No jobs found" description="Try adjusting your filters or search terms." />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSaved={savedIds.has(job._id)}
                    onToggleSave={handleToggleSave}
                    linkTo={`/student/jobs/${job._id}`}
                  />
                ))}
              </div>
              {pagination && (
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  total={pagination.total}
                  limit={pagination.limit}
                  onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
