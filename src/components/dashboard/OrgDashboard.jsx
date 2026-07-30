import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrgKPICards from './OrgKPICards';
import ProjectsGrid from './ProjectsGrid';
import OrganizationOverview from './OrganizationOverview';
import ProjectOnboardingWizard from '../onboarding/ProjectOnboardingWizard';
import { Plus, FolderKanban, BarChart3, ArrowDown } from 'lucide-react';

export default function OrgDashboard({ workspaceData, onAddProject, onSelectProject }) {
  const navigate = useNavigate();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleProjectCreated = (newProject) => {
    if (onAddProject) {
      onAddProject(newProject);
    }
  };

  const scrollToProjects = () => {
    const element = document.getElementById('projects-grid-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* WORKSPACE ACTIONS CONTROL BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-purple-950/20">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Portfolio Operations Workspace</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
              Live Observability
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Executive oversight, project onboarding, and system-wide monitoring controls
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto">
          {/* Action 1: Create Project */}
          <button
            onClick={() => setIsWizardOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>

          {/* Action 2: View Projects */}
          <button
            onClick={scrollToProjects}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white text-xs font-semibold hover:border-slate-700 transition-colors"
          >
            <FolderKanban className="w-4 h-4 text-purple-400" />
            <span>View Projects</span>
          </button>

          {/* Action 3: Monitor Projects */}
          <button
            onClick={() => navigate('/monitor')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 text-xs font-semibold transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>Monitor Projects</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TOP EXECUTIVE KPI CARDS */}
      <section aria-label="Executive KPI Cards">
        <OrgKPICards metrics={workspaceData} />
      </section>

      {/* SECTION 2: PROJECTS GRID WITH SEARCH & CREATE */}
      <section id="projects-grid-section" aria-label="Projects Grid Overview">
        <ProjectsGrid
          projects={workspaceData?.projects || []}
          onCreateClick={() => setIsWizardOpen(true)}
          onSelectProject={onSelectProject}
        />
      </section>

      {/* SECTION 3: ORGANIZATION OVERVIEW */}
      <section aria-label="Organization Overview Breakdown">
        <OrganizationOverview metrics={workspaceData} />
      </section>

      {/* 7-STEP PROJECT ONBOARDING WIZARD */}
      <ProjectOnboardingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
