import React from 'react';
import { Globe, Server, CheckCircle2, ShieldCheck, Link2 } from 'lucide-react';

export default function Step2ApplicationDeployments({ formData = {}, onChange }) {
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
          <Globe className="w-5 h-5 text-blue-400" />
          <span>Application Deployment Endpoints</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Provide your production deployment URLs. AppDynamics will use these targets for MELTS health correlation and reachability probing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Frontend URL */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wide">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Frontend Web Application URL</span>
            </label>
            <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
              Web Client
            </span>
          </div>

          <div className="relative">
            <input
              type="url"
              value={formData.frontendUrl || ''}
              onChange={(e) => handleChange('frontendUrl', e.target.value)}
              placeholder="https://app.company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500/60 outline-none transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Target URL where your web frontend application is hosted (e.g. Next.js, Vite, React app).
          </p>
        </div>

        {/* Backend API URL */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wide">
              <Server className="w-4 h-4 text-purple-400" />
              <span>Backend API Server URL</span>
            </label>
            <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
              API Gateway / Server
            </span>
          </div>

          <div className="relative">
            <input
              type="url"
              value={formData.backendUrl || ''}
              onChange={(e) => handleChange('backendUrl', e.target.value)}
              placeholder="https://api.company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-purple-500/60 outline-none transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Primary API gateway or backend service URL used for probing health and readiness endpoints.
          </p>
        </div>
      </div>

      {/* Target Summary Preview */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <span className="font-bold text-white block">Automatic MELTS Target Registration</span>
            <span className="text-slate-400">Deployments will be automatically registered in Organization scope.</span>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          Ready for Probe
        </span>
      </div>
    </div>
  );
}
