import {
  LayoutDashboard,
  Briefcase,
  CalendarClock,
  ClipboardList,
  Video,
  GraduationCap,
  Award,
  FileText,
  Sparkles,
  Bell,
  User,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const items = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/student/placement-drives', label: 'Placement Drives', icon: CalendarClock },
  { to: '/student/applications', label: 'My Applications', icon: ClipboardList },
  { to: '/student/interviews', label: 'Interviews', icon: Video },
  { to: '/student/internships', label: 'Internships', icon: GraduationCap },
  { to: '/student/skills', label: 'Skills & Certifications', icon: Award },
  { to: '/student/resume', label: 'Resume', icon: FileText },
  { to: '/student/career-ai', label: 'Career AI', icon: Sparkles },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
  { to: '/student/profile', label: 'Profile', icon: User },
];

const StudentLayout = () => <DashboardLayout items={items} roleLabel="Student" />;

export default StudentLayout;
