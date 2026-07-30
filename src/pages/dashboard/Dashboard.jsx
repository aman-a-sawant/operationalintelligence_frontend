import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import OrgDashboard from '../../components/dashboard/OrgDashboard';
import KPICard from '../../components/dashboard/KPICard';
import AISummary from '../../components/dashboard/AISummary';
import RecentIncidents from '../../components/dashboard/RecentIncidents';
import BusinessHealth from '../../components/dashboard/BusinessHealth';
import ServiceOverview from '../../components/dashboard/ServiceOverview';
import AICopilotDrawer from '../../components/dashboard/AICopilotDrawer';
import IncidentModal from '../../components/dashboard/IncidentModal';
import { getWorkspaceDashboard, createProject, initialWorkspaceData } from '../../api/workspaceApi';
import { Sparkles, ArrowLeft, Layers } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewQuery = searchParams.get('view');
  
  const [dashboardView, setDashboardView] = useState(viewQuery === 'project' ? 'project' : 'organization');
  const [workspaceData, setWorkspaceData] = useState(initialWorkspaceData);
  const [selectedProject, setSelectedProject] = useState(initialWorkspaceData.projects[0]);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState(dashboardView === 'organization' ? 'Organization Dashboard' : 'Project Dashboard');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state with URL view query if present
  useEffect(() => {
    if (viewQuery === 'organization') {
      setDashboardView('organization');
      setActiveNavTab('Organization Dashboard');
    } else if (viewQuery === 'project') {
      setDashboardView('project');
      setActiveNavTab('Project Dashboard');
    }
  }, [viewQuery]);

  // Fetch telemetry / workspace dashboard metrics on mount
  useEffect(() => {
    let isMounted = true;
    getWorkspaceDashboard().then((data) => {
      if (isMounted && data) {
        setWorkspaceData(data);
        if (data.projects && data.projects.length > 0 && !selectedProject) {
          setSelectedProject(data.projects[0]);
        }
      }
    });
    return () => { isMounted = false; };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRefresh = async () => {
    const freshData = await getWorkspaceDashboard();
    setWorkspaceData(freshData);
    showToast("Workspace telemetry data re-synchronized with live clusters!");
  };

  const handleAddProject = async (newProjectData) => {
    const created = await createProject(newProjectData);
    setWorkspaceData((prev) => {
      const updatedProjects = [created, ...(prev.projects || [])];
      return {
        ...prev,
        projectCount: updatedProjects.length,
        activeProjects: (prev.activeProjects || 6) + 1,
        healthyProjects: (prev.healthyProjects || 3) + 1,
        projects: updatedProjects
      };
    });
    showToast(`Project "${created.name}" created successfully!`);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    const targetId = project.id || project._id || 'proj-1';
    navigate(`/project/${targetId}/dashboard`);
  };

  const handleInvestigateDefault = () => {
    const defaultInc = selectedProject?.incidents?.[0] || {
      id: 'INC-101',
      title: 'Checkout API Latency Spike (>850ms)',
      severity: 'Critical',
      users: '12,643 users',
      service: 'Checkout API',
      status: 'Active'
    };
    setSelectedIncident(defaultInc);
  };

  const handleViewJourneys = () => {
    showToast("Navigating to Business Journey Funnel Analytics...");
  };

  const handleViewChange = (viewMode) => {
    setDashboardView(viewMode);
    setSearchParams({ view: viewMode });
    setActiveNavTab(viewMode === 'organization' ? 'Organization Dashboard' : 'Project Dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-100 flex relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      {/* Toast Notification Alert */}
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
        activeTab={activeNavTab}
        setActiveTab={(tabName) => {
          setActiveNavTab(tabName);
          if (tabName === 'Organization Dashboard' || tabName === 'Projects Portfolio') {
            handleViewChange('organization');
          } else if (tabName === 'Project Dashboard') {
            handleViewChange('project');
          }
        }}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        context={dashboardView}
        selectedProject={selectedProject}
        onBackToOrganization={() => handleViewChange('organization')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        
        {/* Top Header */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onRefresh={handleRefresh}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          dashboardView={dashboardView}
          setDashboardView={handleViewChange}
          selectedProject={selectedProject}
          projects={workspaceData?.projects || []}
        />

        {/* Dashboard Body Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto w-full">
          
          {/* LEVEL 1: ORGANIZATION DASHBOARD VIEW */}
          {dashboardView === 'organization' ? (
            <OrgDashboard
              workspaceData={workspaceData}
              onAddProject={handleAddProject}
              onSelectProject={handleSelectProject}
            />
          ) : (
            /* LEVEL 2: DETAILED PROJECT DASHBOARD VIEW */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Project context header bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewChange('organization')}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-semibold hover:border-purple-500/40 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-purple-400" />
                    <span>Back to Organization</span>
                  </button>
                  <div className="h-4 w-px bg-slate-800 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-white">
                      {selectedProject?.name || 'Checkout Platform'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium hidden md:inline">
                      ({selectedProject?.category || 'Core Services'} • {selectedProject?.owner || 'Engineering'})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    (selectedProject?.health || 82) >= 90 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : (selectedProject?.health || 82) >= 75
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    Health Score: {selectedProject?.health || 82}%
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedProject?.incidentsCount ?? (selectedProject?.incidents?.length || 0)} Active Incidents
                  </span>
                </div>
              </div>

              {/* KPI CARDS */}
              <section aria-label="KPI Cards Grid">
                <KPICard />
              </section>

              {/* AI INCIDENT SUMMARY */}
              <section aria-label="AI Incident Summary">
                <AISummary
                  onInvestigate={handleInvestigateDefault}
                  onOpenCopilot={() => setIsCopilotOpen(true)}
                />
              </section>

              {/* LOWER OPERATIONAL TELEMETRY GRID */}
              <section aria-label="Operational Telemetry Grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <div className="h-full">
                  <RecentIncidents
                    incidents={selectedProject?.incidents}
                    onSelectIncident={(inc) => setSelectedIncident(inc)}
                  />
                </div>

                <div className="h-full">
                  <BusinessHealth
                    onViewJourneys={handleViewJourneys}
                  />
                </div>

                <div className="h-full">
                  <ServiceOverview />
                </div>
              </section>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          OPINTEL Operational Intelligence Platform v4.18 • Level 1 Workspace & Executive Portfolio Engine
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
          showToast(`Hotfix deployed successfully! Incident ${incId || 'INC-101'} resolved.`);
        }}
      />

    </div>
  );
}
