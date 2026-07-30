import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import AICopilotDrawer from '../../components/dashboard/AICopilotDrawer';
import IncidentModal from '../../components/dashboard/IncidentModal';
import { getProjectDashboard } from '../../api/projectDashboardApi';
import { 
  Activity, 
  AlertTriangle, 
  Server, 
  DollarSign, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  GitMerge, 
  ShieldAlert,
  Database,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';

export default function ProjectDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getProjectDashboard(projectId).then((data) => {
      if (isMounted) {
        setProjectData(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [projectId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRefresh = async () => {
    setLoading(true);
    const data = await getProjectDashboard(projectId);
    setProjectData(data);
    setLoading(false);
    showToast("Project telemetry data refreshed!");
  };

  if (loading || !projectData) {
    return (
      <div className="min-h-screen bg-[#050B1F] text-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-purple-400">
          <Sparkles className="w-6 h-6 animate-spin" />
          <span className="text-sm font-semibold">Loading Project Telemetry Dashboard...</span>
        </div>
      </div>
    );
  }

  const {
    projectName,
    systemHealthScore,
    businessHealthScore,
    healthyServicesCount,
    activeIncidentsCount,
    revenueAtRisk,
    usersImpacted,
    aiSummary,
    services = [],
    recentIncidents = [],
    dependencyGraph = { nodes: [], edges: [] },
    businessJourneys = []
  } = projectData;

  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-100 flex relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-purple-200 text-xs md:text-sm font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab="Project Dashboard"
        onOpenCopilot={() => setIsCopilotOpen(true)}
        context="project"
        selectedProject={{ name: projectName }}
        onBackToOrganization={() => navigate('/dashboard?view=organization')}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        
        {/* Top Header */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onRefresh={handleRefresh}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          dashboardView="project"
          selectedProject={{ name: projectName }}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto w-full">
          
          {/* Top Breadcrumb Context Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard?view=organization')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-semibold hover:border-purple-500/40 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-purple-400" />
                <span>Workspace Dashboard</span>
              </button>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-extrabold text-white">{projectName}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                System Health: {systemHealthScore}%
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Business Health: {businessHealthScore}%
              </span>
            </div>
          </div>

          {/* SECTION 1: 6 HEALTH CARDS */}
          <section aria-label="Project Health Metrics Cards" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. System Health Score */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>System Health</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">{systemHealthScore}/100</div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${systemHealthScore}%` }} />
              </div>
            </div>

            {/* 2. Business Health Score */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>Business Health</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-purple-300">{businessHealthScore}/100</div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${businessHealthScore}%` }} />
              </div>
            </div>

            {/* 3. Healthy Services */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>Healthy Services</span>
                <Server className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-lg font-extrabold text-white line-clamp-1">{healthyServicesCount}</div>
              <p className="text-[11px] text-blue-400 font-medium">85% Fleet Operational</p>
            </div>

            {/* 4. Active Incidents */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-rose-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>Active Incidents</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-extrabold text-rose-400">{activeIncidentsCount} Active</div>
              <p className="text-[11px] text-rose-400 font-medium">Requires Action</p>
            </div>

            {/* 5. Revenue At Risk */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>Revenue At Risk</span>
                <DollarSign className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-purple-300">${(revenueAtRisk / 1000).toFixed(0)}K</div>
              <p className="text-[11px] text-purple-400 font-medium">Estimated Risk</p>
            </div>

            {/* 6. Users Impacted */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-orange-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>Users Impacted</span>
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-extrabold text-orange-400">{usersImpacted.toLocaleString()}</div>
              <p className="text-[11px] text-orange-400 font-medium">Active Friction</p>
            </div>
          </section>

          {/* SECTION 2: AI SUMMARY SECTION (Backend-Generated) */}
          <section aria-label="Backend AI Summary" className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-slate-900 to-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>AI Operational Root-Cause Summary</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                BACKEND SYNTHESIS
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{aiSummary.title}</h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{aiSummary.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">System Impact</span>
                <span className="font-bold text-rose-400">{aiSummary.impact}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Revenue Impact</span>
                <span className="font-bold text-purple-300">{aiSummary.revenueImpact}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">User Impact</span>
                <span className="font-bold text-orange-400">{aiSummary.userImpact}</span>
              </div>
            </div>
          </section>

          {/* SECTION 3 & 4: SERVICE HEALTH OVERVIEW & RECENT INCIDENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Health Overview */}
            <section aria-label="Service Health Overview" className="glass-panel p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span>Service Health Overview</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">{services.length} Services</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((srv) => (
                  <div key={srv.id} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white line-clamp-1">{srv.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        srv.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        srv.status === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {srv.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Health: <strong className="text-white">{srv.health}%</strong></span>
                      <span className="text-purple-300 text-[10px] font-semibold">{srv.criticality} Criticality</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Incidents */}
            <section aria-label="Recent Incidents" className="glass-panel p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Recent Incidents</span>
                </h3>
                <span className="text-xs font-semibold text-rose-400">{recentIncidents.length} Active</span>
              </div>

              <div className="space-y-3">
                {recentIncidents.map((inc) => (
                  <div key={inc.id} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {inc.id}
                        </span>
                        <h4 className="text-xs font-bold text-white">{inc.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inc.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {inc.severity}
                        </span>
                        <span>{inc.createdTime}</span>
                        <span>{inc.service}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SECTION 5: DEPENDENCY GRAPH (Nodes & Edges Topology) */}
          <section aria-label="Dependency Topology Graph" className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-purple-400" />
                <span>Backend Service & Resource Topology Graph</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Live Graph
              </span>
            </div>

            {/* Topology Graph Visual Box */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex flex-col md:flex-row items-center justify-around gap-4 min-h-[160px]">
              {dependencyGraph.nodes.map((node) => (
                <div key={node.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1 w-full md:w-36 shadow-md hover:border-purple-500/40 transition-colors">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">{node.type}</span>
                  <span className="text-xs font-extrabold text-white block truncate">{node.label}</span>
                  <span className={`text-[10px] font-bold ${node.health >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {node.health}% Health
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6: BUSINESS JOURNEY IMPACT */}
          <section aria-label="Business Journey Impact" className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Business Journey Impact Analysis</span>
              </h3>
              <span className="text-xs font-semibold text-slate-400">{businessJourneys.length} Journeys Configured</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {businessJourneys.map((j) => (
                <div key={j.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{j.name}</h4>
                    <span className="text-xs font-bold text-amber-400">{j.health}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Impacted Users: <strong className="text-slate-200">{j.impactedUsers.toLocaleString()}</strong></span>
                    <span>Revenue Risk: <strong className="text-purple-300">${(j.revenueImpact / 1000).toFixed(0)}K</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          OPINTEL Operational Intelligence Platform v4.18 • Single Project Observability Engine
        </footer>

      </div>

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      <IncidentModal
        incident={selectedIncident}
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />

    </div>
  );
}
