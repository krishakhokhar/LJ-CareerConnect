import api from './api';

const getDrives = (params) => api.get('/placement-drives', { params }).then((r) => r.data.data);
const getDriveById = (id) => api.get(`/placement-drives/${id}`).then((r) => r.data.data);
const createDrive = (data) => api.post('/placement-drives', data).then((r) => r.data.data);
const updateDrive = (id, data) => api.put(`/placement-drives/${id}`, data).then((r) => r.data.data);
const deleteDrive = (id) => api.delete(`/placement-drives/${id}`).then((r) => r.data);
const registerForDrive = (id) => api.post(`/placement-drives/${id}/register`).then((r) => r.data.data);

export default { getDrives, getDriveById, createDrive, updateDrive, deleteDrive, registerForDrive };
