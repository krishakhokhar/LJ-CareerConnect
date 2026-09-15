import { Link } from 'react-router-dom';
import { ClipboardList, Star, Video, Trophy, Sparkles, ArrowRight, MapPin, Building2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import studentService from '../../services/student.service';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ChartCard from '../../components/charts/ChartCard';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import TrendLineChart from '../../components/charts/TrendLineChart';
import DonutChart from '../../components/charts/DonutChart';
import { formatDate, formatSalaryRange } from '../../utils/formatters';
import { CATEGORICAL } from '../../utils/chartTheme';

const Dashboard = () => {
  const { profile } = useAuth();
  const { data, loading, error } = useFetch(() => studentService.getDashboard(), []);

  if (loading) return <PageLoader label="Loading your dashboard..." />;
  if (error) return <EmptyState title="Couldn't load dashboard" description={error} />;

  const { stats, profileCompletion, recentApplications, upcomingInterviews, recommendedJobs, charts } = data;

  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-6 overflow-hidden p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-950">Welcome back, {profile?.fullName?.split(' ')[0] || 'there'} 👋</h2>
          <p className="mt-1 text-sm text-ink-400">Here's what's happening with your career journey today.</p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-paper-100 p-4 sm:min-w-[220px]">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg className="h-14 w-14 -rotate-90">
              <circle cx="28" cy="28" r="24" strokeWidth="5" className="fill-none stroke-ink-100" />
              <circle
                cx="28" cy="28" r="24" strokeWidth="5" strokeLinecap="round"
                className="fill-none stroke-brand-500"
                strokeDasharray={2 * Math.PI * 24}
                strokeDashoffset={2 * Math.PI * 24 * (1 - profileCompletion / 100)}
              />
            </svg>
            <span className="absolute font-display text-xs font-bold text-ink-950">{profileCompletion}%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-800">Profile Completion</p>
            <Link to="/student/profile" className="text-xs font-medium text-brand-600 hover:text-brand-700">Complete your profile →</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Applications" value={stats.applications} icon={ClipboardList} tone="blue" />
        <StatCard label="Shortlisted" value={stats.shortlisted} icon={Star} tone="amber" />
        <StatCard label="Interviews" value={stats.interviews} icon={Video} tone="purple" />
        <StatCard label="Offers" value={stats.offers} icon={Trophy} tone="brand" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <ChartCard title="Application Status" isEmpty={!charts.applicationStatus?.length}>
          <SimpleBarChart
            data={charts.applicationStatus}
            xKey="status"
            series={[{ key: 'count', label: 'Applications' }]}
          />
        </ChartCard>
        <ChartCard title="Monthly Applications" isEmpty={!charts.monthlyApplications?.length}>
          <TrendLineChart data={charts.monthlyApplications} xKey="month" yKey="count" />
        </ChartCard>
        <ChartCard title="Skills Distribution" isEmpty={!charts.skillsDistribution?.length}>
          <DonutChart data={charts.skillsDistribution} nameKey="category" valueKey="count" colors={CATEGORICAL} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-sm font-bold text-ink-950">Recent Applications</p>
            <Link to="/student/applications" className="text-xs font-semibold text-brand-600 hover:text-brand-700">View all</Link>
          </div>
          {recentApplications.length === 0 ? (
            <EmptyState title="No applications yet" description="Start applying to jobs to see them here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app._id}>
                      <td className="font-medium text-ink-800">{app.job?.title}</td>
                      <td>{app.job?.company?.name}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td>{formatDate(app.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card p-5">
          <p className="mb-4 font-display text-sm font-bold text-ink-950">Upcoming Interviews</p>
          {upcomingInterviews.length === 0 ? (
            <EmptyState title="No interviews scheduled" />
          ) : (
            <div className="space-y-3">
              {upcomingInterviews.map((iv) => (
                <div key={iv._id} className="rounded-xl border border-ink-100 p-3.5">
                  <p className="text-sm font-semibold text-ink-800">{iv.job?.title}</p>
                  <p className="mt-1 text-xs text-ink-400">{formatDate(iv.scheduledDate)} · {iv.scheduledTime}</p>
                  <StatusBadge status={iv.status} className="mt-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-sm font-bold text-ink-950">Recommended Jobs</p>
            <Link to="/student/jobs" className="text-xs font-semibold text-brand-600 hover:text-brand-700">Browse all</Link>
          </div>
          {recommendedJobs.length === 0 ? (
            <EmptyState title="No recommendations yet" description="Add skills to your profile to get matched jobs." />
          ) : (
            <div className="space-y-3">
              {recommendedJobs.slice(0, 4).map((job) => (
                <Link key={job._id} to={`/student/jobs/${job._id}`} className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 p-3.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-800">{job.title}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-ink-400">
                      <Building2 size={12} /> {job.company?.name} <MapPin size={12} /> {job.location}
                    </p>
                  </div>
                  <span className="badge-brand shrink-0">{job.aiMatchScore}% Match</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card overflow-hidden bg-ink-950 p-5 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
            <Sparkles size={18} />
          </div>
          <p className="mt-4 font-display text-sm font-bold">Career AI Insights</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-400">
            Get a personalized skill gap analysis and career role recommendations based on your profile.
          </p>
          <Link to="/student/career-ai" className="btn-primary mt-5 w-full">
            Explore Career AI <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
