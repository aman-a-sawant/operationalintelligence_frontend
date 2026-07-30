import React from 'react';
import { Server, Activity, CheckCircle, AlertTriangle, ArrowUpRight, Search } from 'lucide-react';

const services = [
  {
    name: 'Checkout Service',
    health: 42,
    status: 'Degraded',
    latency: '4.2s',
    requests: '14.2k/m',
    statusColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    dotColor: 'bg-red-500 animate-pulse',
    barColor: 'bg-red-500'
  },
  {
    name: 'Order Service',
    health: 55,
    status: 'Degraded',
    latency: '1.8s',
    requests: '22.8k/m',
    statusColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    dotColor: 'bg-orange-400',
    barColor: 'bg-orange-500'
  },
  {
    name: 'Payment Service',
    health: 98,
    status: 'Healthy',
    latency: '120ms',
    requests: '11.4k/m',
    statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    dotColor: 'bg-emerald-400',
    barColor: 'bg-emerald-500'
  },
  {
    name: 'User Service',
    health: 99,
    status: 'Healthy',
    latency: '45ms',
    requests: '48.9k/m',
    statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    dotColor: 'bg-emerald-400',
    barColor: 'bg-emerald-500'
  },
  {
    name: 'Inventory Service',
    health: 96,
    status: 'Healthy',
    latency: '95ms',
    requests: '8.1k/m',
    statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    dotColor: 'bg-emerald-400',
    barColor: 'bg-emerald-500'
  }
];

export default function ServiceOverview() {
  return (
    <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between h-full hover:border-slate-700/80 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Service Health Overview</h3>
              <p className="text-[11px] text-slate-400">28 / 35 Services Operational</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Realtime SLA
          </span>
        </div>

        {/* Services Table List */}
        <div className="mt-4 space-y-3">
          {services.map((svc) => (
            <div
              key={svc.name}
              className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/50 transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${svc.dotColor}`} />
                  <span className="text-xs lg:text-sm font-semibold text-white">
                    {svc.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-white">
                    {svc.health}%
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${svc.statusColor}`}>
                    {svc.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar & Telemetry Details */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${svc.barColor} transition-all duration-700`}
                    style={{ width: `${svc.health}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Latency: {svc.latency}</span>
                  <span>RPS: {svc.requests}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 text-center">
        <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1 w-full">
          <span>Explore All 35 Microservices</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
