import api from './api';

const getStatus = () => api.get('/ai/status').then((r) => r.data.data);
const getRoles = () => api.get('/ai/roles').then((r) => r.data.data);
const jobMatch = (jobId) => api.post('/ai/job-match', { jobId }).then((r) => r.data.data);
const skillGap = (targetRole) => api.post('/ai/skill-gap', { targetRole }).then((r) => r.data.data);
const careerRecommendation = () => api.post('/ai/career-recommendation').then((r) => r.data.data);

export default { getStatus, getRoles, jobMatch, skillGap, careerRecommendation };
