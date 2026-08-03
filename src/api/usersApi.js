import api from './axios';

export const inviteUser = async (data) => {
  const response = await api.post('/users/invite', data);
  return response.data;
};

export const getInvitationByToken = async (token) => {
  const response = await api.get(`/users/invitations/${token}`);
  return response.data;
};

export const acceptInvitation = async (data) => {
  const response = await api.post('/users/invitations/accept', data);
  return response.data;
};

export const listUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.patch(`/users/${id}/role`, { role });
  return response.data;
};

export const changeUserPassword = async (id, password) => {
  const response = await api.patch(`/users/${id}/password`, { password });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
