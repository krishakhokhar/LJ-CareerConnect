import { Users, UserCheck, Building2, Briefcase, ClipboardList, Trophy, GraduationCap } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import adminService from '../../services/admin.service';
import StatCard from '../../components/common/StatCard';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/charts/ChartCard';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import TrendLineChart from '../../components/charts/TrendLineChart';
import DonutChart from '../../components/charts/DonutChart';
import { CATEGORICAL, CHART_COLORS } from '../../utils/chartTheme';

const Dashboard = () => {
  const { data, loading, error } = useFetch(() => adminService.getDashboard(), []);

  if (loading) return <PageLoader label="Loading dashboard..." />;
  if (error) return <EmptyState title="Couldn't load dashboard" description={error} />;

  const { stats, charts } = data;

  return (
    <div className="space-y-6">
      <PageHeader title="Placement Overview" subtitle="A real-time view of placements across the university." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Students" value={stats.totalStudents} icon={Users} tone="blue" />
        <StatCard label="Total Recruiters" value={stats.totalRecruiters} icon={UserCheck} tone="purple" />
        <StatCard label="Companies" value={stats.totalCompanies} icon={Building2} tone="ink" />
        <StatCard label="Active Jobs" value={stats.activeJobs} icon={Briefcase} tone="amber" />
        <StatCard label="Applications" value={stats.totalApplications} icon={ClipboardList} tone="blue" />
        <StatCard label="Placements" value={stats.placements} icon={Trophy} tone="brand" trend={`${stats.placementPercentage}% placement rate`} />
        <StatCard label="Internships" value={stats.totalInternships} icon={GraduationCap} tone="purple" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Department-wise Placement %" isEmpty={!charts.departmentWisePlacement?.length}>
          <SimpleBarChart data={charts.departmentWisePlacement} xKey="department" series={[{ key: 'percentage', label: '% Placed' }]} horizontal />
        </ChartCard>
        <ChartCard title="Company-wise Hiring" isEmpty={!charts.companyWiseHiring?.length}>
          <SimpleBarChart data={charts.companyWiseHiring} xKey="company" series={[{ key: 'count', label: 'Hired' }]} horizontal />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <ChartCard title="Monthly Applications" isEmpty={!charts.monthlyApplications?.length}>
          <TrendLineChart data={charts.monthlyApplications} xKey="month" yKey="count" />
        </ChartCard>
        <ChartCard title="Application Status" isEmpty={!charts.applicationStatus?.length}>
          <DonutChart data={charts.applicationStatus} nameKey="status" valueKey="count" colors={CATEGORICAL} />
        </ChartCard>
        <ChartCard title="Salary Package Analytics" isEmpty={!charts.salaryAnalytics?.length}>
          <SimpleBarChart data={charts.salaryAnalytics} xKey="range" series={[{ key: 'count', label: 'Offers', color: CHART_COLORS.brand }]} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
