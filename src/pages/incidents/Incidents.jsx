import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import IncidentKPIs from '../../components/incidents/IncidentKPIs';
import IncidentTable from '../../components/incidents/IncidentTable';
import AICopilotDrawer from '../../components/dashboard/AICopilotDrawer';
import IncidentModal from '../../components/dashboard/IncidentModal';
import { 
  AlertTriangle, 
  Clock, 
  RotateCw, 
  Bell, 
  Menu, 
  Sparkles, 
  Search, 
  Filter,
  ShieldCheck
} from 'lucide-react';

export default function Incidents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-100 flex relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      {/* Toast Alert */}
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
        activeTab="Incidents"
        onOpenCopilot={() => setIsCopilotOpen(true)}
        context="project"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        
        {/* Page Header */}
        <header className="sticky top-0 z-30 bg-[#050B1F]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile menu + Page Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Incidents</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                    4 Active
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">
                  Identify, prioritize and resolve issues that impact your business.
                </p>
              </div>
            </div>

            {/* Quick AI Trigger */}
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all shadow-sm shadow-purple-500/10 hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="hidden sm:inline">Ask AI Copilot</span>
            </button>

          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto w-full">
          
          {/* INCIDENT KPI OVERVIEW (5 Cards in 1 Row) */}
          <section aria-label="Incident KPI Overview">
            <IncidentKPIs />
          </section>

          {/* INCIDENTS TABLE & FILTER SECTION */}
          <section aria-label="Incidents Table Section">
            <IncidentTable
              onSelectIncident={(inc) => setSelectedIncident(inc)}
            />
          </section>

        </main>

        {/* Page Footer */}
        <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          OPINTEL Operational Intelligence Platform v4.18 • Real-Time Incident Management Center
        </footer>

      </div>

      {/* AI Copilot Slide-over Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Incident Deep Dive Modal */}
      <IncidentModal
        incident={selectedIncident}
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onExecuteFix={(incId) => {
          showToast(`Hotfix deployed successfully! Incident ${incId} resolved.`);
        }}
      />

    </div>
  );
}
