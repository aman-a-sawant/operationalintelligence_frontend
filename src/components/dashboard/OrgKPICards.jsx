import React from 'react';
import { 
  FolderKanban, 
  CheckCircle2, 
  AlertOctagon, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  Activity,
  TrendingUp, 
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';

export default function OrgKPICards({ metrics }) {
  const {
    projectCount = 15,
    activeProjects = 14,
    healthyProjects = 10,
    criticalProjects = 2,
    activeIncidents = 5,
    revenueAtRisk = 450000,
    impactedUsers = 24500
  } = metrics || {};

  const cardsData = [
    {
      id: 'total-projects',
      title: 'Total Projects',
      value: projectCount,
      subtitle: `${activeProjects} active across org`,
      trend: 'up',
      icon: FolderKanban,
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      glowColor: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10',
      accentColor: 'text-indigo-400',
      badge: 'PORTFOLIO',
      badgeStyle: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'active-projects',
      title: 'Active Projects',
      value: activeProjects,
      subtitle: `${Math.round((activeProjects / projectCount) * 100)}% active rate`,
      trend: 'up',
      icon: Activity,
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      glowColor: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
      accentColor: 'text-blue-400',
      progress: Math.round((activeProjects / projectCount) * 100),
      progressColor: 'bg-blue-500'
    },
    {
      id: 'healthy-projects',
      title: 'Healthy Projects',
      value: healthyProjects,
      subtitle: `${Math.round((healthyProjects / projectCount) * 100)}% operational`,
      trend: 'up',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glowColor: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
      accentColor: 'text-emerald-400',
      progress: Math.round((healthyProjects / projectCount) * 100),
      progressColor: 'bg-emerald-500'
    },
    {
      id: 'critical-projects',
      title: 'Critical Projects',
      value: criticalProjects,
      subtitle: 'Immediate attention',
      trend: 'up',
      trendBad: true,
      icon: AlertOctagon,
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      glowColor: 'hover:border-rose-500/40 hover:shadow-rose-500/10',
      accentColor: 'text-rose-400',
      badge: 'URGENT',
      badgeStyle: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    },
    {
      id: 'open-incidents',
      title: 'Open Incidents',
      value: activeIncidents,
      subtitle: 'Across all workspaces',
      trend: 'down',
      trendBad: true,
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glowColor: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
      accentColor: 'text-amber-400',
      badge: 'ACTIVE',
      badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
    {
      id: 'revenue-risk',
      title: 'Revenue At Risk',
      value: `$${(revenueAtRisk / 1000).toFixed(0)}K`,
      subtitle: '+$45K last 24h',
      trend: 'up',
      trendBad: true,
      icon: DollarSign,
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      glowColor: 'hover:border-purple-500/40 hover:shadow-purple-500/10',
      accentColor: 'text-purple-400',
      badge: 'ESTIMATED',
      badgeStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    },
    {
      id: 'impacted-users',
      title: 'Impacted Users',
      value: impactedUsers.toLocaleString(),
      subtitle: 'Active user impact',
      trend: 'up',
      trendBad: true,
      icon: Users,
      iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      glowColor: 'hover:border-orange-500/40 hover:shadow-orange-500/10',
      accentColor: 'text-orange-400',
      progress: 22,
      progressColor: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3.5">
      {cardsData.map((item) => {
        const Icon = item.icon;
        const TrendIcon = item.trend === 'up' ? TrendingUp : TrendingDown;

        return (
          <div
            key={item.id}
            className={`glass-panel rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg ${item.glowColor} group`}
          >
            {/* Header row: Title + Icon */}
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                {item.title}
              </span>
              <div className={`p-2 rounded-xl border ${item.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110 shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Main Value */}
            <div className="my-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`text-2xl lg:text-3xl font-extrabold tracking-tight text-white ${item.accentColor}`}>
                  {item.value}
                </span>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${item.badgeStyle}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Footer row: Trend & Subtitle / Progress */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 min-w-0">
                  <TrendIcon className={`w-3.5 h-3.5 shrink-0 ${
                    item.trendBad ? 'text-rose-400' : 'text-emerald-400'
                  }`} />
                  <span className={`font-medium text-[11px] truncate ${
                    item.trendBad ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {item.subtitle}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
              </div>

              {item.progress !== undefined && (
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.progressColor} transition-all duration-1000`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
