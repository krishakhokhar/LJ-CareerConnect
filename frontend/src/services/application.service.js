import api from './api';

const getApplications = (params) => api.get('/applications', { params }).then((r) => r.data.data);
const getApplicationById = (id) => api.get(`/applications/${id}`).then((r) => r.data.data);
const updateApplicationStatus = (id, data) => api.put(`/applications/${id}/status`, data).then((r) => r.data.data);

export default { getApplications, getApplicationById, updateApplicationStatus };
