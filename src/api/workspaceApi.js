import api from './axios';

export const initialWorkspaceData = {
  projectCount: 6,
  activeProjects: 6,
  healthyProjects: 3,
  criticalProjects: 1,
  activeIncidents: 5,
  revenueAtRisk: 450000,
  impactedUsers: 24500,
  projects: [
    {
      id: 'proj-1',
      name: 'Checkout Platform',
      health: 82,
      incidentsCount: 2,
      status: 'Warning',
      category: 'Core E-Commerce',
      owner: 'Checkout & Payments Team',
      servicesCount: 6,
      lastDeployment: '12 mins ago',
      description: 'Handles customer shopping cart checkout, payment tokenization, and transaction finalization.',
      incidents: [
        {
          id: 'INC-101',
          title: 'Checkout API Latency Spike (>850ms)',
          severity: 'Critical',
          severityStyle: 'bg-red-500/20 text-red-400 border-red-500/40',
          users: '12,643 users',
          time: '14 mins ago',
          status: 'Active',
          statusDot: 'bg-red-500 animate-ping',
          statusText: 'text-red-400',
          service: 'Checkout API Microservice'
        },
        {
          id: 'INC-102',
          title: 'Stripe Payment Adapter Token Timeout',
          severity: 'High',
          severityStyle: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          users: '4,210 users',
          time: '45 mins ago',
          status: 'Investigating',
          statusDot: 'bg-orange-400',
          statusText: 'text-orange-400',
          service: 'Payment Adapter'
        }
      ]
    },
    {
      id: 'proj-2',
      name: 'Order Management System',
      health: 94,
      incidentsCount: 0,
      status: 'Healthy',
      category: 'Fulfillment Operations',
      owner: 'Logistics Tech',
      servicesCount: 8,
      lastDeployment: '2 hours ago',
      description: 'Order routing, shipment status tracking, fulfillment workflows and invoice generation.',
      incidents: []
    },
    {
      id: 'proj-3',
      name: 'Inventory & Stock Platform',
      health: 76,
      incidentsCount: 1,
      status: 'Warning',
      category: 'Supply Chain',
      owner: 'Warehouse Engineering',
      servicesCount: 5,
      lastDeployment: '1 day ago',
      description: 'Real-time multi-warehouse stock reservation, replenishment alerts and catalog sync.',
      incidents: [
        {
          id: 'INC-201',
          title: 'Warehouse Stock Sync Webhook Delay',
          severity: 'Medium',
          severityStyle: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          users: '1,890 users',
          time: '1 hour ago',
          status: 'Monitoring',
          statusDot: 'bg-amber-400',
          statusText: 'text-amber-400',
          service: 'Stock Sync Service'
        }
      ]
    },
    {
      id: 'proj-4',
      name: 'Payment Gateway Adapter',
      health: 98,
      incidentsCount: 0,
      status: 'Healthy',
      category: 'Fintech Billing',
      owner: 'Security & Billing Team',
      servicesCount: 4,
      lastDeployment: '3 hours ago',
      description: 'Multi-provider payment routing for Stripe, PayPal, Apple Pay and credit card clearing.',
      incidents: []
    },
    {
      id: 'proj-5',
      name: 'User Identity & Auth Engine',
      health: 65,
      incidentsCount: 2,
      status: 'Critical',
      category: 'Security & IAM',
      owner: 'Platform Security Team',
      servicesCount: 3,
      lastDeployment: '45 mins ago',
      description: 'OAuth2, OpenID Connect, single sign-on (SSO), and JWT token issuing cluster.',
      incidents: [
        {
          id: 'INC-301',
          title: 'OAuth2 Refresh Token Expire Loop',
          severity: 'Critical',
          severityStyle: 'bg-red-500/20 text-red-400 border-red-500/40',
          users: '8,400 users',
          time: '20 mins ago',
          status: 'Active',
          statusDot: 'bg-red-500 animate-ping',
          statusText: 'text-red-400',
          service: 'Auth Microservice'
        },
        {
          id: 'INC-302',
          title: 'LDAP Active Directory Connector Timeout',
          severity: 'High',
          severityStyle: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          users: '3,100 users',
          time: '50 mins ago',
          status: 'Investigating',
          statusDot: 'bg-orange-400',
          statusText: 'text-orange-400',
          service: 'LDAP Connector'
        }
      ]
    },
    {
      id: 'proj-6',
      name: 'Real-time Analytics Pipeline',
      health: 91,
      incidentsCount: 0,
      status: 'Healthy',
      category: 'Data Engineering',
      owner: 'DataOps & BI Team',
      servicesCount: 9,
      lastDeployment: '5 hours ago',
      description: 'Kafka event streaming, clickstream aggregations and executive metrics dashboard telemetry.',
      incidents: []
    }
  ]
};

export const getWorkspaceDashboard = async () => {
  try {
    const response = await api.get('/workspace/dashboard');
    return response.data;
  } catch (error) {
    console.warn('Backend endpoint /api/workspace/dashboard unavailable, utilizing workspace telemetry data.', error);
    return initialWorkspaceData;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.warn('Backend endpoint /api/projects unavailable, saving locally in frontend state.', error);
    return {
      id: `proj-${Date.now()}`,
      ...projectData,
      createdAt: new Date().toISOString(),
      incidents: []
    };
  }
};
