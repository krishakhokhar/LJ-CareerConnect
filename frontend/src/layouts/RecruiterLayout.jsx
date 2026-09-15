import { LayoutDashboard, Briefcase, PlusCircle, Users, Video, Building2, GraduationCap, Bell } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const items = [
  { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/recruiter/jobs', label: 'Jobs', icon: Briefcase, end: true },
  { to: '/recruiter/jobs/create', label: 'Create Job', icon: PlusCircle },
  { to: '/recruiter/internships', label: 'Internships', icon: GraduationCap },
  { to: '/recruiter/applicants', label: 'Applicants', icon: Users },
  { to: '/recruiter/interviews', label: 'Interviews', icon: Video },
  { to: '/recruiter/company-profile', label: 'Company Profile', icon: Building2 },
  { to: '/recruiter/notifications', label: 'Notifications', icon: Bell },
];

const RecruiterLayout = () => <DashboardLayout items={items} roleLabel="Recruiter" />;

export default RecruiterLayout;
