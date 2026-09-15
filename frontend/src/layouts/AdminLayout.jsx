import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Briefcase,
  CalendarClock,
  ClipboardList,
  GraduationCap,
  Award,
  UserCircle2,
  BarChart3,
  Bell,
  Settings,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/recruiters', label: 'Recruiters', icon: UserCheck },
  { to: '/admin/companies', label: 'Companies', icon: Building2 },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/admin/placement-drives', label: 'Placement Drives', icon: CalendarClock },
  { to: '/admin/applications', label: 'Applications', icon: ClipboardList },
  { to: '/admin/internships', label: 'Internships', icon: GraduationCap },
  { to: '/admin/skills', label: 'Skills & Certifications', icon: Award },
  { to: '/admin/alumni', label: 'Alumni', icon: UserCircle2 },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = () => <DashboardLayout items={items} roleLabel="Placement Officer" />;

export default AdminLayout;
