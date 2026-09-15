import api from './api';

const getCompanies = (params) => api.get('/companies', { params }).then((r) => r.data.data);
const getCompanyById = (id) => api.get(`/companies/${id}`).then((r) => r.data.data);
const updateCompany = (id, data) => api.put(`/companies/${id}`, data).then((r) => r.data.data);
const deleteCompany = (id) => api.delete(`/companies/${id}`).then((r) => r.data);

export default { getCompanies, getCompanyById, updateCompany, deleteCompany };
