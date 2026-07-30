import React, { useState } from 'react';
import { Server, Plus, Trash2, Edit2, Search, LayoutGrid, Table as TableIcon, Check, Globe } from 'lucide-react';

const defaultServices = [
  { id: 's1', name: 'Checkout Service', description: 'Handles shopping cart validation & checkout', type: 'Backend', environment: 'Production', owner: 'Checkout Team' },
  { id: 's2', name: 'Order Service', description: 'Manages order state and fulfillment routing', type: 'Backend', environment: 'Production', owner: 'Logistics Team' },
  { id: 's3', name: 'Payment Service', description: 'Stripe & payment gateway tokenization adapter', type: 'API', environment: 'Production', owner: 'Payments Team' },
  { id: 's4', name: 'User Service', description: 'OAuth2 authentication & JWT token verification', type: 'API', environment: 'Production', owner: 'Auth Team' },
  { id: 's5', name: 'Notification Worker', description: 'Email and SMS transaction alerts queue', type: 'Worker', environment: 'Production', owner: 'Platform Team' },
  { id: 's6', name: 'Storefront Portal', description: 'Customer web shopping interface', type: 'Frontend', environment: 'Production', owner: 'UX Team' }
];

export default function Step2DefineServices({ data = defaultServices, updateData }) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Backend',
    environment: 'Production',
    owner: ''
  });

  const [showForm, setShowForm] = useState(false);

  const filteredServices = data.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.owner && s.owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.type && s.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveService = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      updateData(
        data.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
      );
      setEditingId(null);
    } else {
      const newService = {
        id: `s-${Date.now()}`,
        ...formData
      };
      updateData([...data, newService]);
    }

    setFormData({ name: '', description: '', type: 'Backend', environment: 'Production', owner: '' });
    setShowForm(false);
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description || '',
      type: service.type || 'Backend',
      environment: service.environment || 'Production',
      owner: service.owner || ''
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    updateData(data.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            <span>Register Services</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Add all applications, microservices, databases, and APIs belonging to this project.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'cards' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormData({ name: '', description: '', type: 'Backend', environment: 'Production', owner: '' });
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Cancel' : 'Add Service'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search registered services by name, owner or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            {editingId ? 'Edit Service Specification' : 'Register New Application Service'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Service Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Checkout Service"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs md:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Service Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs md:text-sm focus:outline-none"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="API">API Gateway / Adapter</option>
                <option value="Database">Database</option>
                <option value="Worker">Worker Queue</option>
                <option value="Cache">Cache Cluster</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Environment *</label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs md:text-sm focus:outline-none"
              >
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Staging">Staging</option>
                <option value="Production">Production</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Service Owner</label>
              <input
                type="text"
                placeholder="e.g. Checkout Engineering Team"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs md:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
            <input
              type="text"
              placeholder="Brief operational purpose..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs md:text-sm focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveService}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold shadow-md"
          >
            {editingId ? 'Update Service' : 'Save & Register Service'}
          </button>
        </div>
      )}

      {/* Services Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">
                    {srv.type}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                    {srv.environment}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {srv.name}
                </h4>

                {srv.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{srv.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-400">{srv.owner || 'Engineering'}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(srv)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(srv.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Services Table View */
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Service Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Environment</th>
                <th className="p-3">Owner</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredServices.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{srv.name}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono text-[10px]">{srv.type}</span></td>
                  <td className="p-3"><span className="text-emerald-400 font-semibold">{srv.environment}</span></td>
                  <td className="p-3 text-slate-400">{srv.owner || 'Team'}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => handleEdit(srv)} className="p-1.5 rounded-lg text-slate-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleDelete(srv.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
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
