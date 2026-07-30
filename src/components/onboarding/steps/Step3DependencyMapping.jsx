import React, { useState } from 'react';
import { GitMerge, ArrowRight, Plus, Trash2, Globe, Database, Network, Eye, Layers, X, ShieldAlert, Cpu, Activity, Info } from 'lucide-react';

const mockDependencies = [
  {
    id: 'dep_1',
    sourceService: 'Checkout Service',
    targetService: 'Payment Service',
    dependencyType: 'API',
    endpointUrl: 'https://payment.company.com/api/pay',
    protocol: 'HTTP/REST',
    method: 'POST',
    criticality: 'Critical',
    healthImpact: 'Direct Outage'
  },
  {
    id: 'dep_2',
    sourceService: 'Checkout Service',
    targetService: 'Order Service',
    dependencyType: 'API',
    endpointUrl: 'https://order.company.com/api/orders',
    protocol: 'gRPC',
    method: 'POST',
    criticality: 'Critical',
    healthImpact: 'Direct Outage'
  },
  {
    id: 'dep_3',
    sourceService: 'Order Service',
    targetService: 'Notification Worker',
    dependencyType: 'Queue',
    endpointUrl: 'amqp://rabbitmq.internal:5672/events',
    protocol: 'AMQP',
    method: 'POST',
    criticality: 'Medium',
    healthImpact: 'Silent Fallback'
  },
  {
    id: 'dep_4',
    sourceService: 'Payment Service',
    targetService: 'MongoDB Cluster',
    dependencyType: 'Database',
    endpointUrl: 'mongodb://primary.mongo.internal:27017/payments',
    protocol: 'JDBC',
    method: 'POST',
    criticality: 'Critical',
    healthImpact: 'Direct Outage'
  }
];

