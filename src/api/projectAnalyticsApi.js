import api from './axios';

// 1. Overview API
export const getAnalyticsOverview = async () => {
  const response = await api.get('/project-analytics/overview');
  return response.data;
};

// 2. Endpoint Health API
export const getEndpointHealth = async () => {
  const response = await api.get('/project-analytics/endpoint-health');
  return response.data;
};

// 3. Availability Analytics API
export const getAvailabilityAnalytics = async () => {
  const response = await api.get('/project-analytics/availability');
  return response.data;
};

// 4. Error Analytics API
export const getErrorsAnalytics = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.projectId) query.set('projectId', params.projectId);
  const url = query.toString() ? `/project-analytics/errors?${query.toString()}` : '/project-analytics/errors';
  const response = await api.get(url);
  return response.data;
};

// 5. Monitoring Readiness API
export const getMonitoringReadinessAnalytics = async () => {
  const response = await api.get('/project-analytics/monitoring-readiness');
  return response.data;
};

// Helper: Recent Verification Failures
export const getRecentVerificationFailures = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.projectId) query.set('projectId', params.projectId);
  if (params.errorType) query.set('errorType', params.errorType);
  if (params.limit) query.set('limit', params.limit);
  const url = query.toString() ? `/project-analytics/recent-failures?${query.toString()}` : '/project-analytics/recent-failures';
  const response = await api.get(url);
  return response.data;
};

// Supplementary Analytics APIs
export const getAnalyticsRankings = async () => {
  const response = await api.get('/project-analytics/rankings');
  return response.data;
};

export const getAnalyticsIncidents = async () => {
  const response = await api.get('/project-analytics/incidents');
  return response.data;
};

export const getAnalyticsJourneys = async () => {
  return [];
};

export const getAnalyticsServices = async () => {
  const response = await api.get('/project-analytics/services');
  return response.data;
};



// Monitoring Coverage API
export const getMonitoringCoverage = async (projectId) => {
  const url = projectId ? `/project-analytics/monitoring-coverage?projectId=${projectId}` : '/project-analytics/monitoring-coverage';
  const response = await api.get(url);
  return response.data;
};

// Metrics Readiness API
export const getMetricsReadiness = async (projectId) => {
  const url = projectId ? `/project-analytics/metrics-readiness?projectId=${projectId}` : '/project-analytics/metrics-readiness';
  const response = await api.get(url);
  return response.data;
};

// Performance Analytics API
export const getPerformanceAnalytics = async (projectId) => {
  const url = projectId ? `/project-analytics/performance?projectId=${projectId}` : '/project-analytics/performance';
  const response = await api.get(url);
  return response.data;
};

// Health Explanation API
export const getHealthExplanation = async (projectId) => {
  const url = projectId ? `/project-analytics/health-explanation?projectId=${projectId}` : '/project-analytics/health-explanation';
  const response = await api.get(url);
  return response.data;
};

// Endpoint Analytics API
export const getEndpointAnalytics = async (projectId) => {
  const url = projectId ? `/project-analytics/endpoints/${projectId}` : '/project-analytics/endpoints';
  const response = await api.get(url);
  return response.data;
};
