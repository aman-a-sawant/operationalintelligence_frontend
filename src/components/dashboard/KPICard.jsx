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

const kpiData = [
  {
    id: 'health-score',
    title: 'System Health Score',
    value: '87/100',
    subtitle: '+2.4% vs last hour',
    trend: 'up',
    icon: Activity,
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    glowColor: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
    accentColor: 'text-emerald-400',
    progress: 87,
    progressColor: 'bg-emerald-500'
  },
  {
    id: 'active-incidents',
    title: 'Active Incidents',
    value: '4',
    subtitle: '1 Critical, 3 Major',
    trend: 'down',
    trendBad: true,
    icon: AlertTriangle,
    iconBg: 'bg-red-500/10 text-red-400 border-red-500/30',
    glowColor: 'hover:border-red-500/40 hover:shadow-red-500/10',
    accentColor: 'text-red-400',
    badge: 'Requires Action',
    badgeStyle: 'bg-red-500/15 text-red-400 border-red-500/30'
  },
  {
    id: 'healthy-services',
    title: 'Healthy Services',
    value: '28/35',
    subtitle: '80% Operational',
    trend: 'up',
    icon: Server,
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    glowColor: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
    accentColor: 'text-blue-400',
    progress: 80,
    progressColor: 'bg-blue-500'
  },
  {
    id: 'revenue-risk',
    title: 'Revenue At Risk',
    value: '$248K',
    subtitle: '+$42K in last 2h',
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
    id: 'users-impacted',
    title: 'Users Impacted',
    value: '12,643',
    subtitle: '1.8% of active users',
    trend: 'up',
    trendBad: true,
    icon: Users,
    iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    glowColor: 'hover:border-orange-500/40 hover:shadow-orange-500/10',
    accentColor: 'text-orange-400',
    progress: 18,
    progressColor: 'bg-orange-500'
  }
];

export default function KPICards({ data = kpiData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {data.map((item) => {
        const Icon = item.icon;
        const TrendIcon = item.trend === 'up' ? TrendingUp : TrendingDown;

        return (
          <div
            key={item.id}
            className={`glass-panel rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg ${item.glowColor} group`}
          >
            {/* Header row: Title + Icon */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {item.title}
              </span>
              <div className={`p-2 rounded-xl border ${item.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Main Value */}
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

            {/* Footer row: Trend & Subtitle / Progress */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <TrendIcon className={`w-3.5 h-3.5 ${
                    item.trendBad ? 'text-red-400' : 'text-emerald-400'
                  }`} />
                  <span className={`font-medium ${
                    item.trendBad ? 'text-red-400' : 'text-emerald-400'
                  }`}>
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
