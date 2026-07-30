import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import AICopilotDrawer from '../../components/dashboard/AICopilotDrawer';
import { 
  getAnalyticsOverview, 
  getAnalyticsRankings, 
  getAnalyticsIncidents, 
  getAnalyticsJourneys, 
  getAnalyticsServices, 
  getAnalyticsRisk 
} from '../../api/projectAnalyticsApi';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  Server, 
  DollarSign, 
  Users, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function MonitorProjects() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [incidentsData, setIncidentsData] = useState(null);
  const [journeys, setJourneys] = useState([]);
  const [servicesData, setServicesData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getAnalyticsOverview(),
      getAnalyticsRankings(),
      getAnalyticsIncidents(),
      getAnalyticsJourneys(),
      getAnalyticsServices(),
      getAnalyticsRisk()
    ]).then(([ov, rk, inc, jrn, srv, rsk]) => {
      if (isMounted) {
        setOverview(ov);
        setRankings(rk);
        setIncidentsData(inc);
        setJourneys(jrn);
        setServicesData(srv);
        setRiskData(rsk);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B1F] text-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-purple-400">
          <Sparkles className="w-6 h-6 animate-spin" />
          <span className="text-sm font-semibold">Loading Monitor Projects Analytics...</span>
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
        activeTab="Monitor Projects"
        onOpenCopilot={() => setIsCopilotOpen(true)}
        context="organization"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        
        {/* Top Header */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          dashboardView="organization"
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto w-full">
          
          {/* Header Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-3xl">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <span>Monitor Projects Analytics</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
                Portfolio-level operational health rankings, incident trends, service availability & revenue risk analysis
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Org Health: {overview?.orgHealthScore}%</span>
              </div>
            </div>
          </div>

          {/* SECTION 1: TOP ANALYTICS KPI METRICS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Organization Health */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                <span>Organization Health</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400">{overview?.orgHealthScore}%</div>
              <p className="text-xs text-slate-400 font-medium">10 of {overview?.activeProjects} Projects Healthy</p>
            </div>

            {/* 2. Service Availability */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                <span>Service Availability</span>
                <Server className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold text-blue-400">{servicesData?.availabilitySLA}</div>
              <p className="text-xs text-slate-400 font-medium">{servicesData?.healthyServices} / {servicesData?.totalServices} Microservices Online</p>
            </div>

            {/* 3. Revenue Impact / Risk */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                <span>Revenue Impact</span>
                <DollarSign className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-purple-300">${(riskData?.revenueAtRisk / 1000).toFixed(0)}K</div>
              <p className="text-xs text-purple-400 font-medium">Active Portfolio Risk</p>
            </div>

            {/* 4. Impacted Users */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                <span>Impacted Users</span>
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-extrabold text-orange-400">{riskData?.impactedUsers.toLocaleString()}</div>
              <p className="text-xs text-orange-400 font-medium">User Friction Metric</p>
            </div>
          </section>

          {/* SECTION 2: RANKINGS & INCIDENT TRENDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Health Rankings */}
            <section className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span>Project Health Rankings</span>
                </h3>
                <span className="text-xs text-slate-400">Ranked by Health Score</span>
              </div>

              <div className="space-y-2.5">
                {rankings.map((rk) => (
                  <div 
                    key={rk.rank}
                    onClick={() => navigate('/project/proj-1/dashboard')}
                    className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                        #{rk.rank}
                      </span>
                      <div>
                        <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                          {rk.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{rk.criticality} Criticality</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-extrabold ${rk.health >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {rk.health}%
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Incident Trends */}
            <section className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Incident Trends (24h Timeline)</span>
                </h3>
                <span className="text-xs font-bold text-rose-400">{incidentsData?.totalIncidents} Active Events</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-end justify-between gap-2 h-44">
                {incidentsData?.trend.map((t, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-600 to-rose-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(t.count / 6) * 100}%` }}
                    />
                    <span className="text-[10px] font-mono text-slate-400">{t.time}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Critical</span>
                  <span className="text-sm font-extrabold text-rose-400">{incidentsData?.criticalCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">High</span>
                  <span className="text-sm font-extrabold text-orange-400">{incidentsData?.highCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Medium</span>
                  <span className="text-sm font-extrabold text-amber-400">{incidentsData?.mediumCount}</span>
                </div>
              </div>
            </section>
          </div>

          {/* SECTION 3: PROJECTS AT RISK */}
          <section className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Projects At Risk & Operational Vulnerabilities</span>
              </h3>
              <span className="text-xs font-semibold text-rose-400">{riskData?.projectsAtRisk.length} High-Risk Projects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {riskData?.projectsAtRisk.map((proj) => (
                <div key={proj.id} className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                    <span className="text-xs font-bold text-rose-400">{proj.health}%</span>
                  </div>
                  <p className="text-xs text-slate-400">{proj.reason}</p>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                    <span className="text-slate-400">Risk Amount:</span>
                    <span className="font-extrabold text-purple-300">${(proj.riskAmount / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          OPINTEL Operational Intelligence Platform v4.18 • Portfolio Analytics Engine
        </footer>

      </div>

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

    </div>
  );
}
