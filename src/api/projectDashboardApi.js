import api from './axios';
import { initialWorkspaceData } from './workspaceApi';

export const projectDashboardMap = {
  'proj-1': {
    projectId: 'proj-1',
    projectName: 'Checkout Platform',
    systemHealthScore: 82,
    businessHealthScore: 88,
    healthyServicesCount: '6/8 Services Operational',
    activeIncidentsCount: 2,
    revenueAtRisk: 145000,
    usersImpacted: 12643,
    aiSummary: {
      title: 'Checkout API Latency & Payment Gateway Timeout',
      description: 'Elevated p99 latency (>850ms) detected in Checkout Service microservice cluster following Stripe OAuth endpoint degradation.',
      impact: 'High Impact on Checkout Flow Funnel',
      revenueImpact: '$145,000 estimated risk per hour',
      userImpact: '12,643 active checkout sessions delayed'
    },
    services: [
      { id: 's1', name: 'Checkout Service API', health: 78, status: 'Warning', criticality: 'High', stack: 'Go / Node' },
      { id: 's2', name: 'Order Management Service', health: 94, status: 'Healthy', criticality: 'High', stack: 'Java Spring' },
      { id: 's3', name: 'Stripe Payment Adapter', health: 62, status: 'Critical', criticality: 'High', stack: 'Python FastAPI' },
      { id: 's4', name: 'User Authentication Engine', health: 98, status: 'Healthy', criticality: 'Medium', stack: 'Go' },
      { id: 's5', name: 'Inventory Stock Reservation', health: 85, status: 'Warning', criticality: 'Medium', stack: 'Node.js' },
      { id: 's6', name: 'Notification Worker Queue', health: 99, status: 'Healthy', criticality: 'Low', stack: 'Python Celery' }
    ],
    recentIncidents: [
      { id: 'INC-101', title: 'Checkout API Latency Spike (>850ms)', severity: 'Critical', status: 'Active', createdTime: '14 mins ago', service: 'Checkout API' },
      { id: 'INC-102', title: 'Stripe Payment Adapter Token Timeout', severity: 'High', status: 'Investigating', createdTime: '45 mins ago', service: 'Payment Adapter' }
    ],
    dependencyGraph: {
      nodes: [
        { id: 'checkout', label: 'Checkout Service', type: 'service', health: 78 },
        { id: 'order', label: 'Order Service', type: 'service', health: 94 },
        { id: 'payment', label: 'Payment Adapter', type: 'service', health: 62 },
        { id: 'user', label: 'User Auth Engine', type: 'service', health: 98 },
        { id: 'postgres', label: 'PostgreSQL Primary DB', type: 'database', health: 99 },
        { id: 'redis', label: 'Redis Session Cache', type: 'cache', health: 97 }
      ],
      edges: [
        { source: 'checkout', target: 'user', label: 'OAuth Validate' },
        { source: 'checkout', target: 'order', label: 'gRPC Create Order' },
        { source: 'order', target: 'payment', label: 'REST Charge Token' },
        { source: 'order', target: 'postgres', label: 'SQL Write' },
        { source: 'user', target: 'redis', label: 'Cache Lookup' }
      ]
    },
    businessJourneys: [
      { id: 'j1', name: 'Checkout & Payment Funnel', health: 82, impactedUsers: 12643, revenueImpact: 145000, status: 'Warning' },
      { id: 'j2', name: 'Order Placement To Cash', health: 94, impactedUsers: 1200, revenueImpact: 15000, status: 'Healthy' }
    ]
  },
  'proj-2': {
    projectId: 'proj-2',
    projectName: 'Order Management System',
    systemHealthScore: 94,
    businessHealthScore: 96,
    healthyServicesCount: '8/8 Services Operational',
    activeIncidentsCount: 0,
    revenueAtRisk: 0,
    usersImpacted: 0,
    aiSummary: {
      title: 'Order Processing Pipeline Fully Operational',
      description: 'All 8 fulfillment microservices, message queues, and carrier webhooks are operating well within response SLAs (<45ms).',
      impact: 'Zero System Friction',
      revenueImpact: '$0 risk',
      userImpact: '0 users affected'
    },
    services: [
      { id: 's21', name: 'Order Creation API', health: 96, status: 'Healthy', criticality: 'High', stack: 'Java Spring' },
      { id: 's22', name: 'Fulfillment Routing Engine', health: 95, status: 'Healthy', criticality: 'High', stack: 'Go' },
      { id: 's23', name: 'Invoice Generator Service', health: 92, status: 'Healthy', criticality: 'Medium', stack: 'Node.js' },
      { id: 's24', name: 'Carrier Webhook Dispatcher', health: 93, status: 'Healthy', criticality: 'Medium', stack: 'Python' }
    ],
    recentIncidents: [],
    dependencyGraph: {
      nodes: [
        { id: 'order_api', label: 'Order Creation API', type: 'service', health: 96 },
        { id: 'fulfillment', label: 'Fulfillment Engine', type: 'service', health: 95 },
        { id: 'db', label: 'Order DB Cluster', type: 'database', health: 99 }
      ],
      edges: [
        { source: 'order_api', target: 'fulfillment', label: 'Process Order' },
        { source: 'fulfillment', target: 'db', label: 'Persist Shipment' }
      ]
    },
    businessJourneys: [
      { id: 'j21', name: 'Order Dispatch Pipeline', health: 94, impactedUsers: 0, revenueImpact: 0, status: 'Healthy' }
    ]
  },
  'proj-3': {
    projectId: 'proj-3',
    projectName: 'Inventory & Stock Platform',
    systemHealthScore: 76,
    businessHealthScore: 80,
    healthyServicesCount: '4/5 Services Operational',
    activeIncidentsCount: 1,
    revenueAtRisk: 112000,
    usersImpacted: 5800,
    aiSummary: {
      title: 'Warehouse Stock Sync Webhook Delay',
      description: 'Asynchronous catalog sync queue latency increased to 4.2 minutes due to MongoDB stock locking during bulk import.',
      impact: 'Stock Allocation Delay',
      revenueImpact: '$112,000 stock reservation risk',
      userImpact: '5,800 active cart updates impacted'
    },
    services: [
      { id: 's31', name: 'Inventory API', health: 76, status: 'Warning', criticality: 'High', stack: 'Node.js' },
      { id: 's32', name: 'Warehouse Sync Worker', health: 70, status: 'Warning', criticality: 'High', stack: 'Go' },
      { id: 's33', name: 'Catalog Decrement Adapter', health: 92, status: 'Healthy', criticality: 'Medium', stack: 'Python' }
    ],
    recentIncidents: [
      { id: 'INC-201', title: 'Warehouse Stock Sync Webhook Delay', severity: 'Medium', status: 'Monitoring', createdTime: '1 hour ago', service: 'Stock Sync Service' }
    ],
    dependencyGraph: {
      nodes: [
        { id: 'inv', label: 'Inventory API', type: 'service', health: 76 },
        { id: 'sync', label: 'Warehouse Sync Worker', type: 'service', health: 70 },
        { id: 'mongo', label: 'Stock MongoDB', type: 'database', health: 85 }
      ],
      edges: [
        { source: 'inv', target: 'sync', label: 'Enqueue Stock Change' },
        { source: 'sync', target: 'mongo', label: 'Update Catalog' }
      ]
    },
    businessJourneys: [
      { id: 'j31', name: 'Inventory Stock Reservation', health: 76, impactedUsers: 5800, revenueImpact: 112000, status: 'Warning' }
    ]
  },
  'proj-4': {
    projectId: 'proj-4',
    projectName: 'Payment Gateway Adapter',
    systemHealthScore: 98,
    businessHealthScore: 99,
    healthyServicesCount: '4/4 Services Operational',
    activeIncidentsCount: 0,
    revenueAtRisk: 0,
    usersImpacted: 0,
    aiSummary: {
      title: 'Multi-Provider Payment Clearing Healthy',
      description: 'Stripe, PayPal, Apple Pay, and credit card tokenization adapters operating at 99.98% success rate with avg 32ms latency.',
      impact: 'Optimal Transaction Processing',
      revenueImpact: '$0 risk',
      userImpact: '0 users impacted'
    },
    services: [
      { id: 's41', name: 'Stripe Gateway Adapter', health: 99, status: 'Healthy', criticality: 'High', stack: 'Go' },
      { id: 's42', name: 'PayPal Adapter', health: 98, status: 'Healthy', criticality: 'High', stack: 'Node.js' },
      { id: 's43', name: 'Apple Pay Tokenizer', health: 97, status: 'Healthy', criticality: 'Medium', stack: 'Python' }
    ],
    recentIncidents: [],
    dependencyGraph: {
      nodes: [
        { id: 'pay_router', label: 'Payment Router', type: 'service', health: 99 },
        { id: 'stripe', label: 'Stripe API', type: 'external', health: 99 },
        { id: 'paypal', label: 'PayPal API', type: 'external', health: 98 }
      ],
      edges: [
        { source: 'pay_router', target: 'stripe', label: 'Tokenize Card' },
        { source: 'pay_router', target: 'paypal', label: 'Authorize Charge' }
      ]
    },
    businessJourneys: [
      { id: 'j41', name: 'Payment Tokenization & Settlement', health: 98, impactedUsers: 0, revenueImpact: 0, status: 'Healthy' }
    ]
  },
  'proj-5': {
    projectId: 'proj-5',
    projectName: 'User Identity & Auth Engine',
    systemHealthScore: 65,
    businessHealthScore: 70,
    healthyServicesCount: '1/3 Services Operational',
    activeIncidentsCount: 2,
    revenueAtRisk: 185000,
    usersImpacted: 11500,
    aiSummary: {
      title: 'OAuth2 Refresh Token Expire Loop & LDAP Timeout',
      description: 'Critical authentication failure in JWT Token Issuing microservice causing login loops for enterprise Active Directory SSO accounts.',
      impact: 'Critical Authentication Lockout',
      revenueImpact: '$185,000 enterprise risk',
      userImpact: '11,500 users experiencing authentication friction'
    },
    services: [
      { id: 's51', name: 'OAuth2 Token Issuer', health: 58, status: 'Critical', criticality: 'High', stack: 'Go' },
      { id: 's52', name: 'LDAP AD Connector', health: 62, status: 'Critical', criticality: 'High', stack: 'Java' },
      { id: 's53', name: 'Session Token Cache', health: 95, status: 'Healthy', criticality: 'Medium', stack: 'Redis' }
    ],
    recentIncidents: [
      { id: 'INC-301', title: 'OAuth2 Refresh Token Expire Loop', severity: 'Critical', status: 'Active', createdTime: '20 mins ago', service: 'Auth Microservice' },
      { id: 'INC-302', title: 'LDAP Active Directory Connector Timeout', severity: 'High', status: 'Investigating', createdTime: '50 mins ago', service: 'LDAP Connector' }
    ],
    dependencyGraph: {
      nodes: [
        { id: 'auth', label: 'OAuth2 Token Issuer', type: 'service', health: 58 },
        { id: 'ldap', label: 'LDAP AD Connector', type: 'service', health: 62 },
        { id: 'redis', label: 'Redis Session Cache', type: 'cache', health: 95 }
      ],
      edges: [
        { source: 'auth', target: 'ldap', label: 'Verify Credentials' },
        { source: 'auth', target: 'redis', label: 'Cache JWT Token' }
      ]
    },
    businessJourneys: [
      { id: 'j51', name: 'User Sign-up & SSO Authentication', health: 65, impactedUsers: 11500, revenueImpact: 185000, status: 'Critical' }
    ]
  },
  'proj-6': {
    projectId: 'proj-6',
    projectName: 'Real-time Analytics Pipeline',
    systemHealthScore: 91,
    businessHealthScore: 93,
    healthyServicesCount: '9/9 Services Operational',
    activeIncidentsCount: 0,
    revenueAtRisk: 0,
    usersImpacted: 0,
    aiSummary: {
      title: 'Kafka Event Streaming & Clickstream Ingestion Healthy',
      description: 'Real-time clickstream ingestion, metrics aggregations, and executive dashboard telemetry flowing at 42,000 events/sec.',
      impact: 'Optimal Telemetry Flow',
      revenueImpact: '$0 risk',
      userImpact: '0 users impacted'
    },
    services: [
      { id: 's61', name: 'Clickstream Ingestion API', health: 92, status: 'Healthy', criticality: 'High', stack: 'Go' },
      { id: 's62', name: 'Kafka Event Buffer', health: 94, status: 'Healthy', criticality: 'High', stack: 'Java' },
      { id: 's63', name: 'Metrics Aggregator Worker', health: 89, status: 'Healthy', criticality: 'Medium', stack: 'Python' }
    ],
    recentIncidents: [],
    dependencyGraph: {
      nodes: [
        { id: 'ingest', label: 'Clickstream API', type: 'service', health: 92 },
        { id: 'kafka', label: 'Kafka Event Bus', type: 'queue', health: 94 },
        { id: 'metrics', label: 'Metrics Aggregator', type: 'service', health: 89 }
      ],
      edges: [
        { source: 'ingest', target: 'kafka', label: 'Produce Event' },
        { source: 'kafka', target: 'metrics', label: 'Consume Telemetry' }
      ]
    },
    businessJourneys: [
      { id: 'j61', name: 'Executive Telemetry & BI Ingestion', health: 91, impactedUsers: 0, revenueImpact: 0, status: 'Healthy' }
    ]
  }
};

