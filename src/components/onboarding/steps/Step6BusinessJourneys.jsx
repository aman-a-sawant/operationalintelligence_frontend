import React, { useState } from 'react';
import { ShoppingCart, DollarSign, Plus, Trash2, ArrowRight, LayoutGrid, Table as TableIcon } from 'lucide-react';

const mockBusinessJourneys = [
  {
    id: 'j_1',
    name: 'Checkout Flow',
    description: 'Customer checkout → Cart validation → Payment tokenization → Order creation',
    criticality: 'Critical',
    revenueImportance: 'Critical Revenue',
    revenueImpactCategory: 'Critical Revenue',
    estimatedUsers: 24500,
    healthScore: 92,
    linkedServices: ['Checkout Service', 'Payment Service', 'Order Service']
  },
  {
    id: 'j_2',
    name: 'User Sign-up & Onboarding',
    description: 'Registration form → Email verification → OAuth JWT token issue',
    criticality: 'High',
    revenueImportance: 'Operational',
    revenueImpactCategory: 'Operational',
    estimatedUsers: 8500,
    healthScore: 98,
    linkedServices: ['User Service', 'Notification Worker']
  }
];

export default function Step6BusinessJourneys({ data = mockBusinessJourneys, updateData }) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table' | 'diagram'
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criticality: 'Critical',
    revenueImportance: 'Critical Revenue',
    revenueImpactCategory: 'Critical Revenue',
    estimatedUsers: 10000,
    linkedServices: ['Checkout Service', 'Payment Service']
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;
    const newJ = {
      id: `j_${Date.now()}`,
      healthScore: 100,
      ...formData
    };
    updateData([...data, newJ]);
    setFormData({ name: '', description: '', criticality: 'Critical', revenueImportance: 'Critical Revenue', revenueImpactCategory: 'Critical Revenue', estimatedUsers: 10000, linkedServices: [] });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    updateData(data.filter((j) => j.id !== id));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <span>Define Business Journeys</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Connect technical microservices and infrastructure directly to core business revenue outcomes.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${viewMode === 'cards' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('diagram')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${viewMode === 'diagram' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Diagram Flow
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Table
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Add Journey'}</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Configure Business Transaction Funnel</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Journey Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Checkout Flow"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Revenue Impact Category *</label>
              <select
                value={formData.revenueImpactCategory}
                onChange={(e) => setFormData({ ...formData, revenueImpactCategory: e.target.value, revenueImportance: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
              >
                <option value="Critical Revenue">Critical Revenue ($$$$)</option>
                <option value="High Revenue">High Revenue ($$$)</option>
                <option value="Operational">Operational Funnel ($$)</option>
                <option value="Non-Revenue">Non-Revenue ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Criticality</label>
              <select
                value={formData.criticality}
                onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Estimated Active User Count</label>
              <input
                type="number"
                value={formData.estimatedUsers}
                onChange={(e) => setFormData({ ...formData, estimatedUsers: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description & Path</label>
            <input
              type="text"
              placeholder="e.g. User → Frontend → Checkout Service → Payment Service → Database"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md"
          >
            Save Business Journey
          </button>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="space-y-3">
          {data.map((j) => (
            <div key={j.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">{j.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {j.revenueImpactCategory || j.revenueImportance}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-purple-300">{j.estimatedUsers?.toLocaleString()} Users</span>
                  <button type="button" onClick={() => handleDelete(j.id)} className="p-1 text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{j.description}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Diagram View */}
      {viewMode === 'diagram' && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">End-to-End Business Flow Diagram</h4>
          {data.map((j) => (
            <div key={j.id} className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2">
              <span className="text-xs font-bold text-white block">{j.name}</span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
                <span className="px-3 py-1 rounded-xl bg-purple-600/30 text-purple-200 border border-purple-500/40">User</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                {j.linkedServices.map((srv, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-3 py-1 rounded-xl bg-slate-800 text-blue-300 border border-slate-700">{srv}</span>
                    {idx < j.linkedServices.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-amber-400" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Journey Name</th>
                <th className="p-3">Revenue Category</th>
                <th className="p-3">Criticality</th>
                <th className="p-3">Estimated Users</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
              {data.map((j) => (
                <tr key={j.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{j.name}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px]">{j.revenueImpactCategory || j.revenueImportance}</span></td>
                  <td className="p-3 text-rose-400">{j.criticality}</td>
                  <td className="p-3 text-purple-300">{j.estimatedUsers?.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <button type="button" onClick={() => handleDelete(j.id)} className="p-1 text-slate-500 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
