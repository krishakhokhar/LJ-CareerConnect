import { Link } from 'react-router-dom';
import { Briefcase, Users, Star, Video, Trophy, Plus } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import recruiterService from '../../services/recruiter.service';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/charts/ChartCard';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import FunnelStages from '../../components/charts/FunnelStages';
import DonutChart from '../../components/charts/DonutChart';
import { CATEGORICAL } from '../../utils/chartTheme';

const Dashboard = () => {
  const { profile } = useAuth();
  const { data, loading, error } = useFetch(() => recruiterService.getDashboard(), []);

  if (loading) return <PageLoader label="Loading dashboard..." />;
  if (error) return <EmptyState title="Couldn't load dashboard" description={error} />;

  const { stats, charts } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${profile?.company?.name || 'Recruiter'}`}
        subtitle="Here's an overview of your hiring activity."
        actions={<Link to="/recruiter/jobs/create" className="btn-primary"><Plus size={16} /> Post a Job</Link>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Active Jobs" value={stats.activeJobs} icon={Briefcase} tone="blue" />
        <StatCard label="Total Applicants" value={stats.totalApplicants} icon={Users} tone="ink" />
        <StatCard label="Shortlisted" value={stats.shortlisted} icon={Star} tone="amber" />
        <StatCard label="Interviews" value={stats.interviews} icon={Video} tone="purple" />
        <StatCard label="Selected" value={stats.selected} icon={Trophy} tone="brand" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <ChartCard title="Applications per Job" isEmpty={!charts.applicationsPerJob?.length} action={null}>
          <SimpleBarChart data={charts.applicationsPerJob} xKey="job" series={[{ key: 'applicants', label: 'Applicants' }]} horizontal />
        </ChartCard>
        <ChartCard title="Hiring Funnel" isEmpty={!charts.hiringFunnel?.length}>
          <FunnelStages stages={charts.hiringFunnel} />
        </ChartCard>
        <ChartCard title="Application Status" isEmpty={!charts.applicationStatus?.length}>
          <DonutChart data={charts.applicationStatus} nameKey="status" valueKey="count" colors={CATEGORICAL} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
