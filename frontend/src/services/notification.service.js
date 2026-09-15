import api from './api';

const getNotifications = (params) => api.get('/notifications', { params }).then((r) => r.data.data);
const markAsRead = (id) => api.put(`/notifications/${id}/read`).then((r) => r.data.data);
const markAllAsRead = () => api.put('/notifications/read-all').then((r) => r.data);
const deleteNotification = (id) => api.delete(`/notifications/${id}`).then((r) => r.data);
const createAnnouncement = (data) => api.post('/notifications/announcement', data).then((r) => r.data.data);

export default { getNotifications, markAsRead, markAllAsRead, deleteNotification, createAnnouncement };
