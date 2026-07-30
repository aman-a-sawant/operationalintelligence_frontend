import React, { useState } from 'react';
import { Cpu, Plus, Trash2, Edit2, LayoutGrid, Table as TableIcon, Check, Filter } from 'lucide-react';

const mockInfrastructure = [
  { id: 'inf_1', name: 'MongoDB Cluster', type: 'Database', environment: 'Production', criticality: 'Critical', linkedServices: ['Checkout Service', 'Order Service'], description: 'Primary MongoDB sharded cluster for transaction storage' },
  { id: 'inf_2', name: 'Redis Cache', type: 'Cache', environment: 'Production', criticality: 'High', linkedServices: ['Checkout Service', 'User Service'], description: 'Enterprise Redis cluster for session token caching' },
  { id: 'inf_3', name: 'EKS Kubernetes Cluster', type: 'Kubernetes', environment: 'Production', criticality: 'Critical', linkedServices: ['Checkout Service', 'Payment Service'], description: 'AWS EKS multi-region container orchestration' },
  { id: 'inf_4', name: 'Kafka Event Bus', type: 'Queue', environment: 'Production', criticality: 'High', linkedServices: ['Order Service', 'Notification Worker'], description: 'High-throughput message streaming buffer' }
];

export default function Step4Infrastructure({ data = mockInfrastructure, updateData }) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [envFilter, setEnvFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Kubernetes',
    environment: 'Production',
    criticality: 'High',
    description: '',
    linkedServices: ['Checkout Service']
  });

  const [showForm, setShowForm] = useState(false);

  const filteredInfra = data.filter(
    (item) => envFilter === 'All' || item.environment === envFilter
  );

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      updateData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)));
      setEditingId(null);
    } else {
      const newItem = {
        id: `inf_${Date.now()}`,
        ...formData
      };
      updateData([...data, newItem]);
    }

    setFormData({ name: '', type: 'Kubernetes', environment: 'Production', criticality: 'High', description: '', linkedServices: [] });
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      type: item.type,
      environment: item.environment,
      criticality: item.criticality,
      description: item.description || '',
      linkedServices: item.linkedServices || []
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    updateData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Register Infrastructure</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Add and group the cloud clusters, databases, caches, queues, and virtual machines supporting your services.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Environment Filter */}
          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Environments</option>
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Testing">Testing</option>
            <option value="Development">Development</option>
          </select>

          {/* View Toggles */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${viewMode === 'cards' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormData({ name: '', type: 'Kubernetes', environment: 'Production', criticality: 'High', description: '', linkedServices: [] });
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Cancel' : 'Register Resource'}</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/40 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            {editingId ? 'Edit Infrastructure Specification' : 'Register New Infrastructure Resource'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Resource Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. MongoDB Cluster"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Resource Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
              >
                <option value="Kubernetes">Kubernetes</option>
                <option value="Virtual Machine">Virtual Machine</option>
                <option value="Database">Database</option>
                <option value="Cache">Cache</option>
                <option value="Queue">Queue</option>
                <option value="Storage">Storage</option>
                <option value="Load Balancer">Load Balancer</option>
                <option value="External API">External API</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Environment *</label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
              >
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Staging">Staging</option>
                <option value="Production">Production</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Criticality *</label>
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. Primary MongoDB cluster for transaction data"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
          >
            {editingId ? 'Update Infrastructure' : 'Save Infrastructure Resource'}
          </button>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredInfra.map((res) => (
            <div key={res.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 space-y-3 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{res.name}</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {res.type}
                </span>
              </div>

              {res.description && <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{res.description}</p>}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <span className="text-emerald-400 font-semibold">{res.environment}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => handleEdit(res)} className="p-1 text-slate-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => handleDelete(res.id)} className="p-1 text-slate-500 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Resource Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Environment</th>
                <th className="p-3">Criticality</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
              {filteredInfra.map((res) => (
                <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{res.name}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px]">{res.type}</span></td>
                  <td className="p-3"><span className="text-emerald-400 font-semibold">{res.environment}</span></td>
                  <td className="p-3 text-rose-400">{res.criticality}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => handleEdit(res)} className="p-1 text-slate-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleDelete(res.id)} className="p-1 text-slate-500 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
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
