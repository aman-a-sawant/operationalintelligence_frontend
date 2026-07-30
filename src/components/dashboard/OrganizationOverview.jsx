import React, { useState } from 'react';
import { 
  FolderKanban, 
  Server, 
  Users, 
  GitMerge, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

export default function OrganizationOverview({ metrics }) {
  const [activeTab, setActiveTab] = useState('Projects');

  const {
    projectCount = 15,
    healthyProjects = 10,
    criticalProjects = 2,
    activeIncidents = 5,
    impactedUsers = 24500
  } = metrics || {};

  const overviewSections = [
    {
      id: 'Projects',
      title: 'Projects Overview',
      icon: FolderKanban,
      count: `${projectCount} Active`,
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      details: [
        { label: 'Total Managed Projects', value: projectCount, color: 'text-white' },
        { label: 'Healthy & Operational', value: healthyProjects, color: 'text-emerald-400' },
        { label: 'Warning / Degraded', value: projectCount - healthyProjects - criticalProjects, color: 'text-amber-400' },
        { label: 'Critical Attention Required', value: criticalProjects, color: 'text-rose-400' },
      ],
      description: 'Comprehensive management of all platform initiatives, business logic modules and product APIs.'
    },
    {
      id: 'Services',
      title: 'Services & APIs',
      icon: Server,
      count: '35 Microservices',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      details: [
        { label: 'Active Microservices', value: '35', color: 'text-white' },
        { label: 'Healthy Status', value: '28 / 35', color: 'text-emerald-400' },
        { label: 'Average Response Time', value: '42ms', color: 'text-blue-400' },
        { label: 'Global Uptime SLA', value: '99.94%', color: 'text-emerald-400' },
      ],
      description: 'Distributed microservices fleet with real-time health checks, gRPC/REST telemetry, and circuit breaker status.'
    },
    {
      id: 'Users',
      title: 'User Analytics & Impact',
      icon: Users,
      count: '1.4M Daily Users',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      details: [
        { label: 'Total Active Users', value: '1,420,000', color: 'text-white' },
        { label: 'Users Impacted by Degraded Services', value: impactedUsers.toLocaleString(), color: 'text-rose-400' },
        { label: 'Active User Satisfaction Index', value: '94.2%', color: 'text-emerald-400' },
        { label: 'Peak Concurrency', value: '184,200', color: 'text-purple-400' },
      ],
      description: 'User-centric operational monitoring tracking customer experience and real-time incident friction.'
    },
    {
      id: 'Business Journeys',
      title: 'Business Journeys',
      icon: GitMerge,
      count: '8 Active Funnels',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      details: [
        { label: 'Checkout & Payment Funnel', value: '92.4% Health', color: 'text-amber-400' },
        { label: 'User Sign-up & Onboarding', value: '98.8% Health', color: 'text-emerald-400' },
        { label: 'Inventory Stock Reservation', value: '88.1% Health', color: 'text-amber-400' },
        { label: 'Order Dispatch Pipeline', value: '99.2% Health', color: 'text-emerald-400' },
      ],
      description: 'End-to-end multi-step transaction funnel health and conversion rate impact analysis.'
    },
    {
      id: 'Infrastructure',
      title: 'Infrastructure & Cloud',
      icon: Cpu,
      count: '12 Clusters • 140 Nodes',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      details: [
        { label: 'Kubernetes Clusters', value: '12 Active', color: 'text-white' },
        { label: 'Worker Nodes Fleet', value: '140 Nodes', color: 'text-indigo-400' },
        { label: 'CPU Fleet Utilization', value: '64.2%', color: 'text-emerald-400' },
        { label: 'Memory Allocation', value: '71.8%', color: 'text-blue-400' },
      ],
      description: 'Multi-region AWS & GCP cloud cluster health, pod status, auto-scaling metrics, and node load balances.'
    }
  ];

  const currentSection = overviewSections.find((s) => s.id === activeTab) || overviewSections[0];

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Organization Overview</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
              Live Observability
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Holistic view across projects, microservices, business journeys, users and infrastructure assets
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {overviewSections.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-purple-600/20 border border-purple-500/50 text-white shadow-md shadow-purple-500/10'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{sec.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Overview Section Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${currentSection.badgeColor} shadow-md`}>
              <currentSection.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{currentSection.title}</h3>
              <p className="text-xs text-slate-400 font-medium">{currentSection.description}</p>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {currentSection.details.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {item.label}
                </span>
                <span className={`text-base md:text-lg font-extrabold tracking-tight ${item.color}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Telemetry Summary Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-purple-950/20 border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              System Distribution
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Optimal
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Overall Infrastructure Load</span>
              <span className="text-purple-400 font-bold">68%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full w-[68%]" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Multi-Region Active
            </span>
            <span className="flex items-center gap-1 text-purple-300">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              Live Sync
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
