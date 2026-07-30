import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Server, 
  Clock, 
  User,
  Sparkles,
  Layers
} from 'lucide-react';

export default function ProjectsGrid({ projects = [], onCreateClick, onSelectProject }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.owner && project.owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.category && project.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status, health) => {
    if (status === 'Healthy' || health >= 90) {
      return {
        label: 'Healthy',
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-500',
        icon: CheckCircle2
      };
    }
    if (status === 'Critical' || health < 70) {
      return {
        label: 'Critical',
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        dot: 'bg-rose-500',
        icon: AlertTriangle
      };
    }
    return {
      label: 'Warning',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500',
      icon: Activity
    };
  };

  const handleCardClick = (e, project) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (onSelectProject) {
      onSelectProject(project);
    }
    const targetId = project.id || project._id || 'proj-1';
    navigate(`/project/${targetId}/dashboard`);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Projects Overview</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
              {projects.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Monitor real-time health score and active incidents across all system projects. Click any project to open its Project Dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Create Project Button */}
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs md:text-sm font-semibold shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const badge = getStatusBadge(project.status, project.health);

          return (
            <div
              key={project.id || project._id}
              onClick={(e) => handleCardClick(e, project)}
              className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg group cursor-pointer relative overflow-hidden flex flex-col justify-between"
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />

              <div>
                {/* Header: Name + Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                      <span>{project.name}</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-purple-400" />
                        {project.category || 'Platform'}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3 text-blue-400" />
                        {project.owner || 'Engineering'}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shrink-0 ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`} />
                    <span>{badge.label}</span>
                  </span>
                </div>

                {project.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                )}

                {/* Main Metrics: Health Score & Incidents */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-4">
                  {/* Health Score */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Health</span>
                      <span className={`font-extrabold text-sm ${
                        project.health >= 90 ? 'text-emerald-400' : project.health >= 75 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {project.health}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          project.health >= 90 ? 'bg-emerald-500' : project.health >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${project.health}%` }}
                      />
                    </div>
                  </div>

                  {/* Incidents Count */}
                  <div className="space-y-1 border-l border-slate-800/80 pl-3">
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">Active Incidents</span>
                    {(() => {
                      const count = typeof project.incidentsCount === 'number'
                        ? project.incidentsCount
                        : (Array.isArray(project.incidents) ? project.incidents.length : (typeof project.incidents === 'number' ? project.incidents : 0));
                      return (
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className={`w-4 h-4 ${
                            count > 0 ? 'text-amber-400' : 'text-slate-500'
                          }`} />
                          <span className={`font-extrabold text-sm ${
                            count > 0 ? 'text-amber-400' : 'text-slate-300'
                          }`}>
                            {count} {count === 1 ? 'Incident' : 'Incidents'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Footer: Microservices count + Action Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Server className="w-3 h-3 text-blue-400" />
                    {project.servicesCount || 4} Services
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {project.lastDeployment || 'Recent'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleCardClick(e, project)}
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold text-xs group-hover:translate-x-1 transition-transform cursor-pointer"
                >
                  <span>View Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
          <p className="text-sm text-slate-400">No projects found matching search filter.</p>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
            className="text-xs text-purple-400 font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
