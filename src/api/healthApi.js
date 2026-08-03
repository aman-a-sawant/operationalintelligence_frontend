import api from './axios';

export const getProjectHealth = async (projectId) => {
  const response = await api.get(`/health/project/${projectId}`);
  return response.data;
};

export const getServicesHealth = async (projectId) => {
  const response = await api.get(`/health/services/${projectId}`);
  return response.data;
};

export const getJourneysHealth = async () => {
  return [];
};

export const getInfrastructureHealth = async (projectId) => {
  const response = await api.get(`/health/infrastructure/${projectId}`);
  return response.data;
};
