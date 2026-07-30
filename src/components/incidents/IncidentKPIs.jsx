import React from 'react';
import { 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const kpis = [
  {
    id: 'total',
    title: 'Total Incidents',
    value: '28',
    trend: '↑ 12 vs yesterday',
    trendType: 'neutral',
    icon: FileText,
    iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    borderColor: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
    valueColor: 'text-white'
  },
  {
    id: 'critical',
    title: 'Critical',
    value: '4',
    trend: '↑ 2 vs yesterday',
    trendType: 'negative',
    icon: AlertTriangle,
    iconBg: 'bg-red-500/15 text-red-400 border-red-500/30',
    borderColor: 'hover:border-red-500/50 hover:shadow-red-500/15',
    valueColor: 'text-red-400 text-glow-red'
  },
  {
    id: 'high',
    title: 'High',
    value: '9',
    trend: '↑ 3 vs yesterday',
    trendType: 'warning',
    icon: TrendingUp,
    iconBg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    borderColor: 'hover:border-orange-500/50 hover:shadow-orange-500/15',
    valueColor: 'text-orange-400'
  },
  {
    id: 'resolved',
    title: 'Resolved',
    value: '15',
    trend: '↓ 5 vs yesterday',
    trendType: 'positive',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    borderColor: 'hover:border-emerald-500/50 hover:shadow-emerald-500/15',
    valueColor: 'text-emerald-400'
  },
  {
    id: 'mttr',
    title: 'MTTR',
    value: '42m',
    trend: '↓ 8m vs yesterday',
    trendType: 'positive',
    icon: Clock,
    iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    borderColor: 'hover:border-blue-500/50 hover:shadow-blue-500/15',
    valueColor: 'text-blue-400'
  }
];

export default function IncidentKPIs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.id}
            className={`glass-panel rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 ${kpi.borderColor} group relative overflow-hidden`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Background shimmer */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            {/* Icon Box */}
            <div className={`p-3 rounded-2xl border ${kpi.iconBg} shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                {kpi.title}
              </span>
              <div className={`text-2xl lg:text-3xl font-extrabold tracking-tight mt-0.5 ${kpi.valueColor}`}>
                {kpi.value}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-medium">
                <span className={
                  kpi.trendType === 'negative' ? 'text-red-400 font-bold' :
                  kpi.trendType === 'warning' ? 'text-orange-400 font-bold' :
                  kpi.trendType === 'positive' ? 'text-emerald-400 font-bold' :
                  'text-red-400'
                }>
                  {kpi.trend}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
