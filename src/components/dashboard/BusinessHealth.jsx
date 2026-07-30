import React from 'react';
import { 
  GitMerge, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  TrendingDown
} from 'lucide-react';

export default function BusinessHealth({ onViewJourneys }) {
  const score = 72;
  // Circumference for r=54 circle is 2 * PI * 54 ≈ 339.29
  const circumference = 339.29;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const journeys = [
    { name: 'User Checkout & Payment', status: 'Critical', score: '42%' },
    { name: 'Account Registration', status: 'Healthy', score: '99%' },
    { name: 'Subscription Renewal', status: 'At Risk', score: '68%' },
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between h-full hover:border-slate-700/80 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Business Health Score</h3>
              <p className="text-[11px] text-slate-400">Composite SLA & Flow Metric</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
            At Risk
          </span>
        </div>

        {/* Large Radial Gauge Chart */}
        <div className="my-5 flex flex-col items-center justify-center relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-44 h-44 transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="88"
                cy="88"
                r="64"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-800/80"
                fill="transparent"
              />
              {/* Glowing Progress Arc */}
              <circle
                cx="88"
                cy="88"
                r="64"
                stroke="currentColor"
                strokeWidth="12"
                className="text-orange-400 transition-all duration-1000 ease-out"
                fill="transparent"
                strokeDasharray="402.12"
                strokeDashoffset={402.12 - (72 / 100) * 402.12}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white tracking-tight text-glow-orange">
                72<span className="text-lg text-slate-400 font-normal">/100</span>
              </span>
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider mt-0.5">
                AT RISK
              </span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <p className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              3 business journeys impacted.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Checkout & Payment journey experiencing highest latency degradation.
            </p>
          </div>
        </div>

        {/* Journey Mini List */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          {journeys.map((j) => (
            <div key={j.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900/40">
              <span className="text-slate-300 font-medium">{j.name}</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                j.status === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                j.status === 'At Risk' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {j.score} - {j.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="pt-4 mt-4 border-t border-slate-800/80">
        <button
          onClick={onViewJourneys}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2 group"
        >
          <span>View Business Journey</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
