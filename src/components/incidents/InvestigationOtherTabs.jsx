import React, { useState } from 'react';
import { 
  Clock, 
  GitCommit, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  Server, 
  Zap, 
  ArrowDown, 
  Layers, 
  FileText, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Bot, 
  Check, 
  Play, 
  RotateCcw,
  Sliders,
  ShieldCheck
} from 'lucide-react';

/* ----------------------------------------------------
 * 1. TIMELINE TAB COMPONENT
 * ---------------------------------------------------- */
export function TimelineTab() {
  const events = [
    { time: '10:20 AM', title: 'Deployment v2.4.1 Released', desc: 'Author: Alex Rivera • Commit #84a19c (Added payment transaction filter)', tag: 'Deployment', color: 'border-purple-500 text-purple-300' },
    { time: '10:24 AM', title: 'Error Rate Spike Detected', desc: 'Checkout API 5xx errors reached 15.6% (Threshold > 5.0%)', tag: 'Alert', color: 'border-red-500 text-red-400' },
    { time: '10:25 AM', title: 'AI Investigator Agent Triggered', desc: 'OPINTEL Davis AI initiated multi-service trace correlation', tag: 'AI Engine', color: 'border-purple-400 text-purple-300' },
    { time: '10:28 AM', title: 'Root Cause Identified', desc: 'Database connection pool exhaustion detected on postgres-primary', tag: 'Root Cause', color: 'border-orange-500 text-orange-400' },
    { time: '10:31 AM', title: 'Automated Remediation Recommended', desc: 'Scale DB pool from 50 to 100 & restart pod pool', tag: 'Recommendation', color: 'border-blue-500 text-blue-400' },
    { time: '10:32 AM', title: 'Auto Remediation Executed', desc: 'Postgres connection pool updated to 100 via Kubernetes Operator', tag: 'Remediation', color: 'border-emerald-500 text-emerald-400' },
    { time: '10:38 AM', title: 'Error Rate Normalized', desc: 'Checkout API error rate dropped below 2.0%', tag: 'Recovery', color: 'border-emerald-400 text-emerald-300' },
    { time: '10:40 AM', title: 'Incident Marked Resolved', desc: 'All microservices back to Healthy state. RCA report generated.', tag: 'Resolved', color: 'border-emerald-500 text-emerald-400' },
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Detailed Incident Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Chronological record of telemetry events and automated AI actions</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-slate-300">
          8 Events Logged
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((evt, i) => (
          <div key={i} className="relative group">
            {/* Timeline Dot */}
            <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#050B1F] border-2 ${evt.color} shadow-sm group-hover:scale-125 transition-transform`} />

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-300">{evt.time}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${evt.color}`}>
                  {evt.tag}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
                {evt.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{evt.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------
 * 2. EVIDENCE TAB COMPONENT
 * ---------------------------------------------------- */
export function EvidenceTab() {
  const telemetryLogs = [
    { time: '10:24:02 AM', service: 'checkout-api', type: 'Error Log', msg: 'PSQLException: FATAL: sorry, too many clients already (50/50 max connections)' },
    { time: '10:24:15 AM', service: 'order-service', type: 'Trace Span', msg: 'HTTP POST /api/v2/orders timeout after 5000ms waiting for DB connection' },
    { time: '10:25:01 AM', service: 'postgres-primary', type: 'DB Metric', msg: 'Active connection pool saturation reached 100% (50/50 connections occupied)' },
    { time: '10:26:12 AM', service: 'payment-service', type: 'Query Log', msg: 'SELECT * FROM payment_transactions WHERE status = $1 ORDER BY created_at DESC (4281ms)' },
    { time: '10:27:44 AM', service: 'checkout-api', type: 'HTTP Metric', msg: '503 Service Unavailable spike to 15.6% of overall checkout traffic' },
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Correlated Evidence & Telemetry Logs
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Logs, spans, and metric anomalies captured by AI Investigator</p>
        </div>
      </div>

      <div className="space-y-3">
        {telemetryLogs.map((log, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-purple-400 font-bold">{log.time} • [{log.service}]</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px] uppercase font-sans font-semibold">
                {log.type}
              </span>
            </div>
            <p className="text-red-300 font-semibold">{log.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------
 * 3. RELATED SERVICES TAB (DEPENDENCY MAP)
 * ---------------------------------------------------- */
export function ServicesTab() {
  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Service Dependency Map
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Interactive microservice topology and live error propagation path</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
          Live Tracing Active
        </span>
      </div>

      {/* Animated Flow Graph */}
      <div className="p-8 rounded-3xl bg-slate-950/80 border border-purple-500/20 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
            <Server className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-white">Checkout API</div>
          <div className="text-xs text-red-400 font-bold">15.6% Errors (Critical)</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-white">Order Service</div>
          <div className="text-xs text-amber-400 font-bold">Latency 1,840ms</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/40">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-white">Payment Service</div>
          <div className="text-xs text-orange-400 font-bold">6.2% Errors (Warning)</div>
        </div>

        <div className="p-5 rounded-2xl bg-red-950/60 border border-red-500/50 text-center space-y-2 shadow-lg shadow-red-500/20 animate-pulse">
          <div className="w-10 h-10 mx-auto rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
            <Database className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-white">Database Primary</div>
          <div className="text-xs text-red-400 font-bold">DB Pool Saturation</div>
        </div>

      </div>
    </div>
  );
}

/* ----------------------------------------------------
 * 4. DEPLOYMENTS TAB COMPONENT
 * ---------------------------------------------------- */
export function DeploymentsTab() {
  const [rolledBack, setRolledBack] = useState(false);

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-purple-400" />
            Deployment Correlation Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Correlating release v2.4.1 with incident detection timeframe</p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">Deployment v2.4.1</span>
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono text-xs">
                #84a19c
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Author: Alex Rivera • Deployed at May 24, 10:20 AM (4 mins prior to incident)</p>
          </div>

          <button
            onClick={() => setRolledBack(true)}
            disabled={rolledBack}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              rolledBack ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
            }`}
          >
            {rolledBack ? 'Rolled Back to v2.4.0 ✓' : 'Rollback Deployment v2.4.1'}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
          <div className="text-purple-400">+ Added new payment transaction audit query in PaymentService.java</div>
          <div className="text-red-400">- Omitted index migration script #1042-add-index</div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
 * 5. RUNBOOK TAB COMPONENT
 * ---------------------------------------------------- */
export function RunbookTab() {
  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            Automated Incident Response Runbook
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Automated remediation playbook execution status</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Step 1: Auto-Scale DB Connection Pool</div>
              <div className="text-[11px] text-slate-400">Increased max connection pool size from 50 to 100 via operator</div>
            </div>
          </div>
          <span className="font-bold text-emerald-400">Completed (10:32 AM)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Step 2: Restart Checkout API Pod Pool</div>
              <div className="text-[11px] text-slate-400">Cleared stale HTTP connection pool threads across 6 pods</div>
            </div>
          </div>
          <span className="font-bold text-emerald-400">Completed (10:33 AM)</span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
 * 6. AI ANALYSIS TAB COMPONENT
 * ---------------------------------------------------- */
export function AIAnalysisTab() {
  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            AIOps Investigator Agent Reasoning
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Multi-layer correlation engine breakdown with 96% confidence score</p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-950/80 border border-purple-500/30 text-xs text-slate-300 space-y-4 leading-relaxed">
        <p>
          <strong className="text-purple-300">AIOps Reasoning Engine:</strong> Correlated 18,400 distributed spans, 4,200 log messages, and database connection telemetry. Detected index omission in release <code className="text-purple-300 font-mono">v2.4.1</code> causing table lockups.
        </p>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="font-bold text-white">Confidence Breakdown:</div>
          <div className="flex justify-between text-slate-400">
            <span>Trace Latency Match</span>
            <span className="text-emerald-400 font-bold">98%</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Deploy Commit Correlation</span>
            <span className="text-purple-300 font-bold">95%</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Log Pattern Anomaly</span>
            <span className="text-blue-400 font-bold">94%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
