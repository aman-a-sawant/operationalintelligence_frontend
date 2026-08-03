import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Terminal, 
  Database, 
  Clock, 
  Users, 
  Cpu, 
  CheckCircle2, 
  Play,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';

export default function IncidentModal({ incident, isOpen, onClose, onExecuteFix }) {
  const [copied, setCopied] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [fixed, setFixed] = useState(false);

  if (!isOpen || !incident) return null;

  const handleApplyFix = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setFixed(true);
      if (onExecuteFix) onExecuteFix(incident.id);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#070E27] border border-red-500/30 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/20 text-red-400 border border-red-500/40">
                  {incident.severity || 'Critical'} Incident
                </span>
                <span className="text-xs text-slate-400">ID: INC-84920</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {incident.title || 'Checkout Service Degradation'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Impacted Service</span>
              <div className="text-sm font-bold text-white mt-0.5">{incident.service || 'Checkout API'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Users Impacted</span>
              <div className="text-sm font-bold text-orange-400 mt-0.5">{incident.users || '12,643 users'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Current Status</span>
              <div className="text-sm font-bold text-red-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                {fixed ? 'Mitigated' : (incident.status || 'Active')}
              </div>
            </div>
          </div>

          {/* Trace Stack Trace Logs */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              Stack Trace & Error Snippet
            </span>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-red-300 leading-relaxed overflow-x-auto">
              <div>[ERROR] 2026-07-29T17:14:02Z - OrderService.java:142</div>
              <div className="text-slate-400">org.postgresql.util.PSQLException: ERROR: canceling statement due to lock timeout</div>
              <div className="text-slate-400">  at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2675)</div>
              <div className="text-purple-300 font-bold mt-1">→ Query: SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC (Duration: 4281ms)</div>
            </div>
          </div>

          {/* Recommended Hotfix Script */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              AI Recommended Remediation Action
            </span>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-3">
              <div className="text-xs text-slate-300">
                Execute concurrent database index migration to resolve sequential scans:
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
                <code>CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders (user_id);</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders (user_id);");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Close
          </button>

          <button
            onClick={handleApplyFix}
            disabled={executing || fixed}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
              fixed
                ? 'bg-emerald-600 shadow-emerald-600/30'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30'
            }`}
          >
            {executing ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Executing Automated Hotfix...</span>
              </>
            ) : fixed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Hotfix Applied & Verified!</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Apply Automated Hotfix</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