export default function Step3DependencyMapping({ data = mockDependencies, updateData }) {
  const [viewTab, setViewTab] = useState('flow'); // 'flow' | 'graph' | 'table'
  const [inspectedDep, setInspectedDep] = useState(null);

  const [formData, setFormData] = useState({
    sourceService: 'Checkout Service',
    targetService: 'Payment Service',
    dependencyType: 'API',
    endpointUrl: 'https://payment.company.com/api/pay',
    protocol: 'HTTP/REST',
    method: 'POST',
    criticality: 'Critical',
    healthImpact: 'Direct Outage'
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddDependency = () => {
    if (!formData.sourceService || !formData.targetService) return;
    const newDep = {
      id: `dep_${Date.now()}`,
      ...formData
    };
    updateData([...data, newDep]);
    setFormData({
      sourceService: 'Checkout Service',
      targetService: 'Payment Service',
      dependencyType: 'API',
      endpointUrl: 'https://api.company.com/v1/resource',
      protocol: 'HTTP/REST',
      method: 'POST',
      criticality: 'High',
      healthImpact: 'Degradation'
    });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    updateData(data.filter((d) => d.id !== id));
    if (inspectedDep && inspectedDep.id === id) {
      setInspectedDep(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300 relative">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-amber-400" />
            <span>Map Service Dependencies</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Capture actual connection details, endpoint URLs, protocols, and cascading health impacts.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewTab('flow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${viewTab === 'flow' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Flow Builder
            </button>
            <button
              type="button"
              onClick={() => setViewTab('graph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${viewTab === 'graph' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Node Graph
            </button>
            <button
              type="button"
              onClick={() => setViewTab('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${viewTab === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              Dependency Table
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Add Edge'}</span>
          </button>
        </div>
      </div>

      {/* Add Form with Endpoint URL & Protocol Specs */}
      {showAddForm && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Configure Connection Edge Details</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Source Service *</label>
              <input
                type="text"
                value={formData.sourceService}
                onChange={(e) => setFormData({ ...formData, sourceService: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Dependency Type *</label>
              <select
                value={formData.dependencyType}
                onChange={(e) => setFormData({ ...formData, dependencyType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                <option value="API">API (HTTP/REST)</option>
                <option value="Database">Database Read/Write</option>
                <option value="Queue">Queue (AMQP/Kafka)</option>
                <option value="Cache">Cache Lookup (Redis)</option>
                <option value="Event">Event Stream</option>
                <option value="External">External Integration</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Target Service *</label>
              <input
                type="text"
                value={formData.targetService}
                onChange={(e) => setFormData({ ...formData, targetService: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Endpoint URL / Connection String *</label>
              <input
                type="text"
                placeholder="https://payment.company.com/api/pay"
                value={formData.endpointUrl}
                onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Protocol *</label>
              <select
                value={formData.protocol}
                onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
              >
                <option value="HTTP/REST">HTTP / REST</option>
                <option value="gRPC">gRPC / HTTP2</option>
                <option value="AMQP">AMQP / RabbitMQ</option>
                <option value="Redis TCP">Redis TCP</option>
                <option value="Kafka Event">Kafka Event</option>
                <option value="JDBC">JDBC / SQL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">HTTP Method</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Criticality</label>
              <select
                value={formData.criticality}
                onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">Health Impact</label>
              <select
                value={formData.healthImpact}
                onChange={(e) => setFormData({ ...formData, healthImpact: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                <option value="Direct Outage">Direct Outage</option>
                <option value="Degradation">System Degradation</option>
                <option value="Silent Fallback">Silent Fallback</option>
                <option value="Isolated">Isolated Failure</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddDependency}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md"
          >
            Save Dependency Connection
          </button>
        </div>
      )}

      {/* Main View Modes */}
      {viewTab === 'flow' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.map((dep) => (
              <div
                key={dep.id}
                onClick={() => setInspectedDep(dep)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-purple-300">{dep.sourceService}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-blue-300">{dep.targetService}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                    {dep.dependencyType}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center justify-between">
                  <span className="truncate">{dep.endpointUrl}</span>
                  <span className="text-purple-400 font-bold shrink-0 ml-2">{dep.method}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="text-rose-400 font-semibold">{dep.healthImpact}</span>
                  <span className="text-slate-500 group-hover:text-amber-300 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Inspect Connection
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewTab === 'graph' && (
        /* Node Canvas Graph */
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4" />
            <span>Interactive Node-Based Topological Graph</span>
          </h4>

          <div className="flex flex-wrap items-center justify-center gap-4 py-6">
            {data.map((dep, idx) => (
              <div
                key={idx}
                onClick={() => setInspectedDep(dep)}
                className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer shadow-lg space-y-1.5 text-center min-w-[200px]"
              >
                <div className="text-xs font-extrabold text-white">{dep.sourceService}</div>
                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  {dep.method} {dep.dependencyType}
                </div>
                <div className="text-xs font-bold text-blue-300">{dep.targetService}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewTab === 'table' && (
        /* Dependency Table View */
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Source Service</th>
                <th className="p-3">Target Service</th>
                <th className="p-3">Type</th>
                <th className="p-3">Endpoint URL</th>
                <th className="p-3">Method</th>
                <th className="p-3">Health Impact</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
              {data.map((dep) => (
                <tr key={dep.id} onClick={() => setInspectedDep(dep)} className="hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <td className="p-3 font-bold text-purple-300">{dep.sourceService}</td>
                  <td className="p-3 font-bold text-blue-300">{dep.targetService}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px]">{dep.dependencyType}</span></td>
                  <td className="p-3 text-slate-300 truncate max-w-[180px]">{dep.endpointUrl}</td>
                  <td className="p-3 text-purple-400 font-bold">{dep.method}</td>
                  <td className="p-3 text-rose-400">{dep.healthImpact}</td>
                  <td className="p-3 text-right">
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(dep.id); }} className="p-1 text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Connection Inspector Slide-Over Panel */}
      {inspectedDep && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#09112C]/95 border-l border-amber-500/40 p-6 backdrop-blur-xl shadow-2xl space-y-5 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-base font-extrabold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Connection Inspector Panel</span>
            </h4>
            <button type="button" onClick={() => setInspectedDep(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Source → Target Call Edge</span>
              <div className="text-sm font-bold text-white flex items-center gap-2 pt-1">
                <span className="text-purple-300">{inspectedDep.sourceService}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-blue-300">{inspectedDep.targetService}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Endpoint URL</span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 font-mono break-all">
                {inspectedDep.endpointUrl}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Protocol</span>
                <span className="font-bold text-white font-mono">{inspectedDep.protocol}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">HTTP Method</span>
                <span className="font-bold text-purple-400 font-mono">{inspectedDep.method}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Criticality</span>
                <span className="font-bold text-rose-400">{inspectedDep.criticality}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Health Impact</span>
                <span className="font-bold text-amber-300">{inspectedDep.healthImpact}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 leading-relaxed text-[11px]">
              <strong>SLA & Dependency Analysis:</strong> If {inspectedDep.targetService} experiences high latency or downtime, {inspectedDep.sourceService} will suffer a <strong>{inspectedDep.healthImpact}</strong> effect.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
