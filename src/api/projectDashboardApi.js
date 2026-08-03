import api from './axios';

export const getProjectDashboard = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/dashboard`);
  return response.data;
};
