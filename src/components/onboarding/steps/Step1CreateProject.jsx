import React from 'react';
import { FolderPlus, User, ShieldAlert, Layers, Building2 } from 'lucide-react';

export default function Step1CreateProject({ data, updateData }) {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-purple-400" />
            <span>Create Your Project</span>
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
            POST /api/projects
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Define the essential project identity, business domain, and operational criticality level.</p>
      </div>

      <div className="space-y-4">
        {/* Project Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Project Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Checkout Platform"
            value={data.name || ''}
            onChange={(e) => updateData({ name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Business Domain & Owner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              Business Domain *
            </label>
            <select
              value={data.businessDomain || 'E-Commerce & Retail'}
              onChange={(e) => updateData({ businessDomain: e.target.value })}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="E-Commerce & Retail">E-Commerce & Retail</option>
              <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
              <option value="Fintech & Payments">Fintech & Payments</option>
              <option value="Security & IAM">Security & IAM</option>
              <option value="Data & Analytics">Data & Analytics</option>
              <option value="Core Infrastructure">Core Infrastructure</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              Project Owner / Engineering Lead *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Payments & Checkout Team"
              value={data.owner || ''}
              onChange={(e) => updateData({ owner: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Criticality Radio Cards */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            System Criticality Level *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { level: 'Critical', color: 'border-rose-500/50 bg-rose-500/10 text-rose-400', desc: 'Tier 1 Revenue Impact' },
              { level: 'High', color: 'border-orange-500/50 bg-orange-500/10 text-orange-400', desc: 'Core Application Flow' },
              { level: 'Medium', color: 'border-amber-500/50 bg-amber-500/10 text-amber-400', desc: 'Supporting Operations' },
              { level: 'Low', color: 'border-blue-500/50 bg-blue-500/10 text-blue-400', desc: 'Internal Analytics' }
            ].map((c) => {
              const isSelected = (data.criticality || 'Critical') === c.level;
              return (
                <div
                  key={c.level}
                  onClick={() => updateData({ criticality: c.level })}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-center space-y-1 ${
                    isSelected ? `${c.color} shadow-md` : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-sm font-extrabold block">{c.level}</span>
                  <span className="text-[10px] block opacity-80">{c.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows="3"
            placeholder="Describe the application architecture, business goals, and monitoring objectives..."
            value={data.description || ''}
            onChange={(e) => updateData({ description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}
