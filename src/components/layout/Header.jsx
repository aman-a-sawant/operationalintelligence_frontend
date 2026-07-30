import React, { useState } from 'react';
import {
  Clock,
  RotateCw,
  Bell,
  Menu,
  ChevronDown,
  Sparkles,
  Search,
  Check
} from 'lucide-react';

const timeRanges = [
  { label: 'Last 15 minutes', value: '15m' },
  { label: 'Last 1 hour', value: '1h' },
  { label: 'Last 6 hours', value: '6h' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
];

export default function Header({ 
  onMenuClick, 
  onRefresh, 
  onOpenCopilot,
  dashboardView = 'organization',
  setDashboardView,
  selectedProject,
  projects = []
}) {
  const [selectedRange, setSelectedRange] = useState(timeRanges[1]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

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
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all shadow-sm shadow-purple-500/10 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>AI Copilot</span>
          </button>

          {/* Time Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs md:text-sm font-medium text-slate-200 transition-colors"
            >
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{selectedRange.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0B1536] border border-slate-800 shadow-2xl z-50 py-1 backdrop-blur-xl">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800/80">
                  Select Time Range
                </div>
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => {
                      setSelectedRange(range);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-xs flex items-center justify-between text-left hover:bg-slate-800/60 transition-colors ${selectedRange.value === range.value ? 'text-purple-400 font-semibold bg-purple-500/10' : 'text-slate-300'
                      }`}
                  >
                    <span>{range.label}</span>
                    {selectedRange.value === range.value && (
                      <Check className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all group"
            title="Refresh Dashboard Data"
          >
            <RotateCw className={`w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          {/* Notification Button */}
          <button
            onClick={() => setHasUnreadNotifications(false)}
            className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-400 hover:text-amber-400 transition-colors" />
            {hasUnreadNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500/80 animate-ping" />
            )}
            {hasUnreadNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
