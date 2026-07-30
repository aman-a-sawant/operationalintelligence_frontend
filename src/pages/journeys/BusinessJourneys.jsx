import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import AICopilotDrawer from '../../components/dashboard/AICopilotDrawer';
import { getBusinessJourneys, getBusinessJourneyById } from '../../api/businessJourneysApi';
import { 
  GitMerge, 
  Activity, 
  Server, 
  Users, 
  DollarSign, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function BusinessJourneys() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [journeysList, setJourneysList] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getBusinessJourneys().then((list) => {
      if (isMounted) {
        setJourneysList(list);
        const active = list.find((j) => j.id === id) || list[0];
        setSelectedJourney(active);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [id]);

  if (loading || !selectedJourney) {
    return (
      <div className="min-h-screen bg-[#050B1F] text-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-purple-400">
          <Sparkles className="w-6 h-6 animate-spin" />
          <span className="text-sm font-semibold">Loading Business Journey Telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-100 flex relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      {/* Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab="Business Journeys"
        onOpenCopilot={() => setIsCopilotOpen(true)}
        context="organization"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        
        {/* Header */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          dashboardView="organization"
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto w-full">
          
          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-3xl">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <GitMerge className="w-6 h-6 text-purple-400" />
                <span>Business Journey Monitoring</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
                End-to-end transaction funnels, service dependencies, user impact, and revenue risk tracking
              </p>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {journeysList.length} Journeys Monitored
            </span>
          </div>

          {/* Journey Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {journeysList.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedJourney(j)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedJourney.id === j.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{j.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  j.healthScore >= 90 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {j.healthScore}%
                </span>
              </button>
            ))}
          </div>

          {/* MAIN SELECTED JOURNEY DETAILS */}
          <div className="space-y-6">
            
            {/* 1. JOURNEY OVERVIEW & HEALTH METRICS */}
            <section className="glass-panel p-6 rounded-3xl space-y-4 bg-gradient-to-r from-purple-950/20 via-slate-900 to-slate-900 border border-purple-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-white">{selectedJourney.name}</h2>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      selectedJourney.status === 'Healthy' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>
                      {selectedJourney.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-medium">{selectedJourney.description}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Health Score</span>
                  <span className={`text-3xl font-extrabold ${selectedJourney.healthScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedJourney.healthScore}%
                  </span>
                </div>
              </div>

              {/* 4 Overview Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Health Score
                  </span>
                  <span className="text-xl font-extrabold text-white">{selectedJourney.healthScore}/100</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    Impacted Users
                  </span>
                  <span className="text-xl font-extrabold text-orange-400">{selectedJourney.impactedUsers.toLocaleString()}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                    Revenue Impact
                  </span>
                  <span className="text-xl font-extrabold text-purple-300">${(selectedJourney.revenueImpact / 1000).toFixed(0)}K</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    Active Incidents
                  </span>
                  <span className="text-xl font-extrabold text-rose-400">{selectedJourney.currentIncidents?.length || 0}</span>
                </div>
              </div>
            </section>

            {/* 2. AFFECTED SERVICES & DEPENDENCIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Affected Services */}
              <section className="glass-panel p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>Affected Microservices</span>
                  </h3>
                  <span className="text-xs text-slate-400">{selectedJourney.affectedServices.length} Services</span>
                </div>

                <div className="space-y-2">
                  {selectedJourney.affectedServices.map((srv, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{srv}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        Active In Funnel
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Dependencies */}
              <section className="glass-panel p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Downstream Infrastructure Dependencies</span>
                  </h3>
                  <span className="text-xs text-slate-400">{selectedJourney.dependencies.length} Dependencies</span>
                </div>

                <div className="space-y-2">
                  {selectedJourney.dependencies.map((dep, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300">{dep}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Operational
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* 3. CURRENT INCIDENTS */}
            <section className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Current Incidents Affecting Journey</span>
                </h3>
                <span className="text-xs font-bold text-rose-400">{selectedJourney.currentIncidents?.length || 0} Incidents</span>
              </div>

              {selectedJourney.currentIncidents && selectedJourney.currentIncidents.length > 0 ? (
                <div className="space-y-3">
                  {selectedJourney.currentIncidents.map((inc) => (
                    <div 
                      key={inc.id}
                      onClick={() => navigate(`/incidents/${inc.id}`)}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between cursor-pointer group transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30">
                            {inc.id}
                          </span>
                          <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                            {inc.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                          {inc.severity} Severity
                        </span>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                  <span className="text-xs font-semibold text-emerald-400 block">No Active Incidents</span>
                  <p className="text-[11px] text-slate-400">This business transaction funnel is operating with zero friction.</p>
                </div>
              )}
            </section>

          </div>

        </main>

        <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          OPINTEL Operational Intelligence Platform v4.18 • Business Journey Intelligence Engine
        </footer>

      </div>

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

    </div>
  );
}
