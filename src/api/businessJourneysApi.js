import api from './axios';

export const mockBusinessJourneysList = [
  {
    id: 'j1',
    name: 'Checkout & Payment Funnel',
    healthScore: 82,
    status: 'Warning',
    impactedUsers: 12643,
    revenueImpact: 248000,
    stepsCount: 4,
    description: 'Cart Validation → Order Creation → Payment Tokenization → Order Dispatch',
    affectedServices: ['Checkout API', 'Order Service', 'Payment Gateway Adapter'],
    dependencies: ['Redis Session Cache', 'PostgreSQL DB Cluster', 'Stripe Gateway'],
    currentIncidents: [
      { id: 'INC-101', title: 'Checkout API Latency Spike (>850ms)', severity: 'Critical', status: 'Active' },
      { id: 'INC-102', title: 'Stripe Payment Adapter Token Timeout', severity: 'High', status: 'Investigating' }
    ]
  },
  {
    id: 'j2',
    name: 'User Sign-up & Onboarding',
    healthScore: 98,
    status: 'Healthy',
    impactedUsers: 450,
    revenueImpact: 0,
    stepsCount: 3,
    description: 'Registration Form → Email Verification → OAuth JWT Token Issue',
    affectedServices: ['User Auth Microservice', 'Email Dispatch Worker'],
    dependencies: ['LDAP Active Directory', 'Redis Cache'],
    currentIncidents: []
  },
  {
    id: 'j3',
    name: 'Inventory Stock Reservation',
    healthScore: 76,
    status: 'Warning',
    impactedUsers: 5800,
    revenueImpact: 112000,
    stepsCount: 3,
    description: 'Stock Reservation Request → Warehouse Allocation → Catalog Inventory Decrement',
    affectedServices: ['Inventory API', 'Warehouse Sync Worker'],
    dependencies: ['MongoDB Stock Database', 'Kafka Message Bus'],
    currentIncidents: [
      { id: 'INC-201', title: 'Warehouse Stock Sync Webhook Delay', severity: 'Medium', status: 'Monitoring' }
    ]
  },
  {
    id: 'j4',
    name: 'Order Dispatch Pipeline',
    healthScore: 94,
    status: 'Healthy',
    impactedUsers: 1200,
    revenueImpact: 45000,
    stepsCount: 4,
    description: 'Fulfillment Order Queue → Label Generation → Carrier Notification → Dispatch',
    affectedServices: ['Order Service', 'Logistics Adapter'],
    dependencies: ['FedEx API', 'PostgreSQL DB'],
    currentIncidents: []
  }
];

export const getBusinessJourneys = async () => {
  try {
    const response = await api.get('/business-journeys');
    return response.data;
  } catch (error) {
    return mockBusinessJourneysList;
  }
};

export const getBusinessJourneyById = async (id) => {
  try {
    const response = await api.get(`/business-journeys/${id}`);
    return response.data;
  } catch (error) {
    return mockBusinessJourneysList.find((j) => j.id === id) || mockBusinessJourneysList[0];
  }
};
