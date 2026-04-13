import API from './axios';

export const getAllUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const updateUserRole = (id, role) => API.put(`/users/${id}/role`, { role });