export const getProjectDashboard = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/dashboard`);
    return response.data;
  } catch (error) {
    console.warn(`Backend GET /api/projects/${projectId}/dashboard fallback, returning project telemetry context.`, error);
    
    // Check direct map or fallback to match by name/id
    if (projectDashboardMap[projectId]) {
      return projectDashboardMap[projectId];
    }

    const matchedProject = initialWorkspaceData.projects.find((p) => p.id === projectId || p._id === projectId);
    if (matchedProject) {
      return {
        projectId: matchedProject.id || projectId,
        projectName: matchedProject.name,
        systemHealthScore: matchedProject.health,
        businessHealthScore: matchedProject.health + 4 > 100 ? 100 : matchedProject.health + 4,
        healthyServicesCount: `${matchedProject.servicesCount || 6} Services Operational`,
        activeIncidentsCount: matchedProject.incidentsCount ?? (matchedProject.incidents?.length || 0),
        revenueAtRisk: matchedProject.health < 80 ? 120000 : 0,
        usersImpacted: matchedProject.health < 80 ? 4500 : 0,
        aiSummary: {
          title: `${matchedProject.name} Operational Summary`,
          description: `Live telemetry and health tracking for ${matchedProject.name} (${matchedProject.category || 'Platform'}).`,
          impact: matchedProject.health >= 90 ? 'Operational Efficiency' : 'Active System Monitoring',
          revenueImpact: matchedProject.health < 80 ? '$120,000 risk' : '$0 risk',
          userImpact: matchedProject.health < 80 ? '4,500 active users monitored' : 'Zero friction'
        },
        services: [
          { id: 's1', name: `${matchedProject.name} Primary API`, health: matchedProject.health, status: matchedProject.status, criticality: 'High', stack: 'Go / Node' },
          { id: 's2', name: `${matchedProject.name} Worker Queue`, health: 95, status: 'Healthy', criticality: 'Medium', stack: 'Python' }
        ],
        recentIncidents: matchedProject.incidents || [],
        dependencyGraph: {
          nodes: [
            { id: 'n1', label: matchedProject.name, type: 'service', health: matchedProject.health },
            { id: 'n2', label: 'Primary PostgreSQL DB', type: 'database', health: 98 }
          ],
          edges: [
            { source: 'n1', target: 'n2', label: 'SQL Persist' }
          ]
        },
        businessJourneys: [
          { id: 'j1', name: `${matchedProject.name} Main Funnel`, health: matchedProject.health, impactedUsers: 4500, revenueImpact: 0, status: matchedProject.status }
        ]
      };
    }

    return {
      ...projectDashboardMap['proj-1'],
      projectId: projectId || 'proj-1'
    };
  }
};
