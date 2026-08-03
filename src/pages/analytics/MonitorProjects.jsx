import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import AICopilotDrawer from '../../components/ai-copilot/AICopilotDrawer';
import { 
  getAnalyticsOverview,
  getEndpointHealth,
  getAnalyticsRankings,
  getMonitoringCoverage,
  getAvailabilityAnalytics,
  getErrorsAnalytics
} from '../../api/projectAnalyticsApi';
import { getProjects } from '../../api/projectOnboardingApi';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Server, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Globe,
  Clock,
  ShieldAlert,
  AlertOctagon,
  Check,
  RefreshCw,
  Layers,
  Heart,
  Database,
  Search,
  SlidersHorizontal,
  Plus
} from 'lucide-react';

export default function MonitorProjects() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [projectsList, setProjectsList] = useState([]);
  const [endpointHealth, setEndpointHealth] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [errorsData, setErrorsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotProj, setCopilotProj] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ov, ep, rk, av, err, projs] = await Promise.allSettled([
        getAnalyticsOverview(),
        getEndpointHealth(),
        getAnalyticsRankings(),
        getAvailabilityAnalytics(),
        getErrorsAnalytics(),
        getProjects()
      ]);

      setOverview(ov.status === 'fulfilled' ? ov.value : null);
      setEndpointHealth(ep.status === 'fulfilled' && Array.isArray(ep.value) ? ep.value : []);
      setRankings(rk.status === 'fulfilled' ? (Array.isArray(rk.value) ? rk.value : rk.value?.rankings || []) : []);
      setAvailability(av.status === 'fulfilled' ? av.value : null);
      setErrorsData(err.status === 'fulfilled' ? err.value : null);
      setProjectsList(projs.status === 'fulfilled' && Array.isArray(projs.value) ? projs.value : []);
    } catch (e) {
      console.error('Error loading monitor portfolio data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Merge projectsList with rankings and endpointHealth
  const combinedCards = (projectsList.length > 0 ? projectsList : endpointHealth).map((p) => {
    const projId = p._id || p.id || p.projectId;
    const epData = endpointHealth.find((e) => e.projectId === projId || e.projectName === p.name) || {};
    const rkData = rankings.find((r) => r.projectId === projId || r.name === p.name) || {};

    const healthScore = rkData.healthScore ?? rkData.health ?? epData.healthScore ?? p.healthScore ?? 100;
    const status = rkData.status || epData.status || p.status || (healthScore >= 90 ? 'Healthy' : healthScore >= 75 ? 'Warning' : 'Degraded');

    const feStatus = epData.frontendStatus || (p.frontendUrl ? 'Healthy' : 'Not Configured');
    const beStatus = epData.backendStatus || (p.backendUrl ? 'Healthy' : 'Not Configured');

    const dbConfigured = Boolean(p.databaseHost || p.databaseConfigured || p.databases?.length > 0);
    const dbStatus = dbConfigured ? (p.databaseStatus || 'Healthy') : 'Not Configured';

    const feUptime = epData.availability ?? availability?.frontendUptime ?? 100;
    const beUptime = epData.availability ?? availability?.backendUptime ?? 100;

    const activeIncidents = rkData.activeIncidents ?? p.activeIncidents ?? 0;
    const lastVerificationTime = epData.lastCheck 
      ? new Date(epData.lastCheck).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Verified Just Now';

    return {
      projectId: projId,
      name: p.name || epData.projectName || rkData.name || 'Unnamed Project',
      criticality: p.criticality || rkData.criticality || 'Medium',
      healthScore,
      status,
      frontendStatus: feStatus,
      backendStatus: beStatus,
      databaseStatus: dbStatus,
      frontendUptime: feStatus === 'Not Configured' ? 'N/A' : `${feUptime}%`,
      backendUptime: beStatus === 'Not Configured' ? 'N/A' : `${beUptime}%`,
      activeIncidents,
      lastVerificationTime
    };
  });

  const filteredCards = combinedCards.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B1F] text-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-purple-400">
          <Sparkles className="w-6 h-6 animate-spin" />
          <span className="text-sm font-semibold">Loading Monitored Projects Portfolio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-100 flex relative overflow-x-hidden font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab="Monitor Projects" 
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onCopilotClick={() => setIsCopilotOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* TOP PORTFOLIO BANNER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-slate-900/60 to-blue-900/20">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-extrabold uppercase tracking-wider mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>Organization Monitoring Portfolio</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Monitor Projects
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Select a monitored project card to inspect deep telemetry, latency percentiles, and health explainability.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={loadData}
                className="px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Status
              </button>
              <button 
                onClick={() => navigate('/projects/new')}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                Onboard Project
              </button>
            </div>
          </div>

          {/* PORTFOLIO STATS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monitored Projects</span>
              <div className="text-2xl font-black text-white">{combinedCards.length}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Healthy Targets</span>
              <div className="text-2xl font-black text-emerald-400">
                {combinedCards.filter((c) => c.status === 'Healthy').length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Warning / At Risk</span>
              <div className="text-2xl font-black text-amber-400">
                {combinedCards.filter((c) => c.status !== 'Healthy').length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Total Active Incidents</span>
              <div className="text-2xl font-black text-rose-400">
                {combinedCards.reduce((sum, c) => sum + (c.activeIncidents || 0), 0)}
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search monitored project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Status:</span>
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                {['All', 'Healthy', 'Warning', 'Degraded'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === st ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PROJECT MONITORING CARDS GRID */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Monitored Project Cards ({filteredCards.length})</span>
              </h2>
              <span className="text-xs text-slate-400">Click any card to open project observability dashboard</span>
            </div>

            {filteredCards.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
                <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-300 font-semibold">No monitored projects match your criteria.</p>
                <p className="text-xs text-slate-500">Onboard a project or adjust your search filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => (
                  <div
                    key={card.projectId}
                    onClick={() => navigate(`/project/${card.projectId}/dashboard`)}
                    className="glass-panel p-6 rounded-3xl border border-slate-800/90 hover:border-purple-500/50 transition-all duration-300 cursor-pointer space-y-4 group hover:shadow-2xl hover:shadow-purple-900/20 bg-slate-900/70"
                  >
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-start gap-2 pb-3 border-b border-slate-800/80">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                          <span>{card.name}</span>
                          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <span className="text-[10px] text-slate-400 font-semibold">{card.criticality} Criticality</span>
                      </div>

                      <div className="text-right">
                        <span className={`text-lg font-black ${card.healthScore >= 90 ? 'text-emerald-400' : card.healthScore >= 75 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {card.healthScore}%
                        </span>
                        <div className="text-[10px] text-slate-400 font-medium">Health Score</div>
                      </div>
                    </div>

                    {/* ENDPOINT STATUS GRID */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {/* Frontend */}
                      <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                          <Globe className="w-3 h-3 text-blue-400" /> FE
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded block ${card.frontendStatus === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : card.frontendStatus === 'Not Configured' ? 'bg-slate-800 text-slate-500' : 'bg-amber-500/10 text-amber-400'}`}>
                          {card.frontendStatus}
                        </span>
                      </div>

                      {/* Backend */}
                      <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                          <Server className="w-3 h-3 text-purple-400" /> BE
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded block ${card.backendStatus === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : card.backendStatus === 'Not Configured' ? 'bg-slate-800 text-slate-500' : 'bg-amber-500/10 text-amber-400'}`}>
                          {card.backendStatus}
                        </span>
                      </div>

                      {/* Database */}
                      <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                          <Database className="w-3 h-3 text-emerald-400" /> DB
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded block ${card.databaseStatus === 'Not Configured' ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {card.databaseStatus}
                        </span>
                      </div>
                    </div>

                    {/* UPTIME & METRICS SUMMARY */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-[11px] text-slate-400">FE Uptime:</span>
                        <span className="font-extrabold text-blue-400">{card.frontendUptime}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-[11px] text-slate-400">BE Uptime:</span>
                        <span className="font-extrabold text-purple-300">{card.backendUptime}</span>
                      </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2 text-[11px] text-slate-400">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className={`w-3.5 h-3.5 ${card.activeIncidents > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
                          <span>{card.activeIncidents} Active Incidents</span>
                        </div>
                        <span className="text-slate-500 text-[10px] font-mono">{card.lastVerificationTime}</span>
                      </div>

                      {/* AI Copilot Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCopilotProj(card);
                            setIsCopilotOpen(true);
                          }}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span>Ask AI Copilot</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCopilotProj(card);
                            setIsCopilotOpen(true);
                          }}
                          className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Activity className="w-3.5 h-3.5 text-sky-400" />
                          <span>Analyze</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>

        </main>

        <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          OPINTEL Monitoring Portfolio Engine v4.25 • Operational Intelligence Platform
        </footer>

      </div>

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        projectId={copilotProj?.id || copilotProj?._id}
        projectName={copilotProj?.name}
      />

    </div>
  );
}
