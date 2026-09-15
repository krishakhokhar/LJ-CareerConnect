import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '../pages/public/LandingPage';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import StudentLayout from '../layouts/StudentLayout';
import StudentDashboard from '../pages/student/Dashboard';
import StudentJobs from '../pages/student/Jobs';
import StudentJobDetails from '../pages/student/JobDetails';
import StudentPlacementDrives from '../pages/student/PlacementDrives';
import StudentApplications from '../pages/student/Applications';
import StudentApplicationDetails from '../pages/student/ApplicationDetails';
import StudentInterviews from '../pages/student/Interviews';
import StudentInternships from '../pages/student/Internships';
import StudentInternshipDetails from '../pages/student/InternshipDetails';
import StudentSkills from '../pages/student/Skills';
import StudentResume from '../pages/student/Resume';
import StudentCareerAI from '../pages/student/CareerAI';
import StudentProfile from '../pages/student/Profile';

import RecruiterLayout from '../layouts/RecruiterLayout';
import RecruiterDashboard from '../pages/recruiter/Dashboard';
import RecruiterJobs from '../pages/recruiter/Jobs';
import RecruiterJobForm from '../pages/recruiter/JobForm';
import RecruiterApplicants from '../pages/recruiter/Applicants';
import RecruiterInterviews from '../pages/recruiter/Interviews';
import RecruiterCompanyProfile from '../pages/recruiter/CompanyProfile';
import RecruiterInternships from '../pages/recruiter/Internships';

import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminStudents from '../pages/admin/Students';
import AdminRecruiters from '../pages/admin/Recruiters';
import AdminCompanies from '../pages/admin/Companies';
import AdminJobs from '../pages/admin/Jobs';
import AdminPlacementDrives from '../pages/admin/PlacementDrives';
import AdminApplications from '../pages/admin/Applications';
import AdminInternships from '../pages/admin/Internships';
import AdminSkills from '../pages/admin/Skills';
import AdminAlumni from '../pages/admin/Alumni';
import AdminReports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';

import NotificationsPage from '../pages/shared/NotificationsPage';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<LandingPage />} />

    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Route>

    {/* Student */}
    <Route element={<ProtectedRoute roles={['STUDENT']} />}>
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="jobs" element={<StudentJobs />} />
        <Route path="jobs/:id" element={<StudentJobDetails />} />
        <Route path="placement-drives" element={<StudentPlacementDrives />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="applications/:id" element={<StudentApplicationDetails />} />
        <Route path="interviews" element={<StudentInterviews />} />
        <Route path="internships" element={<StudentInternships />} />
        <Route path="internships/:id" element={<StudentInternshipDetails />} />
        <Route path="skills" element={<StudentSkills />} />
        <Route path="resume" element={<StudentResume />} />
        <Route path="career-ai" element={<StudentCareerAI />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>
    </Route>

    {/* Recruiter */}
    <Route element={<ProtectedRoute roles={['RECRUITER']} />}>
      <Route path="/recruiter" element={<RecruiterLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="jobs" element={<RecruiterJobs />} />
        <Route path="jobs/create" element={<RecruiterJobForm />} />
        <Route path="jobs/:id/edit" element={<RecruiterJobForm />} />
        <Route path="internships" element={<RecruiterInternships />} />
        <Route path="applicants" element={<RecruiterApplicants />} />
        <Route path="interviews" element={<RecruiterInterviews />} />
        <Route path="company-profile" element={<RecruiterCompanyProfile />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
    </Route>

    {/* Admin */}
    <Route element={<ProtectedRoute roles={['ADMIN']} />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="recruiters" element={<AdminRecruiters />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="placement-drives" element={<AdminPlacementDrives />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="internships" element={<AdminInternships />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="alumni" element={<AdminAlumni />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Route>

    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
