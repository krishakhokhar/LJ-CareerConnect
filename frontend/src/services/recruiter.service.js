import api from './api';

const getProfile = () => api.get('/recruiters/profile').then((r) => r.data.data);
const updateProfile = (data) => api.put('/recruiters/profile', data).then((r) => r.data.data);
const getDashboard = () => api.get('/recruiters/dashboard').then((r) => r.data.data);
const getApplicants = (params) => api.get('/recruiters/applicants', { params }).then((r) => r.data.data);

export default { getProfile, updateProfile, getDashboard, getApplicants };
