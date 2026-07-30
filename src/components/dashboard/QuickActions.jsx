import React from 'react';
import { 
  ShieldAlert, 
  Bot, 
  GitMerge, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Sliders
} from 'lucide-react';

export default function QuickActions({ onInvestigate, onOpenCopilot, onViewJourneys }) {
  const actions = [
    {
      title: 'Investigate Incident',
      desc: 'Launch deep-dive telemetry diagnostics & trace analysis',
      icon: ShieldAlert,
      gradient: 'from-red-600/30 via-rose-600/20 to-transparent border-red-500/30 hover:border-red-500/60',
      iconBg: 'bg-red-500/20 text-red-400 border-red-500/40',
      buttonText: 'Start Investigation',
      onClick: onInvestigate
    },
    {
      title: 'Ask AI Copilot',
      desc: 'Get immediate AI root-cause analysis & remediation code',
      icon: Bot,
      gradient: 'from-purple-600/30 via-indigo-600/20 to-transparent border-purple-500/30 hover:border-purple-500/60',
      iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      buttonText: 'Open Copilot Chat',
      onClick: onOpenCopilot,
      badge: 'PRO'
    },
    {
      title: 'View Business Journey',
      desc: 'Analyze end-to-end user conversion & revenue funnel health',
      icon: GitMerge,
      gradient: 'from-blue-600/30 via-cyan-600/20 to-transparent border-blue-500/30 hover:border-blue-500/60',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      buttonText: 'Inspect Journeys',
      onClick: onViewJourneys
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between h-full hover:border-slate-700/80 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Quick Actions</h3>
              <p className="text-[11px] text-slate-400">Automated Remediation & Analysis</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
        </div>

        {/* Action Cards */}
        <div className="mt-4 space-y-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.title}
                onClick={act.onClick}
                className={`p-4 rounded-2xl bg-gradient-to-r ${act.gradient} border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${act.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs lg:text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                          {act.title}
                        </h4>
                        {act.badge && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 border border-purple-500/40">
                            {act.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {act.desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white pt-2 border-t border-slate-800/40">
                  <span>{act.buttonText}</span>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 text-center">
        <span className="text-[10px] text-slate-500">
          Click any action to execute operational workflow
        </span>
      </div>

    </div>
  );
}
