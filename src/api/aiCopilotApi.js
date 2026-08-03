import api from './axios';

export const analyzeProject = async (projectId) => {
  const response = await api.post(`/ai-copilot/project/${projectId}/analyze`);
  return response.data;
};

export const chatWithCopilot = async (projectId, question) => {
  const response = await api.post('/ai-copilot/chat', { projectId, question });
  return response.data;
};

export const runOperationsAgents = async (projectId) => {
  const response = await api.post(`/agents/project/${projectId}/run`);
  return response.data;
};

export const getLatestReport = async (projectId) => {
  const response = await api.get(`/ai-copilot/project/${projectId}/latest-report`);
  return response.data;
};
