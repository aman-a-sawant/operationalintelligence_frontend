import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import InvestigationHeader from '../../components/incidents/InvestigationHeader';
import AIInvestigationPipeline from '../../components/incidents/AIInvestigationPipeline';
import InvestigationOverviewTab from '../../components/incidents/InvestigationOverviewTab';
import { 
  TimelineTab, 
  EvidenceTab, 
  ServicesTab, 
  DeploymentsTab, 
  RunbookTab, 
  AIAnalysisTab 
} from '../../components/incidents/InvestigationOtherTabs';
import AICopilotDrawer from '../../components/dashboard/AICopilotDrawer';
import IncidentModal from '../../components/dashboard/IncidentModal';
import { Sparkles } from 'lucide-react';

export default function IncidentInvestigation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const incidentId = id || "INC-8421";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Timeline', label: 'Timeline' },
    { id: 'Evidence', label: 'Evidence' },
    { id: 'Related Services', label: 'Related Services' },
    { id: 'Deployments', label: 'Deployments' },
    { id: 'Runbook', label: 'Runbook' },
    { id: 'AI Analysis', label: 'AI Analysis' },
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        
        {/* Main Workspace Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto w-full">
          
          {/* HEADER SECTION */}
          <section aria-label="Investigation Header">
            <InvestigationHeader
              incidentId={incidentId}
              onOpenCopilot={() => setIsCopilotOpen(true)}
              onOpenMenu={() => setIsSidebarOpen(true)}
            />
          </section>

          {/* AI INVESTIGATION PIPELINE (Horizontal 6 Steps) */}
          <section aria-label="AI Investigation Pipeline">
            <AIInvestigationPipeline />
          </section>

          {/* INVESTIGATION TABS BAR */}
          <section aria-label="Investigation Tabs Navigation">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ACTIVE TAB CONTENT */}
          <section aria-label="Active Investigation Tab Content" className="space-y-6">
            {activeTab === 'Overview' && (
              <InvestigationOverviewTab
                onSelectTab={(tabId) => setActiveTab(tabId)}
                onOpenCopilot={() => setIsCopilotOpen(true)}
              />
            )}
            {activeTab === 'Timeline' && <TimelineTab />}
            {activeTab === 'Evidence' && <EvidenceTab />}
            {activeTab === 'Related Services' && <ServicesTab />}
            {activeTab === 'Deployments' && <DeploymentsTab />}
            {activeTab === 'Runbook' && <RunbookTab />}
            {activeTab === 'AI Analysis' && <AIAnalysisTab />}
          </section>

        </main>

        {/* Page Footer */}
        <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          OPINTEL Operational Intelligence Platform v4.18 • AI-Powered Incident Investigation Agent Workspace
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
