import api from './axios';

// Project API
export const createProjectApi = async (data) => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const getProjectsApi = getProjects;

// Services CRUD API
export const defineServicesApi = async (servicesData) => {
  const response = await api.post('/services', servicesData);
  return response.data;
};

export const getServicesApi = async (projectId) => {
  const response = await api.get(`/services?projectId=${projectId}`);
  return response.data;
};

export const updateServiceApi = async (id, data) => {
  const response = await api.put(`/services/${id}`, data);
  return response.data;
};

export const deleteServiceApi = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

// Dependencies API
export const mapDependenciesApi = async (dependenciesData) => {
  const response = await api.post('/dependencies', dependenciesData);
  return response.data;
};

export const fetchProjectTopologyApi = async (projectId) => {
  const response = await api.get(`/dependencies/project/${projectId}/topology`);
  return response.data;
};

// Infrastructure CRUD API
export const registerInfrastructureApi = async (infraData) => {
  const response = await api.post('/infrastructure', infraData);
  return response.data;
};

export const getInfrastructureApi = async (projectId) => {
  const response = await api.get(`/infrastructure/project/${projectId}`);
  return response.data;
};

export const updateInfrastructureApi = async (id, data) => {
  const response = await api.put(`/infrastructure/${id}`, data);
  return response.data;
};

export const deleteInfrastructureApi = async (id) => {
  const response = await api.delete(`/infrastructure/${id}`);
  return response.data;
};

// Team Invitations API
export const inviteTeamMembersApi = async (teamData) => {
  const response = await api.post('/users/invite', teamData);
  return response.data;
};

export const getInvitationByTokenApi = async (token) => {
  const response = await api.get(`/users/invitations/${token}`);
  return response.data;
};

export const acceptInvitationApi = async (payload) => {
  const response = await api.post('/users/invitations/accept', payload);
  return response.data;
};

export const resendInvitationApi = async (id) => {
  const response = await api.post('/users/invite', { id });
  return response.data;
};

export const removeInvitationApi = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Onboarding Step State & Progress API
export const getOnboardingStatusApi = async (projectId) => {
  const response = await api.get(`/project-onboarding/${projectId}`);
  return response.data;
};

export const advanceOnboardingStepApi = async (projectId, stepName) => {
  const response = await api.post('/project-onboarding/next-step', { projectId, stepName });
  return response.data;
};

// Complete Onboarding API
export const completeProjectOnboardingApi = async (projectId, wizardData) => {
  const response = await api.post('/project-onboarding/complete', { projectId, wizardData });
  return response.data;
};

// Project Monitoring Config API
export const saveMonitoringConfigApi = async (projectId, configData) => {
  const response = await api.post(`/projects/${projectId}/monitoring-config`, configData);
  return response.data;
};

export const getMonitoringConfigApi = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/monitoring-config`);
  return response.data;
};

export const verifyMonitoringEndpointsApi = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/verify`);
  return response.data;
};

export const completeFullOnboarding = async (fullWizardState) => {
  // ── Step 1: Create Project ──────────────────────────────
  const projectPayload = {
    name: fullWizardState.step1?.name || 'New Project',
    description: fullWizardState.step1?.description || '',
    owner: fullWizardState.step1?.owner || '',
    businessDomain: fullWizardState.step1?.businessDomain || '',
    criticality: fullWizardState.step1?.criticality || 'Medium'
  };

  const projectRes = await createProjectApi(projectPayload);
  const projectId = projectRes._id || projectRes.id;

  // ── Step 2: Create Services ─────────────────────────────
  if (fullWizardState.step2 && fullWizardState.step2.length > 0) {
    await Promise.allSettled(
      fullWizardState.step2.map((svc) =>
        defineServicesApi({
          projectId,
          name: svc.name,
          description: svc.description || '',
          type: svc.type || 'Backend',
          environment: svc.environment || 'Production',
          owner: svc.owner || ''
        })
      )
    );
  }

  // ── Step 3: Map Dependencies ────────────────────────────
  if (fullWizardState.step3 && fullWizardState.step3.length > 0) {
    await Promise.allSettled(
      fullWizardState.step3.map((dep) =>
        mapDependenciesApi({
          projectId,
          sourceServiceId: dep.sourceServiceId || dep.sourceService || 'svc_1',
          targetServiceId: dep.targetServiceId || dep.targetService || 'svc_2',
          dependencyType: dep.dependencyType || 'API',
          criticality: dep.criticality || 'Medium',
          endpointUrl: dep.endpointUrl || ''
        })
      )
    );
  }

  // ── Step 4: Register Infrastructure ────────────────────
  if (fullWizardState.step4 && fullWizardState.step4.length > 0) {
    await Promise.allSettled(
      fullWizardState.step4.map((infra) =>
        registerInfrastructureApi({
          projectId,
          name: infra.name,
          description: infra.description || '',
          type: infra.type || 'Database',
          environment: infra.environment || 'Production',
          criticality: infra.criticality || 'High',
          linkedServices: infra.linkedServices || []
        })
      )
    );
  }

  // ── Monitoring Config: Deployments, Endpoints & Telemetry ──
  try {
    const isFeSelected = fullWizardState.componentsSelected?.frontend !== false;
    const isBeSelected = fullWizardState.componentsSelected?.backend !== false;
    const isDbSelected = Boolean(fullWizardState.componentsSelected?.database);
    const dbData = fullWizardState.step3Database || {};
    const isDbValid = isDbSelected && Boolean(dbData.host && dbData.host.trim() !== '' && dbData.host !== 'db.primary.internal');

    const monitoringPayload = {
      frontend: {
        enabled: isFeSelected,
        url: isFeSelected ? (fullWizardState.step2Deployments?.frontendUrl || fullWizardState.monitoringConfig?.frontendUrl || '') : '',
        healthEndpoint: ''
      },
      backend: {
        enabled: isBeSelected,
        url: isBeSelected ? (fullWizardState.step2Deployments?.backendUrl || fullWizardState.monitoringConfig?.backendUrl || '') : '',
        healthEndpoint: fullWizardState.step4Endpoints?.health || '',
        readinessEndpoint: fullWizardState.step4Endpoints?.readiness || '',
        metricsEndpoint: fullWizardState.step4Endpoints?.metrics || ''
      },
      database: {
        enabled: isDbValid,
        type: dbData.type || 'PostgreSQL',
        host: isDbValid ? dbData.host : '',
        port: dbData.port || 5432,
        environment: dbData.environment || 'Production'
      },
      telemetryProvider: fullWizardState.step5TelemetryProvider || fullWizardState.monitoringConfig?.telemetryProvider || 'OpenTelemetry'
    };

    await saveMonitoringConfigApi(projectId, monitoringPayload);
    await verifyMonitoringEndpointsApi(projectId);
  } catch (err) {
    console.warn('Monitoring config auto-save warning:', err.message);
  }

  // ── Final: Mark Onboarding Complete ────────────────────
  let completionResult = {};
  try {
    completionResult = await completeProjectOnboardingApi(projectId, fullWizardState);
  } catch (err) {
    completionResult = { redirectUrl: `/project/${projectId}/dashboard`, status: 'Completed' };
  }

  return {
    success: true,
    projectId,
    redirectUrl: `/project/${projectId}/dashboard`,
    status: completionResult.status || 'Completed',
    project: projectRes
  };
};

