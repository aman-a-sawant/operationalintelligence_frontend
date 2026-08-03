import React from 'react';
import { Menu, Sparkles } from 'lucide-react';

export default function Header({ 
  onMenuClick, 
  onOpenCopilot,
  dashboardView = 'organization',
  setDashboardView,
  selectedProject
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#050B1F]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* Left Side: Mobile Menu Button + View Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>{dashboardView === 'organization' ? 'Organization Dashboard' : (selectedProject?.name || 'Project Dashboard')}</span>
              </h1>

              {/* View Switcher Toggle Pill */}
              {setDashboardView && (
                <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 ml-2">
                  <button
                    onClick={() => setDashboardView('organization')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      dashboardView === 'organization'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Organization
                  </button>
                  <button
                    onClick={() => setDashboardView('project')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      dashboardView === 'project'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Project View
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {dashboardView === 'organization'
                ? 'Portfolio view & organizational system health'
                : `Operational telemetry for ${selectedProject?.name || 'Checkout Platform'}`}
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Quick AI Trigger Pill */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all shadow-sm shadow-purple-500/10 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>AI Copilot</span>
          </button>
        </div>

      </div>
    </header>
  );
}
