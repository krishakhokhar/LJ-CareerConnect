import api from './api';

const getJobs = (params) => api.get('/jobs', { params }).then((r) => r.data.data);
const getJobById = (id) => api.get(`/jobs/${id}`).then((r) => r.data.data);
const createJob = (data) => api.post('/jobs', data).then((r) => r.data.data);
const updateJob = (id, data) => api.put(`/jobs/${id}`, data).then((r) => r.data.data);
const deleteJob = (id) => api.delete(`/jobs/${id}`).then((r) => r.data);
const updateJobStatus = (id, status) => api.patch(`/jobs/${id}/status`, { status }).then((r) => r.data.data);
const toggleSaveJob = (id) => api.post(`/jobs/${id}/save`).then((r) => r.data.data);
const getSavedJobs = () => api.get('/jobs/saved/list').then((r) => r.data.data);
const applyToJob = (id, data) => api.post(`/jobs/${id}/apply`, data).then((r) => r.data.data);

export default { getJobs, getJobById, createJob, updateJob, deleteJob, updateJobStatus, toggleSaveJob, getSavedJobs, applyToJob };
