import api from './api';

const getDashboard = () => api.get('/admin/dashboard').then((r) => r.data.data);
const getStudents = (params) => api.get('/admin/students', { params }).then((r) => r.data.data);
const toggleStudentStatus = (id) => api.put(`/admin/students/${id}/status`).then((r) => r.data.data);
const getRecruiters = (params) => api.get('/admin/recruiters', { params }).then((r) => r.data.data);
const toggleRecruiterStatus = (id) => api.put(`/admin/recruiters/${id}/status`).then((r) => r.data.data);
const verifyCompany = (id) => api.put(`/admin/companies/${id}/verify`).then((r) => r.data.data);
const getReports = () => api.get('/admin/reports').then((r) => r.data.data);
const getSkillsOverview = () => api.get('/admin/skills-overview').then((r) => r.data.data);

export default { getDashboard, getStudents, toggleStudentStatus, getRecruiters, toggleRecruiterStatus, verifyCompany, getReports, getSkillsOverview };
