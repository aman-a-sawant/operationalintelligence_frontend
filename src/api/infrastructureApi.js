import api from './axios';

export const getInfrastructure = async () => {
  const response = await api.get('/infrastructure');
  return response.data;
};

export const getInfrastructureByProject = async (projectId) => {
  const response = await api.get(`/infrastructure/project/${projectId}`);
  return response.data;
};

export const getInfrastructureById = async (id) => {
  const response = await api.get(`/infrastructure/${id}`);
  return response.data;
};

export const createInfrastructure = async (data) => {
  const response = await api.post('/infrastructure', data);
  return response.data;
};

export const updateInfrastructure = async (id, data) => {
  const response = await api.put(`/infrastructure/${id}`, data);
  return response.data;
};

export const deleteInfrastructure = async (id) => {
  const response = await api.delete(`/infrastructure/${id}`);
  return response.data;
};
