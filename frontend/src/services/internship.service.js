import api from './api';

const getInternships = (params) => api.get('/internships', { params }).then((r) => r.data.data);
const getInternshipById = (id) => api.get(`/internships/${id}`).then((r) => r.data.data);
const createInternship = (data) => api.post('/internships', data).then((r) => r.data.data);
const updateInternship = (id, data) => api.put(`/internships/${id}`, data).then((r) => r.data.data);
const deleteInternship = (id) => api.delete(`/internships/${id}`).then((r) => r.data);
const applyToInternship = (id, data) => api.post(`/internships/${id}/apply`, data).then((r) => r.data.data);
const getInternshipApplicants = (id) => api.get(`/internships/${id}/applicants`).then((r) => r.data.data);
const updateApplicationStatus = (id, status) => api.put(`/internships/applications/${id}/status`, { status }).then((r) => r.data.data);
const getMyApplications = () => api.get('/internships/my/applications').then((r) => r.data.data);
const uploadDocument = (id, formData) =>
  api.post(`/internships/applications/${id}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);

export default {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  applyToInternship,
  getInternshipApplicants,
  updateApplicationStatus,
  getMyApplications,
  uploadDocument,
};
