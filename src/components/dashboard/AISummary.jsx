import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  AlertCircle, 
  Database, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  Play, 
  Zap,
  Layers,
  ChevronRight,
  ExternalLink,
  Cpu,
  Globe
} from 'lucide-react';

export default function AISummary({ onInvestigate, onOpenCopilot }) {
  const [activeInsightTab, setActiveInsightTab] = useState('what');

  const insightTabs = [
    { id: 'what', label: '1. What Happened?' },
    { id: 'why', label: '2. Why?' },
    { id: 'who', label: '3. Who Is Affected?' },
    { id: 'action', label: '4. What Should I Do?' },
  ];

  return (
    <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 relative overflow-hidden transition-all duration-300">
      
      {/* Subtle Background Glow Spheres */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/25 border border-purple-400/40">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 tracking-wide flex items-center gap-1.5 shadow-sm shadow-red-500/20 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                PRIORITY: CRITICAL
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                AI Auto-Diagnosed
              </span>
            </div>
            
            <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight mt-2 text-glow-purple">
              Checkout Service Degradation Causing Payment Failures
            </h2>
          </div>
        </div>

        {/* AI Confidence Metric (Right Top / Mobile top right) */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-purple-400"
                fill="transparent"
                strokeDasharray="100"
                strokeDashoffset="8"
              />
            </svg>
            <span className="absolute text-[11px] font-extrabold text-purple-300">92%</span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">AI Confidence</div>
            <div className="text-[11px] text-slate-400">High Precision Model</div>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Summary</span>
            <p className="text-xs lg:text-sm font-medium text-slate-200 mt-1">
              Checkout Service experiencing elevated latency (4.2s avg) and payment failures.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          <Database className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Root Cause</span>
            <p className="text-xs lg:text-sm font-medium text-slate-200 mt-1">
              Order Service database queries missing index on <code className="text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded font-mono text-xs">user_id</code>.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          <Users className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Business Impact</span>
            <p className="text-xs lg:text-sm font-medium text-slate-200 mt-1">
              <span className="text-orange-400 font-bold">12,643 users</span> impacted, estimated revenue impact of $248K.
            </p>
          </div>
        </div>
      </div>

      {/* Service Flow Diagram (Interactive Animated Nodes) */}
      <div className="my-8 p-6 rounded-2xl bg-slate-950/70 border border-purple-500/20 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Impacted Service Flow Topology
          </span>
          <span className="text-[11px] text-slate-400">Live Tracing Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center relative">
          
          {/* Node 1: User */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-center relative group hover:border-blue-500/50 transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/30 mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">User</div>
            <div className="text-[11px] text-emerald-400 font-medium">100% Traffic</div>
          </div>

          {/* Node 2: Checkout Service */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-center relative group hover:border-amber-400 transition-all shadow-lg shadow-amber-500/10">
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">Checkout Service</div>
            <div className="text-[11px] text-amber-400 font-bold">Latency 4.2s (Degraded)</div>
          </div>

          {/* Node 3: Order Service */}
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/50 text-center relative group hover:border-red-400 transition-all shadow-lg shadow-red-500/20 animate-pulse">
            <div className="w-10 h-10 mx-auto rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40 mb-2">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">Order Service</div>
            <div className="text-[11px] text-red-400 font-bold">Query Lock (Critical)</div>
          </div>

          {/* Node 4: Database */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/40 text-center relative group hover:border-purple-400 transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/30 mb-2">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">Database</div>
            <div className="text-[11px] text-purple-300 font-medium">Missing Index</div>
          </div>

        </div>
      </div>

      {/* Four Insight Tabs */}
      <div className="space-y-4">
        {/* Tab Selection Row */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-2">
          {insightTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveInsightTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${
                activeInsightTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-sm text-slate-300 min-h-[100px] flex items-center">
          {activeInsightTab === 'what' && (
            <div className="space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Spike in 5xx HTTP Errors & Response Latency
              </div>
              <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
                At 17:14:02 UTC, automated health checks detected an elevated error rate exceeding 14.2% on the checkout endpoint <code className="text-blue-300 bg-blue-950/60 px-1.5 py-0.5 rounded font-mono text-xs">/api/v2/checkout/process</code>. Average response latency spiked from 140ms to 4,280ms.
              </p>
            </div>
          )}

          {activeInsightTab === 'why' && (
            <div className="space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-red-400" />
                Full Table Scan on Postgres Cluster #03
              </div>
              <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
                Telemetry analysis identified that deploy <code className="text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded font-mono text-xs">v4.18.2</code> omitted a database index migration. Subsequent user queries triggered full table sequential scans on the <code className="text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded font-mono text-xs">orders</code> table, exhausting the DB connection pool.
              </p>
            </div>
          )}

          {activeInsightTab === 'who' && (
            <div className="space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-400" />
                12,643 Active Checkout Sessions (US-East & EU-West)
              </div>
              <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
                Approximately 12,643 users attempting web and mobile checkout within the past 45 minutes experienced payment gateway timeouts or failed transaction retries.
              </p>
            </div>
          )}

          {activeInsightTab === 'action' && (
            <div className="space-y-2">
              <div className="font-semibold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Recommended Automated Remediation Steps
              </div>
              <ul className="text-xs lg:text-sm text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Apply hotfix index migration: <code className="text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono text-xs">CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);</code></li>
                <li>Temporarily scale Order Service replica pods from 6 to 14.</li>
                <li>Reroute 20% traffic to secondary read replicas.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          <button
            onClick={onInvestigate}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs lg:text-sm font-bold shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Investigate Incident</span>
          </button>

          <button
            onClick={onOpenCopilot}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs lg:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Copilot</span>
          </button>

        </div>

        <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <span>AI Model: OPINTEL-v4-Agent</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          <span className="text-purple-300">Confidence 92%</span>
        </div>
      </div>

    </div>
  );
}
