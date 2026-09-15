import { Users, UserCheck2, UserX2, GraduationCap, CalendarClock, ClipboardList } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import adminService from '../../services/admin.service';
import PageHeader from '../../components/common/PageHeader';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import StatCard from '../../components/common/StatCard';
import DonutChart from '../../components/charts/DonutChart';
import ChartCard from '../../components/charts/ChartCard';
import { CATEGORICAL } from '../../utils/chartTheme';

const Reports = () => {
  const { data, loading, error } = useFetch(() => adminService.getReports(), []);

  if (loading) return <PageLoader label="Generating reports..." />;
  if (error) return <EmptyState title="Couldn't load reports" description={error} />;

  const placementData = [
    { label: 'Placed', count: data.placedCount },
    { label: 'Not Placed', count: data.unplacedCount },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Consolidated placement statistics for the institution." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Total Students" value={data.studentCount} icon={Users} tone="blue" />
        <StatCard label="Placed Students" value={data.placedCount} icon={UserCheck2} tone="brand" />
        <StatCard label="Unplaced Students" value={data.unplacedCount} icon={UserX2} tone="amber" />
        <StatCard label="Alumni Records" value={data.alumniCount} icon={GraduationCap} tone="purple" />
        <StatCard label="Placement Drives" value={data.driveCount} icon={CalendarClock} tone="ink" />
        <StatCard label="Total Applications" value={data.internshipApplications} icon={ClipboardList} tone="blue" />
      </div>

      <ChartCard title="Placement Ratio">
        <DonutChart data={placementData} nameKey="label" valueKey="count" colors={CATEGORICAL} height={280} />
      </ChartCard>
    </div>
  );
};

export default Reports;
