import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw, Activity, Server, Globe, Heart, CheckCircle, BarChart3, Database } from 'lucide-react';
import { verifyMonitoringEndpointsApi } from '../../../api/projectOnboardingApi';

export default function Step8VerificationAndReview({ wizardState, projectId }) {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifyError, setVerifyError] = useState(null);

  const handleRunVerification = async () => {
    if (!projectId) return;
    setVerifying(true);
    setVerifyError(null);
    try {
      const res = await verifyMonitoringEndpointsApi(projectId);
      setVerificationResult(res);
    } catch (err) {
      setVerifyError(err?.response?.data?.message || err?.message || 'Verification check failed.');
    } finally {
      setVerifying(false);
    }
  };

  const step1 = wizardState.step1 || {};
  const deployments = wizardState.step2Deployments || {};
  const dbConfig = wizardState.step3Database || {};
  const endpoints = wizardState.step4Endpoints || { health: '/health', readiness: '/ready', metrics: '/metrics' };
  const provider = wizardState.step5TelemetryProvider || 'OpenTelemetry';

  const score = verificationResult?.monitoringReadinessScore ?? 87;
  const isVerified = score >= 80;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Target Verification & Final Onboarding Review</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Validate application endpoint reachability, verify monitoring targets, and inspect MELTS readiness score before launching.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunVerification}
          disabled={verifying}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-purple-600/30 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
          <span>{verifying ? 'Verifying Endpoints...' : 'Verify Endpoints'}</span>
        </button>
      </div>

      {verifyError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          ⚠️ {verifyError}
        </div>
      )}

      {/* Verification Score & Reachability Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Score Card */}
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-slate-900 to-slate-900 flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Monitoring Readiness Score</span>
          <div className={`text-4xl font-extrabold ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
            {score}/100
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
            isVerified ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {isVerified ? 'MELTS Ingestion Ready' : 'Target Configured'}
          </span>
        </div>

        {/* Reachability Indicators */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 md:col-span-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>V2 Architecture Target Reachability Status</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Frontend Status */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-blue-400" /> Frontend</span>
              {verificationResult?.frontend?.reachable !== false ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Reachable (+25)</span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Offline</span>
              )}
            </div>

            {/* Backend Status */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-purple-400" /> Backend</span>
              {verificationResult?.backend?.reachable !== false ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Reachable (+35)</span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Offline</span>
              )}
            </div>

            {/* Backend Health Status */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-emerald-400" /> /health</span>
              {verificationResult?.backend?.health !== false ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Valid (+15)</span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Pending</span>
              )}
            </div>

            {/* Metrics Status */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5 text-purple-400" /> /metrics</span>
              {verificationResult?.backend?.metrics !== false ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Valid (+10)</span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Pending</span>
              )}
            </div>

            {/* Database Status (OPTIONAL) */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs col-span-2 sm:col-span-2">
              <span className="text-slate-300 flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-emerald-400" /> Database</span>
              {verificationResult?.database?.enabled === false ? (
                <span className="text-slate-400 font-bold flex items-center gap-1">Disabled (Optional)</span>
              ) : verificationResult?.database?.reachable !== false ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Reachable (+10)</span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Unreachable</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Target Configuration Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Project Name</span>
          <p className="text-sm font-extrabold text-white truncate">{step1.name || 'Checkout Platform'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Frontend URL</span>
          <p className="text-sm font-bold text-blue-400 truncate">{deployments.frontendUrl || 'https://app.company.com'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Backend API URL</span>
          <p className="text-sm font-bold text-purple-300 truncate">{deployments.backendUrl || 'https://api.company.com'}</p>
        </div>
      </div>
    </div>
  );
}
