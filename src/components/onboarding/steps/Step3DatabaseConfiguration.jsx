import React from 'react';
import { Database, ShieldAlert, Server, HardDrive, CheckCircle2 } from 'lucide-react';

const DB_TYPES = [
  { id: 'PostgreSQL', name: 'PostgreSQL', defaultPort: 5432, color: 'text-blue-400' },
  { id: 'MongoDB', name: 'MongoDB', defaultPort: 27017, color: 'text-emerald-400' },
  { id: 'MySQL', name: 'MySQL', defaultPort: 3306, color: 'text-amber-400' },
  { id: 'Redis', name: 'Redis', defaultPort: 6379, color: 'text-rose-400' },
  { id: 'Oracle', name: 'Oracle DB', defaultPort: 1521, color: 'text-red-400' },
  { id: 'MSSQL', name: 'MS SQL Server', defaultPort: 1433, color: 'text-cyan-400' }
];

export default function Step3DatabaseConfiguration({ formData = {}, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const handleSelectType = (typeObj) => {
    onChange({
      ...formData,
      type: typeObj.id,
      port: formData.port || typeObj.defaultPort
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-400" />
          <span>Database Target Configuration</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Specify database metadata for performance & latency tracking. Secrets and credentials are NEVER stored.
        </p>
      </div>

      {/* Security Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          <strong>Security Guarantee:</strong> Do NOT enter database passwords or access keys. AppDynamics captures host, port, engine type, and environment metadata only.
        </span>
      </div>

      {/* Database Engine Selector Cards */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
          Select Database Engine Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {DB_TYPES.map((db) => {
            const isSelected = (formData.type || 'PostgreSQL') === db.id;
            return (
              <button
                key={db.id}
                type="button"
                onClick={() => handleSelectType(db)}
                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Database className={`w-5 h-5 ${db.color}`} />
                <span className="text-xs font-bold">{db.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields: Host, Port, Environment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-slate-300">Database Host / Endpoint</label>
          <input
            type="text"
            value={formData.host || ''}
            onChange={(e) => handleChange('host', e.target.value)}
            placeholder="db.primary.internal"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500/60 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-slate-300">Port</label>
          <input
            type="number"
            value={formData.port || 5432}
            onChange={(e) => handleChange('port', parseInt(e.target.value) || 5432)}
            placeholder="5432"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500/60 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-slate-300">Environment</label>
          <select
            value={formData.environment || 'Production'}
            onChange={(e) => handleChange('environment', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500/60 outline-none transition-all"
          >
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Testing">Testing</option>
            <option value="Development">Development</option>
          </select>
        </div>
      </div>
    </div>
  );
}
