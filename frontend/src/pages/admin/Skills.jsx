import useFetch from '../../hooks/useFetch';
import adminService from '../../services/admin.service';
import PageHeader from '../../components/common/PageHeader';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/charts/ChartCard';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import DonutChart from '../../components/charts/DonutChart';
import Avatar from '../../components/common/Avatar';
import { Award, Code2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { CATEGORICAL } from '../../utils/chartTheme';

const SkillsOverview = () => {
  const { data, loading, error } = useFetch(() => adminService.getSkillsOverview(), []);

  if (loading) return <PageLoader label="Loading skills overview..." />;
  if (error) return <EmptyState title="Couldn't load data" description={error} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Skills & Certifications" subtitle="Platform-wide view of student skills and certifications." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Skills Logged" value={data.totalSkills} icon={Code2} tone="blue" />
        <StatCard label="Total Certifications" value={data.totalCertifications} icon={Award} tone="brand" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Skills by Category" isEmpty={!data.byCategory?.length}>
          <SimpleBarChart data={data.byCategory} xKey="category" series={[{ key: 'count', label: 'Skills' }]} horizontal />
        </ChartCard>
        <ChartCard title="Skill Proficiency Levels" isEmpty={!data.byLevel?.length}>
          <DonutChart data={data.byLevel} nameKey="level" valueKey="count" colors={CATEGORICAL} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-5">
          <p className="mb-4 font-display text-sm font-bold text-ink-950">Top Skills Across Students</p>
          <div className="space-y-2.5">
            {data.topSkills.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="text-ink-700">{s.name}</span>
                <span className="badge-neutral">{s.count} students</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <p className="mb-4 font-display text-sm font-bold text-ink-950">Recent Certifications</p>
          <div className="space-y-3">
            {data.recentCertifications.map((c) => (
              <div key={c._id} className="flex items-center gap-3">
                <Avatar name={c.student?.fullName} size={30} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-800">{c.name}</p>
                  <p className="text-xs text-ink-400">{c.student?.fullName} · {c.organization}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-300">{formatDate(c.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsOverview;
