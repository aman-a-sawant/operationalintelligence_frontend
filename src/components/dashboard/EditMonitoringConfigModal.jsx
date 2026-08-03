import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, Activity, Server, Globe, Database, Cpu, ShieldCheck, Layers } from 'lucide-react';
import { getMonitoringConfigApi, saveMonitoringConfigApi, verifyMonitoringEndpointsApi } from '../../api/projectOnboardingApi';
import { getServices } from '../../api/servicesApi';

export default function EditMonitoringConfigModal({ isOpen, onClose, projectId, onSaveSuccess }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [registeredServices, setRegisteredServices] = useState([]);

  const [formData, setFormData] = useState({
    frontend: { enabled: true, name: 'Web Frontend', url: '', healthEndpoint: '' },
    backend: { enabled: true, name: 'API Server', url: '', healthEndpoint: '', readinessEndpoint: '', metricsEndpoint: '' },
    database: { enabled: false, type: 'PostgreSQL', host: '', port: 5432, environment: 'Production' },
    telemetryProvider: 'OpenTelemetry'
  });

  useEffect(() => {
    if (isOpen && projectId) {
      loadConfig();
    }
  }, [isOpen, projectId]);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, servicesRes] = await Promise.all([
        getMonitoringConfigApi(projectId).catch(() => null),
        getServices(projectId).catch(() => [])
      ]);

      const services = Array.isArray(servicesRes) ? servicesRes : (res?.registeredServices || []);
      setRegisteredServices(services);

      const feService = services.find((s) => s.type === 'Frontend');
      const beService = services.find((s) => s.type === 'Backend' || s.type === 'API');

      if (res || services.length > 0) {
        setFormData({
          frontend: {
            enabled: res?.frontend?.enabled !== false,
            name: res?.frontend?.name || feService?.name || 'Web Frontend',
            url: res?.frontend?.url || res?.frontendUrl || feService?.name || '',
            healthEndpoint: res?.frontend?.healthEndpoint || ''
          },
          backend: {
            enabled: res?.backend?.enabled !== false,
            name: res?.backend?.name || beService?.name || 'API Server',
            url: res?.backend?.url || res?.backendUrl || beService?.name || '',
            healthEndpoint: res?.backend?.healthEndpoint !== undefined ? res.backend.healthEndpoint : '',
            readinessEndpoint: res?.backend?.readinessEndpoint !== undefined ? res.backend.readinessEndpoint : '',
            metricsEndpoint: res?.backend?.metricsEndpoint !== undefined ? res.backend.metricsEndpoint : ''
          },
          database: {
            enabled: Boolean(res?.database?.enabled || (res?.databases && res.databases.length > 0)),
            type: res?.database?.type || res?.databases?.[0]?.type || 'PostgreSQL',
            host: res?.database?.host || res?.databases?.[0]?.host || '',
            port: res?.database?.port || res?.databases?.[0]?.port || 5432,
            environment: res?.database?.environment || res?.databases?.[0]?.environment || 'Production'
          },
          telemetryProvider: res?.telemetryProvider || 'OpenTelemetry'
        });
      }
    } catch (err) {
      const isConnRefused = err?.message?.includes('Network Error') || err?.code === 'ERR_NETWORK' || err?.code === 'ECONNREFUSED';
      setError(
        isConnRefused
          ? 'Network Connection Refused: Unable to connect to Backend Server on port 5001. Please verify that your Backend server is running.'
          : (err?.response?.data?.message || err?.message || 'Failed to load monitoring configuration.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndVerify = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await saveMonitoringConfigApi(projectId, formData);
      await verifyMonitoringEndpointsApi(projectId);
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save monitoring configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#0B1437] border border-purple-500/30 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-purple-950/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit Monitoring Configuration</h3>
              <p className="text-xs text-slate-400">Single Source of Truth Target Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSaveAndVerify} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
              <span> {error}</span>
              <button
                type="button"
                onClick={loadConfig}
                className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-[11px] border border-rose-500/40 shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
              <span>Loading Target Configuration & Project Services...</span>
            </div>
          ) : (
            <>
              {/* Registered Services Banner */}
              {registeredServices.length > 0 && (
                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wide">
                      <Layers className="w-4 h-4 text-purple-400" /> Registered Project Services & APIs ({registeredServices.length})
                    </span>
                    <span className="text-[11px] text-slate-400">Click a service to use as Target URL</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {registeredServices.map((svc) => (
                      <button
                        key={svc._id || svc.id || svc.name}
                        type="button"
                        onClick={() => {
                          if (svc.type === 'Frontend') {
                            setFormData((prev) => ({ ...prev, frontend: { ...prev.frontend, url: svc.name } }));
                          } else {
                            setFormData((prev) => ({ ...prev, backend: { ...prev.backend, url: svc.name } }));
                          }
                        }}
                        className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-purple-900/50 border border-slate-700 hover:border-purple-500 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-all"
                      >
                        <span className="font-sans font-semibold text-[11px] text-purple-400">{svc.type || 'Service'}:</span>
                        <span>{svc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Frontend Configuration */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <label className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" /> Frontend Application
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.frontend.enabled}
                      onChange={(e) => setFormData({ ...formData, frontend: { ...formData.frontend, enabled: e.target.checked } })}
                      className="rounded border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>Enabled</span>
                  </label>
                </div>

                {formData.frontend.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Frontend Deployment URL</label>
                      <input
                        type="url"
                        value={formData.frontend.url}
                        onChange={(e) => setFormData({ ...formData, frontend: { ...formData.frontend, url: e.target.value } })}
                        placeholder="https://app.company.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Health Endpoint (Optional)</label>
                      <input
                        type="text"
                        value={formData.frontend.healthEndpoint}
                        onChange={(e) => setFormData({ ...formData, frontend: { ...formData.frontend, healthEndpoint: e.target.value } })}
                        placeholder="/health"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Backend Configuration */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <label className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-400" /> Backend API Application
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.backend.enabled}
                      onChange={(e) => setFormData({ ...formData, backend: { ...formData.backend, enabled: e.target.checked } })}
                      className="rounded border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>Enabled</span>
                  </label>
                </div>

                {formData.backend.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Backend Base API URL</label>
                      <input
                        type="url"
                        value={formData.backend.url}
                        onChange={(e) => setFormData({ ...formData, backend: { ...formData.backend, url: e.target.value } })}
                        placeholder="https://api.company.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Health Path <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.backend.healthEndpoint}
                          onChange={(e) => setFormData({ ...formData, backend: { ...formData.backend, healthEndpoint: e.target.value } })}
                          placeholder="/health (optional)"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Readiness Path <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.backend.readinessEndpoint}
                          onChange={(e) => setFormData({ ...formData, backend: { ...formData.backend, readinessEndpoint: e.target.value } })}
                          placeholder="/ready (optional)"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Metrics Path <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.backend.metricsEndpoint}
                          onChange={(e) => setFormData({ ...formData, backend: { ...formData.backend, metricsEndpoint: e.target.value } })}
                          placeholder="/metrics (optional)"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 outline-none font-mono"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400/80 bg-purple-500/5 p-2.5 rounded-xl border border-purple-500/10">
                      💡 <strong>Optional Endpoints:</strong> If your API does not expose custom <code>/health</code> or <code>/ready</code> routes, leave these fields empty. OPINTEL automatically verifies reachability against your <strong>Backend Base API URL</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Database Configuration */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <label className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" /> Database Cluster (Optional)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.database.enabled}
                      onChange={(e) => setFormData({ ...formData, database: { ...formData.database, enabled: e.target.checked } })}
                      className="rounded border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>Enabled</span>
                  </label>
                </div>

                {formData.database.enabled ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Database Type</label>
                      <select
                        value={formData.database.type}
                        onChange={(e) => setFormData({ ...formData, database: { ...formData.database, type: e.target.value } })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                      >
                        <option value="PostgreSQL">PostgreSQL</option>
                        <option value="MongoDB">MongoDB</option>
                        <option value="MySQL">MySQL</option>
                        <option value="Redis">Redis</option>
                        <option value="MSSQL">SQL Server</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Host / Endpoint</label>
                      <input
                        type="text"
                        value={formData.database.host}
                        onChange={(e) => setFormData({ ...formData, database: { ...formData.database, host: e.target.value } })}
                        placeholder="db.primary.internal"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Port</label>
                      <input
                        type="number"
                        value={formData.database.port}
                        onChange={(e) => setFormData({ ...formData, database: { ...formData.database, port: parseInt(e.target.value) || 5432 } })}
                        placeholder="5432"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium italic">
                    Database monitoring disabled for this project. Dashboard will display "Database Not Configured".
                  </p>
                )}
              </div>

              {/* Telemetry Provider */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" /> Telemetry Provider
                </label>
                <select
                  value={formData.telemetryProvider}
                  onChange={(e) => setFormData({ ...formData, telemetryProvider: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none"
                >
                  <option value="OpenTelemetry">OpenTelemetry</option>
                  <option value="Prometheus">Prometheus</option>
                  <option value="Datadog">Datadog</option>
                  <option value="CloudWatch">AWS CloudWatch</option>
                  <option value="Azure Monitor">Azure Monitor</option>
                  <option value="New Relic">New Relic</option>
                  <option value="Custom">Custom Exporter</option>
                </select>
              </div>

              {/* Submit Control */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving & Probing...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save & Verify Targets</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
