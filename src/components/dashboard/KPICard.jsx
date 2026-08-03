import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Server, 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';

export default function KPICards({ dashboardData }) {
  if (!dashboardData) return null;

  const {
    systemHealthScore = 0,
    activeIncidentsCount = 0,
    totalServicesCount = 0,
    healthyServicesCount = 0,
    revenueAtRisk = 0,
    usersImpacted = 0
  } = dashboardData;

  const healthPct = systemHealthScore;
  const servicesPct = totalServicesCount > 0 ? Math.round((healthyServicesCount / totalServicesCount) * 100) : 0;

  const cardsData = [
    {
      id: 'health-score',
      title: 'System Health Score',
      value: `${systemHealthScore}/100`,
      subtitle: `${healthPct}% operational`,
      trend: 'up',
      icon: Activity,
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glowColor: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
      accentColor: 'text-emerald-400',
      progress: healthPct,
      progressColor: 'bg-emerald-500'
    },
    {
      id: 'active-incidents',
      title: 'Active Incidents',
      value: String(activeIncidentsCount),
      subtitle: activeIncidentsCount > 0 ? 'Requires Action' : 'All Clear',
      trend: 'down',
      trendBad: activeIncidentsCount > 0,
      icon: AlertTriangle,
      iconBg: 'bg-red-500/10 text-red-400 border-red-500/30',
      glowColor: 'hover:border-red-500/40 hover:shadow-red-500/10',
      accentColor: 'text-red-400',
      badge: activeIncidentsCount > 0 ? 'Requires Action' : 'Clear',
      badgeStyle: activeIncidentsCount > 0
        ? 'bg-red-500/15 text-red-400 border-red-500/30'
        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'healthy-services',
      title: 'Healthy Services',
      value: `${healthyServicesCount}/${totalServicesCount}`,
      subtitle: `${servicesPct}% Operational`,
      trend: 'up',
      icon: Server,
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      glowColor: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
      accentColor: 'text-blue-400',
      progress: servicesPct,
      progressColor: 'bg-blue-500'
    },
    {
      id: 'revenue-risk',
      title: 'Revenue At Risk',
      value: revenueAtRisk > 0 ? `$${(revenueAtRisk / 1000).toFixed(0)}K` : '$0',
      subtitle: revenueAtRisk > 0 ? 'Estimated exposure' : 'No revenue risk',
      trend: revenueAtRisk > 0 ? 'up' : 'down',
      trendBad: revenueAtRisk > 0,
      icon: DollarSign,
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      glowColor: 'hover:border-purple-500/40 hover:shadow-purple-500/10',
      accentColor: 'text-purple-400',
      badge: 'ESTIMATED',
      badgeStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    },
    {
      id: 'users-impacted',
      title: 'Users Impacted',
      value: usersImpacted.toLocaleString(),
      subtitle: usersImpacted > 0 ? 'Active friction' : 'No user impact',
      trend: usersImpacted > 0 ? 'up' : 'down',
      trendBad: usersImpacted > 0,
      icon: Users,
      iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      glowColor: 'hover:border-orange-500/40 hover:shadow-orange-500/10',
      accentColor: 'text-orange-400',
      progress: totalServicesCount > 0 ? Math.min(Math.round((usersImpacted / 100000) * 100), 100) : 0,
      progressColor: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cardsData.map((item) => {
        const Icon = item.icon;
        const TrendIcon = item.trend === 'up' ? TrendingUp : TrendingDown;

        return (
          <div
            key={item.id}
            className={`glass-panel rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg ${item.glowColor} group`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {item.title}
              </span>
              <div className={`p-2 rounded-xl border ${item.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl lg:text-3xl font-extrabold tracking-tight text-white ${item.accentColor}`}>
                  {item.value}
                </span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${item.badgeStyle}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <TrendIcon className={`w-3.5 h-3.5 ${item.trendBad ? 'text-red-400' : 'text-emerald-400'}`} />
                  <span className={`font-medium ${item.trendBad ? 'text-red-400' : 'text-emerald-400'}`}>
                    {item.subtitle}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
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
