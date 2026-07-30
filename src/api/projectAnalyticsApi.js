import api from './axios';

export const mockAnalyticsData = {
  overview: {
    orgHealthScore: 89,
    activeProjects: 15,
    healthyProjects: 10,
    criticalProjects: 2,
    totalServices: 35,
    activeIncidents: 5,
    totalRevenueAtRisk: 450000,
    totalImpactedUsers: 24500
  },
  rankings: [
    { rank: 1, name: 'Payment Gateway Adapter', health: 98, status: 'Healthy', criticality: 'High' },
    { rank: 2, name: 'Order Management System', health: 94, status: 'Healthy', criticality: 'High' },
    { rank: 3, name: 'Real-time Analytics Pipeline', health: 91, status: 'Healthy', criticality: 'Medium' },
    { rank: 4, name: 'Checkout Platform', health: 82, status: 'Warning', criticality: 'High' },
    { rank: 5, name: 'Inventory & Stock Platform', health: 76, status: 'Warning', criticality: 'Medium' },
    { rank: 6, name: 'User Identity & Auth Engine', health: 65, status: 'Critical', criticality: 'High' }
  ],
  incidents: {
    totalIncidents: 5,
    criticalCount: 2,
    highCount: 2,
    mediumCount: 1,
    trend: [
      { time: '00:00', count: 2 },
      { time: '04:00', count: 1 },
      { time: '08:00', count: 4 },
      { time: '12:00', count: 5 },
      { time: '16:00', count: 3 },
      { time: '20:00', count: 5 }
    ]
  },
  businessJourneys: [
    { name: 'Checkout & Payment Funnel', health: 82, impactedUsers: 12643, revenueImpact: 248000, status: 'Warning' },
    { name: 'User Sign-up & Onboarding', health: 98, impactedUsers: 450, revenueImpact: 0, status: 'Healthy' },
    { name: 'Inventory Stock Reservation', health: 76, impactedUsers: 5800, revenueImpact: 112000, status: 'Warning' },
    { name: 'Order Dispatch Pipeline', health: 94, impactedUsers: 1200, revenueImpact: 45000, status: 'Healthy' }
  ],
  services: {
    totalServices: 35,
    healthyServices: 28,
    degradedServices: 5,
    criticalServices: 2,
    availabilitySLA: '99.92%'
  },
  risk: {
    revenueAtRisk: 450000,
    impactedUsers: 24500,
    projectsAtRisk: [
      { id: 'proj-5', name: 'User Identity & Auth Engine', health: 65, riskAmount: 185000, reason: 'OAuth Token Expire Loop' },
      { id: 'proj-1', name: 'Checkout Platform', health: 82, riskAmount: 145000, reason: 'Payment Adapter Latency Spike' },
      { id: 'proj-3', name: 'Inventory & Stock Platform', health: 76, riskAmount: 120000, reason: 'Stock Sync Webhook Delay' }
    ]
  }
};

export const getAnalyticsOverview = async () => {
  try {
    const response = await api.get('/project-analytics/overview');
    return response.data;
  } catch (error) {
    return mockAnalyticsData.overview;
  }
};

export const getAnalyticsRankings = async () => {
  try {
    const response = await api.get('/project-analytics/rankings');
    return response.data;
  } catch (error) {
    return mockAnalyticsData.rankings;
  }
};

export const getAnalyticsIncidents = async () => {
  try {
    const response = await api.get('/project-analytics/incidents');
    return response.data;
  } catch (error) {
    return mockAnalyticsData.incidents;
  }
};

export const getAnalyticsJourneys = async () => {
  try {
    const response = await api.get('/project-analytics/business-journeys');
    return response.data;
  } catch (error) {
    return mockAnalyticsData.businessJourneys;
  }
};

export const getAnalyticsServices = async () => {
  try {
    const response = await api.get('/project-analytics/services');
    return response.data;
  } catch (error) {
    return mockAnalyticsData.services;
  }
};

export const getAnalyticsRisk = async () => {
  try {
    const response = await api.get('/project-analytics/risk');
    return response.data;
  } catch (error) {
    return mockAnalyticsData.risk;
  }
};
