import React from 'react';
import { 
  FolderCheck, 
  Server, 
  GitMerge, 
  Cpu, 
  Activity, 
  ShoppingCart, 
  Users, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export default function Step8ReviewAndComplete({ wizardState, isSubmitting, onComplete, onBack }) {
  const { step1, step2, step3, step4, step5, step6, step7 } = wizardState;

  const enabledInfraCount = step4.length;
  const enabledTelemetryCount = step5.filter((i) => i.enabled !== false).length;
  const journeysCount = step6.length;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span>Review & Complete Setup</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Review all configured services, dependencies, infrastructure, telemetry sources, and team members before launching.</p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold self-start sm:self-auto">
          POST /api/project-onboarding/complete
        </span>
      </div>

      {/* Main Project Identity Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <FolderCheck className="w-4 h-4 text-purple-400" />
            Target Onboarding Project
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            {step1.criticality || 'Critical'} Criticality
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white">{step1.name || 'Checkout Platform'}</h2>
          <p className="text-xs text-slate-300 mt-1">{step1.description || 'Customer checkout application'}</p>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Business Domain: <strong className="text-white">{step1.businessDomain || 'E-Commerce'}</strong></span>
          <span>Lead Owner: <strong className="text-white">{step1.owner || 'Payments Team'}</strong></span>
        </div>
      </div>

      {/* Summary Count Breakdown Table */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 p-5 space-y-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Asset Configuration Summary</h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {/* Services Count */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <Server className="w-5 h-5 text-blue-400 mx-auto" />
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Services</span>
            <span className="text-2xl font-extrabold text-white">{step2.length}</span>
          </div>

          {/* Dependencies Count */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <GitMerge className="w-5 h-5 text-amber-400 mx-auto" />
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Dependencies</span>
            <span className="text-2xl font-extrabold text-amber-300">{step3.length}</span>
          </div>

          {/* Infrastructure Count */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <Cpu className="w-5 h-5 text-indigo-400 mx-auto" />
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Infrastructure</span>
            <span className="text-2xl font-extrabold text-indigo-300">{enabledInfraCount}</span>
          </div>

          {/* Telemetry Sources Count */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <Activity className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Telemetry</span>
            <span className="text-2xl font-extrabold text-emerald-400">{enabledTelemetryCount}</span>
          </div>

          {/* Business Journeys Count */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <ShoppingCart className="w-5 h-5 text-amber-400 mx-auto" />
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Journeys</span>
            <span className="text-2xl font-extrabold text-amber-400">{journeysCount}</span>
          </div>

          {/* Team Members Count */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <Users className="w-5 h-5 text-purple-400 mx-auto" />
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Team Members</span>
            <span className="text-2xl font-extrabold text-purple-300">{step7.length}</span>
          </div>
        </div>
      </div>

      {/* Completion Launch Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-extrabold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>All Onboarding Modules Ready For Production Monitoring</span>
        </div>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Submitting setup will execute <code>POST /api/project-onboarding/complete</code> and transition directly to <code>/monitor/project/{step1._id || 'proj_001'}</code>.
        </p>

        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Finalizing Onboarding & Launching...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Complete Setup & Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
