import api from './api';

const getProfile = () => api.get('/students/profile').then((r) => r.data.data);
const updateProfile = (data) => api.put('/students/profile', data).then((r) => r.data.data);
const getDashboard = () => api.get('/students/dashboard').then((r) => r.data.data);

const getSkills = () => api.get('/skills').then((r) => r.data.data);
const addSkill = (data) => api.post('/skills', data).then((r) => r.data.data);
const updateSkill = (id, data) => api.put(`/skills/${id}`, data).then((r) => r.data.data);
const deleteSkill = (id) => api.delete(`/skills/${id}`).then((r) => r.data);

const getCertifications = () => api.get('/certifications').then((r) => r.data.data);
const addCertification = (formData) =>
  api.post('/certifications', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
const deleteCertification = (id) => api.delete(`/certifications/${id}`).then((r) => r.data);

const uploadResume = (formData) =>
  api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
const deleteResume = () => api.delete('/resume').then((r) => r.data);

export default {
  getProfile,
  updateProfile,
  getDashboard,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getCertifications,
  addCertification,
  deleteCertification,
  uploadResume,
  deleteResume,
};
