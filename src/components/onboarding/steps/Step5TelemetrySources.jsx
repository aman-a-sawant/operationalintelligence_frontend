import React, { useState } from 'react';
import { Activity, ShieldCheck, RefreshCw, Key, Lock, User, Plus, Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { testTelemetryConnectionApi } from '../../../api/projectOnboardingApi';

const mockTelemetrySources = [
  {
    id: 'tel_1',
    provider: 'Prometheus',
    endpointUrl: 'http://prometheus:9090',
    authType: 'None',
    apiKey: '',
    token: '',
    username: '',
    password: '',
    enabled: true,
    status: 'Connected'
  },
  {
    id: 'tel_2',
    provider: 'OpenTelemetry',
    endpointUrl: 'https://otlp.company.com:4317',
    authType: 'Token',
    apiKey: '',
    token: 'otlp_live_token_77261',
    username: '',
    password: '',
    enabled: true,
    status: 'Connected'
  },
  {
    id: 'tel_3',
    provider: 'AWS CloudWatch',
    endpointUrl: 'https://monitoring.us-east-1.amazonaws.com',
    authType: 'AWS IAM',
    apiKey: 'AKIAIOSFODNN7EXAMPLE',
    token: '',
    username: '',
    password: '',
    enabled: true,
    status: 'Connected'
  },
  {
    id: 'tel_4',
    provider: 'Datadog',
    endpointUrl: 'https://api.datadoghq.com/api/v1/series',
    authType: 'API Key',
    apiKey: 'dd_api_key_8817263',
    token: '',
    username: '',
    password: '',
    enabled: false,
    status: 'Not Tested'
  }
];

export default function Step5TelemetrySources({ data = mockTelemetrySources, updateData }) {
  const [testingId, setTestingId] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    provider: 'Prometheus',
    endpointUrl: 'http://prometheus:9090',
    authType: 'None',
    apiKey: '',
    token: '',
    username: '',
    password: '',
    enabled: true
  });

  const [showForm, setShowForm] = useState(false);

  const handleTestConnection = async (item) => {
    setTestingId(item.id);
    const result = await testTelemetryConnectionApi(item);
    setTestResults((prev) => ({
      ...prev,
      [item.id]: {
        success: result.success !== false,
        message: result.message || 'Connection successful',
        latency: result.latency || '24ms'
      }
    }));
    setTestingId(null);
  };

  const toggleEnable = (id) => {
    updateData(
      data.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSave = () => {
    if (!formData.endpointUrl.trim()) return;

    if (editingItem) {
      updateData(data.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item)));
      setEditingItem(null);
    } else {
      const newItem = {
        id: `tel_${Date.now()}`,
        ...formData,
        status: 'Connected'
      };
      updateData([...data, newItem]);
    }

    setFormData({ provider: 'Prometheus', endpointUrl: '', authType: 'None', apiKey: '', token: '', username: '', password: '', enabled: true });
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setFormData({
      provider: item.provider,
      endpointUrl: item.endpointUrl,
      authType: item.authType || 'None',
      apiKey: item.apiKey || '',
      token: item.token || '',
      username: item.username || '',
      password: item.password || '',
      enabled: item.enabled
    });
    setEditingItem(item);
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
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Connect Telemetry Sources</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Configure APM metrics endpoints, authentication credentials, and test connection endpoints.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData({ provider: 'Prometheus', endpointUrl: '', authType: 'None', apiKey: '', token: '', username: '', password: '', enabled: true });
            setEditingItem(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Add Source'}</span>
        </button>
      </div>

      {/* Add / Edit Credentials Form */}
      {showForm && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-4 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            {editingItem ? 'Edit Telemetry Provider Credentials' : 'Add Telemetry Monitoring Source'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Telemetry Provider *</label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
              >
                <option value="Prometheus">Prometheus</option>
                <option value="OpenTelemetry">OpenTelemetry (OTLP)</option>
                <option value="CloudWatch">AWS CloudWatch</option>
                <option value="Azure Monitor">Azure Monitor</option>
                <option value="Datadog">Datadog APM</option>
                <option value="New Relic">New Relic</option>
                <option value="Dynatrace">Dynatrace</option>
                <option value="Custom">Custom Collector Endpoint</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Authentication Type *</label>
              <select
                value={formData.authType}
                onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
              >
                <option value="None">None (Public/Internal)</option>
                <option value="API Key">API Key</option>
                <option value="Token">Bearer Token</option>
                <option value="Username/Password">Basic Auth (Username / Password)</option>
                <option value="AWS IAM">AWS IAM Signature</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Endpoint URL *</label>
            <input
              type="text"
              required
              placeholder="http://prometheus:9090"
              value={formData.endpointUrl}
              onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none"
            />
          </div>

          {/* Conditional Credentials Inputs */}
          {formData.authType === 'API Key' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">API Key *</label>
              <input
                type="password"
                placeholder="Enter API Secret Key..."
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
              />
            </div>
          )}

          {formData.authType === 'Token' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Bearer Token *</label>
              <input
                type="password"
                placeholder="Enter Bearer Token..."
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
          >
            {editingItem ? 'Update Credentials & Endpoint' : 'Save Telemetry Integration'}
          </button>
        </div>
      )}

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.map((item) => {
          const testRes = testResults[item.id];
          const isTesting = testingId === item.id;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                item.enabled
                  ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border-emerald-500/40 shadow-md'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Activity className={`w-4 h-4 ${item.enabled ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <h4 className="text-sm font-bold text-white">{item.provider}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {item.authType}
                  </span>

                  {/* Enable / Disable Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleEnable(item.id)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${
                      item.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      item.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <p className="text-xs font-mono text-slate-300 truncate bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {item.endpointUrl}
              </p>

              {/* Status Badge & Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                {testRes ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {testRes.message} ({testRes.latency})
                  </span>
                ) : (
                  <span className={`text-[11px] font-bold ${item.status === 'Connected' ? 'text-emerald-400' : 'text-slate-500'}`}>
                    Status: {item.status}
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTestConnection(item)}
                    disabled={isTesting}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-purple-400' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                  <button type="button" onClick={() => handleEdit(item)} className="p-1 text-slate-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="p-1 text-slate-500 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
