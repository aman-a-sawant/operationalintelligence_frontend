import React from 'react';
import { Globe, Server, Database, CheckSquare, Square, ShieldCheck } from 'lucide-react';

export default function Step2SelectComponents({ selectedComponents = { frontend: true, backend: true, database: false }, onChange }) {
  const toggleComponent = (key) => {
    onChange({
      ...selectedComponents,
      [key]: !selectedComponents[key]
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-purple-400" />
          <span>Select Application Components</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Specify which architecture layers exist in this project. OPINTEL will dynamically tailor the onboarding flow and probe targets accordingly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Frontend Checkbox Card */}
        <div
          onClick={() => toggleComponent('frontend')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
            selectedComponents.frontend
              ? 'bg-blue-950/30 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className={`w-5 h-5 ${selectedComponents.frontend ? 'text-blue-400' : 'text-slate-500'}`} />
              <h4 className="font-bold text-sm text-white">Frontend Application</h4>
            </div>
            {selectedComponents.frontend ? (
              <CheckSquare className="w-5 h-5 text-blue-400 shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-slate-600 shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Web client application (React, Next.js, Vue, Angular) requiring URL reachability and liveness probing.
          </p>
          <span className="text-[10px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 w-max">
            Web Tier
          </span>
        </div>

        {/* Backend Checkbox Card */}
        <div
          onClick={() => toggleComponent('backend')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
            selectedComponents.backend
              ? 'bg-purple-950/30 border-purple-500 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className={`w-5 h-5 ${selectedComponents.backend ? 'text-purple-400' : 'text-slate-500'}`} />
              <h4 className="font-bold text-sm text-white">Backend Application</h4>
            </div>
            {selectedComponents.backend ? (
              <CheckSquare className="w-5 h-5 text-purple-400 shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-slate-600 shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            API Server or Gateway (Node.js, Spring, Go, Python) exposing /health, /ready, and /metrics endpoints.
          </p>
          <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 w-max">
            API Tier
          </span>
        </div>

        {/* Database Checkbox Card (OPTIONAL) */}
        <div
          onClick={() => toggleComponent('database')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
            selectedComponents.database
              ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className={`w-5 h-5 ${selectedComponents.database ? 'text-emerald-400' : 'text-slate-500'}`} />
              <h4 className="font-bold text-sm text-white">Database Cluster</h4>
            </div>
            {selectedComponents.database ? (
              <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-slate-600 shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            PostgreSQL, MongoDB, MySQL, Redis, or SQL Server. Host & metadata only (no passwords).
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              Data Tier
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Optional
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span className="text-slate-300">Selected Layers:</span>
          <strong className="text-white">
            {[
              selectedComponents.frontend && 'Frontend',
              selectedComponents.backend && 'Backend',
              selectedComponents.database && 'Database'
            ].filter(Boolean).join(' + ') || 'Custom Telemetry'}
          </strong>
        </div>
        <span className="text-slate-400">Step onboarding dynamically updates based on selections.</span>
      </div>
    </div>
  );
}
