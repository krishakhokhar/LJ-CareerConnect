import api from './api';

const registerStudent = (data) => api.post('/auth/register/student', data).then((r) => r.data.data);
const registerRecruiter = (data) => api.post('/auth/register/recruiter', data).then((r) => r.data.data);
const login = (data) => api.post('/auth/login', data).then((r) => r.data.data);
const getMe = () => api.get('/auth/me').then((r) => r.data.data);
const forgotPassword = (email) => api.post('/auth/forgot-password', { email }).then((r) => r.data.data);
const resetPassword = (token, password) => api.post('/auth/reset-password', { token, password }).then((r) => r.data.data);
const logout = () => api.post('/auth/logout');

export default { registerStudent, registerRecruiter, login, getMe, forgotPassword, resetPassword, logout };
