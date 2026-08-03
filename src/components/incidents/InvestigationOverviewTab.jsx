import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { 
  Bot, 
  Sparkles, 
  AlertCircle, 
  Database, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  FileText, 
  Sliders, 
  ChevronRight, 
  Zap, 
  AlertTriangle,
  Play,
  RotateCcw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const chartData = [
  { time: '10:15 AM', errorRate: 2.1, latencyP95: 140, dbConnections: 25 },
  { time: '10:20 AM', errorRate: 2.3, latencyP95: 155, dbConnections: 28, annotation: 'Deployment v2.4.1' },
  { time: '10:24 AM', errorRate: 14.8, latencyP95: 1840, dbConnections: 48, annotation: 'Issue Detected' },
  { time: '10:25 AM', errorRate: 15.6, latencyP95: 4280, dbConnections: 50 },
  { time: '10:28 AM', errorRate: 16.2, latencyP95: 4410, dbConnections: 50, annotation: 'Root Cause Discovered' },
  { time: '10:30 AM', errorRate: 15.1, latencyP95: 3950, dbConnections: 50 },
  { time: '10:32 AM', errorRate: 7.4, latencyP95: 1200, dbConnections: 42, annotation: 'Mitigated' },
  { time: '10:35 AM', errorRate: 3.2, latencyP95: 480, dbConnections: 35 },
  { time: '10:40 AM', errorRate: 2.4, latencyP95: 180, dbConnections: 30 },
  { time: '10:45 AM', errorRate: 2.1, latencyP95: 150, dbConnections: 27 },
  { time: '10:50 AM', errorRate: 2.0, latencyP95: 145, dbConnections: 26 },
  { time: '10:55 AM', errorRate: 2.0, latencyP95: 142, dbConnections: 25 },
  { time: '11:00 AM', errorRate: 1.9, latencyP95: 140, dbConnections: 25 },
];

export default function InvestigationOverviewTab({ onSelectTab, onOpenCopilot }) {
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const evidenceList = [
    { title: 'High DB response time', time: '10:24 AM', icon: Database },
    { title: 'DB connection timeout errors', time: '10:24 AM', icon: AlertTriangle },
    { title: 'Connection pool exhausted', time: '10:25 AM', icon: Layers },
    { title: 'Slow query: payment_transactions', time: '10:26 AM', icon: FileText },
    { title: 'Thread pool queue growing', time: '10:26 AM', icon: Clock },
    { title: 'Checkout API errors', time: '10:27 AM', icon: AlertCircle },
    { title: 'Failed transactions spike', time: '10:27 AM', icon: DollarSign },
    { title: 'Auto scaling triggered', time: '10:32 AM', icon: Zap },
  ];

  return (
    <div className="space-y-6">
      
      {/* ROW 1: AI SUMMARY + METRICS CHART + AFFECTED SERVICES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT PANEL: AI Summary Beta Card (4 Cols) */}
        <div className="lg:col-span-4 glass-panel-glow p-5 rounded-3xl flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-base">AI Summary</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                BETA
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed my-4">
              Starting at 10:24 AM, Checkout API error rate spiked to <strong className="text-red-400">15.6%</strong> after deployment <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded font-mono text-[11px]">v2.4.1</code>. Database connection pool exhausted due to long-running queries in <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded font-mono text-[11px]">payment_transactions</code> table. This caused request timeouts and failures.
            </p>

            {/* AI Summary Metrics List */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
              
              <div className="flex items-start justify-between">
                <span className="text-slate-400 font-medium">Root Cause</span>
                <span className="text-right font-bold text-purple-300 max-w-[60%]">
                  Database connection pool exhaustion
                </span>
              </div>

              {/* Confidence Meter */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-purple-300 font-extrabold">96%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full w-[96%]" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Impact</span>
                <span className="font-bold text-slate-200">Revenue loss of <strong className="text-red-400">$28,450</strong></span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Affected Users</span>
                <span className="font-bold text-orange-400">824</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Time to Detect</span>
                <span className="font-bold text-slate-200">45s</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Time to Mitigate</span>
                <span className="font-bold text-emerald-400">8m 12s</span>
              </div>

            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <button
              onClick={onOpenCopilot}
              className="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Ask AI Copilot for Full Diagnosis</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* CENTER PANEL: Key Metrics During Incident (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl flex flex-col justify-between h-full">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <h3 className="font-bold text-white text-base">Key Metrics During Incident</h3>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                May 24, 10:15 AM – 11:00 AM
              </span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 my-3 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                Error Rate (%)
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                Latency P95 (ms)
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                DB Connections
              </span>
            </div>

            {/* Recharts Visualization */}
            <div className="h-64 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                  <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070E27',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#F8FAFC'
                    }}
                  />
                  <ReferenceLine x="10:20 AM" stroke="#8B5CF6" strokeDasharray="3 3" label={{ value: 'Deploy', fill: '#8B5CF6', fontSize: 10 }} />
                  <ReferenceLine x="10:24 AM" stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Detected', fill: '#EF4444', fontSize: 10 }} />
                  <ReferenceLine x="10:32 AM" stroke="#22C55E" strokeDasharray="3 3" label={{ value: 'Mitigated', fill: '#22C55E', fontSize: 10 }} />
                  
                  <Line type="monotone" dataKey="errorRate" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="dbConnections" stroke="#2563EB" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Markers: Deploy v2.4.1 → Issue → Root Cause → Mitigated</span>
            <span className="text-purple-300 font-semibold">1-sec telemetry grain</span>
          </div>
        </div>

        {/* RIGHT PANEL: Affected Services & Journey (3 Cols) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
          
          {/* Affected Services Card */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h3 className="font-bold text-white text-sm">Affected Services</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                3 Total
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    Checkout API
                  </div>
                  <div className="text-[11px] text-red-400 font-semibold">15.6% error rate</div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  Critical
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
                    Payment API
                  </div>
                  <div className="text-[11px] text-orange-400 font-semibold">6.2% error rate</div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Warning
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-red-400" />
                    Database (Primary)
                  </div>
                  <div className="text-[11px] text-slate-400">High connections</div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  Critical
                </span>
              </div>
            </div>
          </div>

          {/* Related Service Dependencies Card */}
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h3 className="font-bold text-white text-sm">Service Dependencies</h3>
              <button 
                onClick={() => onSelectTab && onSelectTab('Related Services')}
                className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <span>View Dependencies</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-white text-sm">Checkout & Payment System</div>
              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Impact</span>
                  <span className="font-bold text-red-400">High</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Users</span>
                  <span className="font-bold text-orange-400">824</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Revenue</span>
                  <span className="font-bold text-slate-200">$28,450</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ROW 2: EVIDENCE (8) + ROOT CAUSE + RECOMMENDED ACTIONS + QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* CARD 1: EVIDENCE (8) (3 Cols) */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Evidence (8)
              </h3>
              <button 
                onClick={() => onSelectTab && onSelectTab('Evidence')}
                className="text-[11px] font-semibold text-purple-400 hover:text-purple-300"
              >
                View all
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {evidenceList.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={i}
                    onClick={() => setSelectedEvidence(item)}
                    className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 flex items-center justify-between text-xs cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="text-slate-200 truncate group-hover:text-purple-300 transition-colors font-medium">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CARD 2: ROOT CAUSE ANALYSIS (3 Cols) */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-orange-400" />
                Root Cause
              </h3>
              <button 
                onClick={() => onSelectTab && onSelectTab('AI Analysis')}
                className="text-[11px] font-semibold text-purple-400 hover:text-purple-300"
              >
                View Analysis
              </button>
            </div>

            <div className="my-3 space-y-3">
              <div>
                <h4 className="text-xs font-extrabold text-white">
                  Database connection pool exhaustion
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                  All available connections (50) were in use due to long-running queries inside <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded font-mono text-[10px]">payment_transactions</code> table, causing new requests to timeout.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
                  Contributing Factors
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Inefficient query in <code className="text-purple-300 font-mono text-[10px]">payment_transactions</code></li>
                  <li>Missing index on <code className="text-purple-300 font-mono text-[10px]">(status, created_at)</code></li>
                  <li>Sudden traffic increase after deployment</li>
                  <li>Connection pool size too small</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: RECOMMENDED ACTIONS (3 Cols) */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Recommended Actions
              </h3>
              <button 
                onClick={() => onSelectTab && onSelectTab('Runbook')}
                className="text-[11px] font-semibold text-purple-400 hover:text-purple-300"
              >
                View Runbook
              </button>
            </div>

            <div className="my-3 space-y-3 text-xs">
              
              {/* Immediate Automated Actions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
                  Immediate (Automated)
                </span>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Increased DB pool size from 50 to 100
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">Completed</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Restarted Checkout API pods
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">Completed</span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-1 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Next Steps
                </span>
                <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                  <li>Add index on <code className="text-purple-300 font-mono text-[10px]">payment_transactions(status, created_at)</code></li>
                  <li>Optimize slow queries</li>
                  <li>Implement query timeout and limits</li>
                  <li>Increase connection pool size to 150</li>
                </ul>
              </div>

              {/* Preventive Actions */}
              <div className="space-y-1 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Preventive Actions
                </span>
                <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                  <li>Add database performance alerts</li>
                  <li>Implement connection pool monitoring</li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* CARD 4: QUICK ACTIONS (3 Cols) */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
          
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <h3 className="font-bold text-white text-sm border-b border-slate-800/80 pb-2">
              Quick Actions
            </h3>

            <div className="space-y-2">
              <button 
                onClick={() => onSelectTab && onSelectTab('Runbook')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-between group"
              >
                <span>View Runbook</span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => onSelectTab && onSelectTab('Timeline')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-between group"
              >
                <span>Create Incident Record</span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => onSelectTab && onSelectTab('Deployments')}
                className="w-full p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-bold text-purple-300 transition-colors flex items-center justify-between group"
              >
                <span>Execute Remediation</span>
                <Zap className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
              </button>

              <button 
                onClick={() => onSelectTab && onSelectTab('Deployments')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-between group"
              >
                <span>Postmortem Template</span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* BOTTOM CTA BANNER */}
          <div 
            onClick={() => onSelectTab && onSelectTab('Deployments')}
            className="p-5 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/30 hover:border-purple-400 cursor-pointer group transition-all duration-300 shadow-xl flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="font-extrabold text-sm text-white flex items-center gap-2">
                <RocketIcon />
                <span>View Deployment Details</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Click to see deployment history and related info
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </div>

        </div>

      </div>

    </div>
  );
}

function RocketIcon() {
  return (
    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.5 8.5L19 5l-2.5-2.5-3.5 3.5m0 0L4 15v5h5l9-9m-9-9L6 6m12 12l2 2" />
    </svg>
  );
}
