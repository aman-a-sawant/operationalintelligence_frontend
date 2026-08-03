import React from 'react';
import { Activity, Heart, CheckCircle, BarChart3 } from 'lucide-react';

export default function Step4MonitoringEndpoints({ formData = {}, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>Monitoring & Health Probe Targets</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Specify standard observability paths for automated health probing, kubernetes readiness checks, and Prometheus metrics scraping.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Health Endpoint */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wide">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span>Health Endpoint</span>
            </label>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Liveness Probe
            </span>
          </div>
          <input
            type="text"
            value={formData.health || ''}
            onChange={(e) => handleChange('health', e.target.value)}
            placeholder="/health (optional)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500/60 outline-none transition-all font-mono"
          />
          <p className="text-[11px] text-slate-400">
            Optional path returning HTTP 200 when application is alive.
          </p>
        </div>

        {/* Readiness Endpoint */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wide">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Readiness Endpoint</span>
            </label>
            <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
              Traffic Ready
            </span>
          </div>
          <input
            type="text"
            value={formData.readiness || ''}
            onChange={(e) => handleChange('readiness', e.target.value)}
            placeholder="/ready (optional)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500/60 outline-none transition-all font-mono"
          />
          <p className="text-[11px] text-slate-400">
            Optional path returning HTTP 200 when service is traffic ready.
          </p>
        </div>

        {/* Metrics Endpoint */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wide">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Metrics Endpoint</span>
            </label>
            <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
              MELTS Metrics
            </span>
          </div>
          <input
            type="text"
            value={formData.metrics || ''}
            onChange={(e) => handleChange('metrics', e.target.value)}
            placeholder="/metrics (optional)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500/60 outline-none transition-all font-mono"
          />
          <p className="text-[11px] text-slate-400">
            Optional Prometheus format metrics endpoint for MELTS ingestion.
          </p>
        </div>
      </div>
    </div>
  );
}
