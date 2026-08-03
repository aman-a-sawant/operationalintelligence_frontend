import api from './axios';
import { createProject as createProjectService } from './projectApi';

export const initialWorkspaceData = {
  projectCount: 0,
  activeProjects: 0,
  healthyProjects: 0,
  criticalProjects: 0,
  activeIncidents: 0,
  revenueAtRisk: 0,
  impactedUsers: 0,
  projects: []
};

export const getWorkspaceDashboard = async () => {
  const response = await api.get('/workspace/dashboard');
  return response.data;
};

export const createProject = async (projectData) => {
  return createProjectService(projectData);
};
