import api from './api';

const getInterviews = (params) => api.get('/interviews', { params }).then((r) => r.data.data);
const scheduleInterview = (data) => api.post('/interviews', data).then((r) => r.data.data);
const updateInterview = (id, data) => api.put(`/interviews/${id}`, data).then((r) => r.data.data);

export default { getInterviews, scheduleInterview, updateInterview };
