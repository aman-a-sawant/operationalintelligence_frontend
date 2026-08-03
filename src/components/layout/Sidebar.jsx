import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2,
  FolderKanban,
  LayoutDashboard, 
  AlertTriangle, 
  Server, 
  GitMerge, 
  Cpu, 
  FileText, 
  Bell, 
  Bot, 
  BarChart3, 
  Settings, 
  Zap, 
  X,
  ArrowLeft,
  Layers,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const orgNavItems = [
  { name: 'Organization Dashboard', icon: BarChart3, path: '/monitor', badge: 'LVL 1', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
];

const projectNavItems = [
  { name: 'Project Dashboard', icon: LayoutDashboard, path: '/project/dashboard', badge: null },
  { name: 'Monitor Projects', icon: BarChart3, path: '/monitor', badge: null },
];

export default function Sidebar({ 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab, 
  onOpenCopilot,
  context = 'organization',
  selectedProject = null,
  onBackToOrganization
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isProjectView = context === 'project' || location.pathname.includes('/project/') || location.search.includes('view=project');
  const currentNavItems = isProjectView ? projectNavItems : orgNavItems;

  const handleNavClick = (item) => {
    if (setActiveTab) setActiveTab(item.name);
    if (item.name === 'AI Copilot' && onOpenCopilot) {
      onOpenCopilot();
    } else {
      if (item.name === 'Project Dashboard') {
        const projId = selectedProject?.id || selectedProject?._id;
        if (projId) {
          navigate(`/project/${projId}/dashboard`);
        } else {
          navigate('/monitor');
        }
      } else {
        navigate(item.path);
      }
    }
    if (window.innerWidth < 1024 && onClose) onClose();
  };

  const handleBack = () => {
    if (onBackToOrganization) {
      onBackToOrganization();
    } else {
      navigate('/monitor');
    }
    if (window.innerWidth < 1024 && onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = user ? `${(user.firstName || 'U')[0]}${(user.lastName || 'U')[0]}`.toUpperCase() : 'OP';
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'User';
  const userRole = user?.role || 'Member';

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#070E27] backdrop-blur-xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={handleBack}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25 border border-purple-400/30">
              <Zap className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                  AppDynamics
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Observability Platform</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Scope Banner */}
        <div className="px-3 pt-3 pb-1">
          {isProjectView ? (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 space-y-2">
              <button
                onClick={handleBack}
                className="w-full flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Organization</span>
              </button>
              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="text-xs font-bold text-white truncate">
                    {selectedProject?.name || 'Project View'}
                  </span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  PROJECT
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">AppDynamics Workspace</span>
                  <span className="text-[10px] text-slate-400">All Projects Scope</span>
                </div>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ORG
              </span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isProjectView ? 'PROJECT TELEMETRY' : 'ORGANIZATION NAVIGATION'}
          </div>

          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isSelected = 
              activeTab === item.name || 
              location.pathname === item.path ||
              (item.name === 'Project Dashboard' && (location.pathname.includes('/project/') || location.search.includes('view=project')));

            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600/30 via-blue-600/20 to-slate-900/40 text-white border-l-4 border-blue-500 font-bold shadow-lg shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isSelected ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span className={isSelected ? 'text-white font-bold' : ''}>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={item.badgeColor || 'px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]'}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border-2 border-purple-500/40 shadow-sm shrink-0">
                {userInitials}
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-bold text-slate-100 truncate">
                  {userName}
                </span>
                <span className="text-[10px] text-purple-400 font-semibold truncate">
                  {userRole}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
