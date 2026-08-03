import React from 'react';
import { 
  AlertTriangle, 
  FileText, 
  Database, 
  DollarSign, 
  UserCheck, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Cpu
} from 'lucide-react';

const pipelineSteps = [
  {
    step: 1,
    title: 'Problem',
    desc: 'Checkout failures increased',
    time: '10:24 AM',
    icon: AlertTriangle,
    iconBg: 'bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/20',
    borderColor: 'border-red-500/30 hover:border-red-500/60',
    statusDot: 'bg-red-500 animate-ping'
  },
  {
    step: 2,
    title: 'Evidence',
    desc: 'High DB response time & timeouts',
    time: '10:25 AM',
    icon: FileText,
    iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/20',
    borderColor: 'border-purple-500/30 hover:border-purple-500/60',
    statusDot: 'bg-purple-400'
  },
  {
    step: 3,
    title: 'Root Cause',
    desc: 'Database connection pool exhaustion',
    time: '10:28 AM',
    icon: Database,
    iconBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-orange-500/20',
    borderColor: 'border-orange-500/30 hover:border-orange-500/60',
    statusDot: 'bg-orange-400'
  },
  {
    step: 4,
    title: 'Business Impact',
    desc: 'Revenue loss & failed transactions',
    time: '10:29 AM',
    icon: DollarSign,
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
    statusDot: 'bg-emerald-400'
  },
  {
    step: 5,
    title: 'Recommendation',
    desc: 'Increase DB pool size & optimize queries',
    time: '10:31 AM',
    icon: UserCheck,
    iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-blue-500/20',
    borderColor: 'border-blue-500/30 hover:border-blue-500/60',
    statusDot: 'bg-blue-400'
  },
  {
    step: 6,
    title: 'Auto Remediation',
    desc: 'DB pool scaled automatically',
    time: '10:32 AM',
    icon: Zap,
    iconBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-teal-500/20',
    borderColor: 'border-teal-500/30 hover:border-teal-500/60',
    statusDot: 'bg-teal-400'
  }
];

export default function AIInvestigationPipeline() {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-3">
      
      {/* Header title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          AI Investigator Autonomous Pipeline
        </span>
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
          Correlated 6 Telemetry Datasets
        </span>
      </div>

      {/* 6 Step Horizontal Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 relative">
        {pipelineSteps.map((stepItem, index) => {
          const Icon = stepItem.icon;
          const isLast = index === pipelineSteps.length - 1;

          return (
            <div key={stepItem.step} className="flex items-center gap-2 relative group">
              
              {/* Step Card */}
              <div className={`flex-1 p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border ${stepItem.borderColor} transition-all duration-300 hover:-translate-y-0.5 shadow-md flex flex-col justify-between h-full`}>
                
                {/* Top Row: Icon + Checkmark */}
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2 rounded-lg border ${stepItem.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex h-2 w-2 relative">
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${stepItem.statusDot}`} />
                  </span>
                </div>

                {/* Body Content */}
                <div className="my-2">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors">
                    {stepItem.title}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight font-medium line-clamp-2">
                    {stepItem.desc}
                  </p>
                </div>

                {/* Footer Time */}
                <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
                  {stepItem.time}
                </div>

              </div>

              {/* Glowing Arrow Connector for desktop */}
              {!isLast && (
                <div className="hidden lg:flex items-center text-slate-600 group-hover:text-purple-400 transition-colors shrink-0 -mx-1 z-10">
                  <ArrowRight className="w-4 h-4 text-purple-500/60 animate-pulse" />
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
