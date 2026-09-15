import api from './api';

const getAlumni = (params) => api.get('/alumni', { params }).then((r) => r.data.data);
const getAnalytics = () => api.get('/alumni/analytics').then((r) => r.data.data);
const createAlumni = (data) => api.post('/alumni', data).then((r) => r.data.data);
const updateAlumni = (id, data) => api.put(`/alumni/${id}`, data).then((r) => r.data.data);
const deleteAlumni = (id) => api.delete(`/alumni/${id}`).then((r) => r.data);

export default { getAlumni, getAnalytics, createAlumni, updateAlumni, deleteAlumni };
