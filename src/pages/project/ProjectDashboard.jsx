import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import AICopilotDrawer from '../../components/ai-copilot/AICopilotDrawer';
import AIInsightsCard from '../../components/dashboard/AIInsightsCard';
import IncidentModal from '../../components/dashboard/IncidentModal';
import EditMonitoringConfigModal from '../../components/dashboard/EditMonitoringConfigModal';
import { getProjectDashboard } from '../../api/projectDashboardApi';
import { deleteProjectApi } from '../../api/projectApi';
import { verifyMonitoringEndpointsApi } from '../../api/projectOnboardingApi';
import { createIncident } from '../../api/incidentsApi';
import {
  getEndpointAnalytics,
  getAvailabilityAnalytics,
  getErrorsAnalytics,
  getRecentVerificationFailures,
  getMonitoringCoverage,
  getPerformanceAnalytics,
  getHealthExplanation
} from '../../api/projectAnalyticsApi';
import {
  Activity,
  AlertTriangle,
  Server,
  DollarSign,
  Users,
  Sparkles,
  ArrowLeft,
  GitMerge,
  ShieldAlert,
  Database,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Trash2,
  Globe,
  Edit3,
  RefreshCw,
  Heart,
  Zap,
  CheckCircle2,
  AlertOctagon,
  Check,
  Plus,
  HelpCircle,
  Info,
  X,
  ExternalLink,
  List,
  ChevronDown
} from 'lucide-react';

export default function ProjectDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [healthExplanation, setHealthExplanation] = useState(null);
  const [endpointAnalytics, setEndpointAnalytics] = useState(null);
  const [coverage, setCoverage] = useState(null);
  const [errorsData, setErrorsData] = useState(null);
  const [recentFailures, setRecentFailures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditConfigOpen, setIsEditConfigOpen] = useState(false);
  const [isHealthExplanationOpen, setIsHealthExplanationOpen] = useState(false);

  // New Interactive Action Modals
  const [isDeclareIncidentOpen, setIsDeclareIncidentOpen] = useState(false);

  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState('High');
  const [incidentSummary, setIncidentSummary] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Interactive Failure Category Detail Modal
  const [activeFailureCategory, setActiveFailureCategory] = useState(null);
  const [categoryFailureDetails, setCategoryFailureDetails] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const loadAllProjectTelemetry = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const [projDash, perf, hExp, epAna, cov, err, fail] = await Promise.allSettled([
        getProjectDashboard(projectId),
        getPerformanceAnalytics(projectId),
        getHealthExplanation(projectId),
        getEndpointAnalytics(projectId),
        getMonitoringCoverage(projectId),
        getErrorsAnalytics({ projectId }),
        getRecentVerificationFailures({ projectId })
      ]);

      if (projDash.status === 'fulfilled' && projDash.value) {
        setProjectData(projDash.value);
      } else if (projDash.status === 'rejected') {
        throw projDash.reason;
      }

      setPerformance(perf.status === 'fulfilled' ? perf.value : null);
      setHealthExplanation(hExp.status === 'fulfilled' ? hExp.value : null);
      setEndpointAnalytics(epAna.status === 'fulfilled' ? epAna.value : null);
      setCoverage(cov.status === 'fulfilled' ? cov.value : null);
      setErrorsData(err.status === 'fulfilled' ? err.value : null);

      if (fail.status === 'fulfilled' && Array.isArray(fail.value)) {
        const filteredFailures = fail.value.filter((f) => f.projectId === projectId || f.projectId?._id === projectId || !f.projectId);
        setRecentFailures(filteredFailures.length > 0 ? filteredFailures : fail.value);
      } else {
        setRecentFailures([]);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load project telemetry dashboard.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllProjectTelemetry();
  }, [projectId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRefresh = async () => {
    try {
      showToast("Verifying monitoring endpoints live & recording telemetry...");
      await verifyMonitoringEndpointsApi(projectId);
    } catch (err) {
      console.warn("Live verification warning:", err?.message);
    }
    await loadAllProjectTelemetry();
    showToast("Project telemetry data & verification refreshed!");
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await deleteProjectApi(projectId);
      showToast(`Project "${projectName}" permanently deleted.`);
      setTimeout(() => {
        navigate('/monitor');
      }, 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete project.';
      showToast(`⚠️ ${msg}`);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };


  const handleDeclareIncident = async (e) => {
    e.preventDefault();
    if (!incidentTitle.trim()) return;
    setIsSubmittingAction(true);
    try {
      await createIncident({
        projectId,
        title: incidentTitle.trim(),
        severity: incidentSeverity,
        summary: incidentSummary.trim() || 'Operational incident declared by engineer.',
        status: 'Investigating'
      });
      showToast(`Incident "${incidentTitle}" declared successfully!`);
      setIncidentTitle('');
      setIncidentSummary('');
      setIsDeclareIncidentOpen(false);
      await loadAllProjectTelemetry();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to declare incident.';
      showToast(`⚠️ ${msg}`);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B1F] text-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-purple-400">
          <Sparkles className="w-6 h-6 animate-spin" />
          <span className="text-sm font-semibold">Loading Unified Project Telemetry & Observability Dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="min-h-screen bg-[#050B1F] text-slate-100 flex items-center justify-center p-6">
        <div className="glass-panel rounded-3xl p-10 max-w-lg w-full text-center space-y-5 border border-rose-500/30">
          <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Project Dashboard Unavailable</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {error || 'This project could not be loaded. It may not exist or you may not have access to it.'}
          </p>
          <button
            onClick={() => navigate('/monitor')}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all"
          >
            Go to Main Dashboard
          </button>
        </div>
      </div>
    );
  }

  const defaultAiSummary = {
    title: 'System Operating Within SLA Norms',
    description: 'All core microservices, database clusters, and API endpoints are operating within baseline performance thresholds.',
    impact: 'Nominal Operational State',
    revenueImpact: '$0 Active Risk',
    userImpact: '0 Impacted Users'
  };

  const projectName = projectData?.project?.name || projectData?.projectName || 'Project Dashboard';
  const systemHealthScore = healthExplanation?.currentHealth ?? projectData?.health?.score ?? projectData?.systemHealthScore ?? 100;
  const businessHealthScore = projectData?.health?.businessScore ?? projectData?.businessHealthScore ?? 100;
  const healthyServicesCount = projectData?.summary?.totalServices ?? projectData?.healthyServicesCount ?? 0;
  const activeIncidentsCount = projectData?.summary?.activeIncidents ?? projectData?.activeIncidentsCount ?? 0;
  const usersImpacted = projectData?.summary?.impactedUsers ?? projectData?.usersImpacted ?? 0;

  const aiSummary = (projectData?.health?.aiSummary && typeof projectData.health.aiSummary === 'object')
    ? projectData.health.aiSummary
    : (projectData?.aiSummary && typeof projectData.aiSummary === 'object')
      ? projectData.aiSummary
      : defaultAiSummary;

  const services = Array.isArray(projectData?.serviceOverview)
    ? projectData.serviceOverview
    : Array.isArray(projectData?.services)
      ? projectData.services
      : [];

  const recentIncidents = Array.isArray(projectData?.incidentOverview)
    ? projectData.incidentOverview
    : Array.isArray(projectData?.recentIncidents)
      ? projectData.recentIncidents
      : [];

  const monitoringOverview = projectData?.monitoringOverview || {
    monitoringStatus: 'Verified',
    lastCheckedAt: new Date(),
    telemetryProvider: 'OpenTelemetry',
    monitoringReadinessScore: 100
  };

  const feState = monitoringOverview.frontend?.status || (monitoringOverview.frontend?.enabled ? 'Verified' : 'Not Configured');
  const beState = monitoringOverview.backend?.status || (monitoringOverview.backend?.enabled ? 'Verified' : 'Not Configured');
  const dbState = monitoringOverview.database?.status || (monitoringOverview.database?.enabled ? 'Verified' : 'Not Configured');

  // Fetch category-specific failures from backend (with errorType filter)
  const fetchCategoryFailures = async (category) => {
    if (!category) return;
    setCategoryLoading(true);
    try {
      // Map UI category name → backend errorType param
      const errorTypeMap = {
        'Timeouts': 'Timeout',
        'HTTP 4xx': 'HTTP4xx',
        'HTTP 5xx': 'HTTP5xx',
        'DNS Failures': 'DNSFailure',
        'SSL Failures': 'SSLFailure',
        'Metrics Fails': 'MetricsVerification'
      };
      const records = await getRecentVerificationFailures({
        projectId,
        errorType: errorTypeMap[category] || category,
        limit: 50
      });
      setCategoryFailureDetails(Array.isArray(records) ? records : []);
    } catch {
      // Fallback to local filtering
      setCategoryFailureDetails(getCategoryFailures(category));
    } finally {
      setCategoryLoading(false);
    }
  };

  // Filtered Failures for Category Modal (local fallback)
  const getCategoryFailures = (category) => {
    if (!category) return [];
    if (category === 'Timeouts') {
      return recentFailures.filter((f) => f.errorType === 'Timeout' || f.statusCode === 504);
    }
    if (category === 'HTTP 4xx') {
      return recentFailures.filter((f) => f.errorType === 'HTTP4xx' || (f.statusCode >= 400 && f.statusCode < 500));
    }
    if (category === 'HTTP 5xx') {
      return recentFailures.filter((f) => f.errorType === 'HTTP5xx' || f.statusCode >= 500);
    }
    if (category === 'DNS Failures') {
      return recentFailures.filter((f) => f.errorType === 'DNSFailure');
    }
    if (category === 'SSL Failures') {
      return recentFailures.filter((f) => f.errorType === 'SSLFailure');
    }
    if (category === 'Metrics Fails') {
      return recentFailures.filter((f) => f.targetType === 'Metrics' || f.errorType === 'MetricsVerification');
    }
    return recentFailures;
  };

  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-100 flex relative overflow-x-hidden selection:bg-purple-500 selection:text-white">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-purple-200 text-xs md:text-sm font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab="Project Dashboard"
        onOpenCopilot={() => setIsCopilotOpen(true)}
        context="project"
        selectedProject={{ id: projectId, name: projectName }}
        onBackToOrganization={() => navigate('/monitor')}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">

        {/* Top Header */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onRefresh={handleRefresh}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          dashboardView="project"
          selectedProject={{ id: projectId, name: projectName }}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto w-full">

          {/* Top Breadcrumb Context Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/monitor')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-semibold hover:border-purple-500/40 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-purple-400" />
                <span>Main Dashboard</span>
              </button>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-extrabold text-white">{projectName}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${systemHealthScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                System Health: {systemHealthScore}%
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Business Health: {businessHealthScore}%
              </span>
              <button
                onClick={() => setIsEditConfigOpen(true)}
                className="px-3 py-1 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Configuration</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Delete Project from Database"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>
            </div>
          </div>

          {/* AI Copilot Intelligence Card */}
          <AIInsightsCard projectId={projectId} onOpenCopilot={() => setIsCopilotOpen(true)} />

          {/* Target Monitoring & Deployment Status Banner */}
          <div className="p-4 rounded-2xl glass-panel border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Activity className="w-5 h-5 animate-pulse text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Monitoring Configuration Status:</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${monitoringOverview.monitoringStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                    {monitoringOverview.monitoringStatus} ({monitoringOverview.monitoringReadinessScore || 100}/100 Score)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <span>Provider: <strong className="text-purple-300">{monitoringOverview.telemetryProvider || 'OpenTelemetry'}</strong></span>
                  {monitoringOverview.lastCheckedAt && (
                    <span>Last Verification: <strong className="text-slate-200">{new Date(monitoringOverview.lastCheckedAt).toLocaleTimeString()}</strong></span>
                  )}
                </div>
              </div>
            </div>

            {/* Target Status Badges */}
            <div className="flex items-center gap-2.5 text-xs flex-wrap">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">Frontend:</span>
                <strong className={feState === 'Verified' ? 'text-emerald-400 font-bold' : feState === 'Not Configured' ? 'text-slate-500 font-semibold' : 'text-amber-400'}>
                  {feState}
                </strong>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-slate-400">Backend:</span>
                <strong className={beState === 'Verified' ? 'text-emerald-400 font-bold' : beState === 'Not Configured' ? 'text-slate-500 font-semibold' : 'text-amber-400'}>
                  {beState}
                </strong>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Database:</span>
                <strong className={dbState === 'Verified' ? 'text-emerald-400 font-bold' : dbState === 'Not Configured' ? 'text-slate-500 font-semibold' : 'text-amber-400'}>
                  {dbState}
                </strong>
              </div>
            </div>
          </div>

          {/* SECTION 1: 6 HEALTH CARDS */}
          <section aria-label="Project Health Metrics Cards" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. System Health Score */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>System Health</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">{systemHealthScore}/100</div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${systemHealthScore}%` }} />
              </div>
            </div>

            {/* 2. Business Health Score */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>Business Health</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-purple-300">{businessHealthScore}/100</div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${businessHealthScore}%` }} />
              </div>
            </div>

            {/* 3. Healthy Services */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>Healthy Services</span>
                <Server className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-lg font-extrabold text-white line-clamp-1">{services.length} Services</div>
              <p className="text-[11px] text-blue-400 font-medium">{services.filter((s) => (s.status || s.healthStatus) === 'Healthy').length} Active</p>
            </div>

            {/* 4. Active Incidents */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-rose-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>Active Incidents</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-extrabold text-rose-400">{recentIncidents.length} Active</div>
              <p className="text-[11px] text-rose-400 font-medium">Requires Action</p>
            </div>

            {/* 5. Revenue At Risk */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>Revenue At Risk</span>
                <DollarSign className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-sm font-bold text-slate-300">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                  Business Impact Not Configured
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Zero Exposure Recorded</p>
            </div>

            {/* 6. Users Impacted */}
            <div className="glass-panel rounded-2xl p-4 space-y-2 border border-slate-800 hover:border-orange-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span>Users Impacted</span>
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-extrabold text-orange-400">{usersImpacted.toLocaleString()}</div>
              <p className="text-[11px] text-orange-400 font-medium">Active Friction</p>
            </div>
          </section>

          {/* HEALTH SCORE EXPLAINABILITY & MATH FORMULA BREAKDOWN */}
          {healthExplanation && (
            <section className="glass-panel p-4 md:p-5 rounded-3xl border border-purple-500/20 bg-slate-900/90 transition-all">
              <button
                type="button"
                onClick={() => setIsHealthExplanationOpen(!isHealthExplanationOpen)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        Health Score Explainability & Calculation Formulas
                      </h3>
                      <span className="text-[10px] text-purple-300 font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                        {isHealthExplanationOpen ? 'Click to hide breakdown' : 'Click to view breakdown'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Step-by-step mathematical evidence breakdown generating project health score
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                    <span className="text-xs text-slate-400">Health Score:</span>
                    <span className={`text-base font-extrabold ${systemHealthScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {systemHealthScore}%
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isHealthExplanationOpen ? 'rotate-180 text-purple-400' : ''}`} />
                </div>
              </button>

              {/* EXPANDABLE DETAILED BREAKDOWN */}
              {isHealthExplanationOpen && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
                  {/* 4 Contribution Pillars with Explicit Math Explanations */}
                  {healthExplanation.contributions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-2 border-b border-slate-800/60">
                      {/* Availability */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-300 uppercase">1. Availability</span>
                          <span className="text-sm font-black text-rose-400">
                            {Math.abs(healthExplanation.contributions.availabilityContribution || 0)} pts
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          <strong>Math Formula:</strong> 0.4 pts per 1% below 100% Uptime (Max 40 pts).
                        </p>
                        <div className="p-2 rounded-xl bg-slate-900/90 text-[10px] text-slate-300">
                          Configured Target Uptime: <strong className="text-amber-400">{endpointAnalytics?.backend?.availability ?? 100}%</strong>
                        </div>
                      </div>

                      {/* Latency */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-300 uppercase">2. Latency</span>
                          <span className="text-sm font-black text-amber-400">
                            {Math.abs(healthExplanation.contributions.latencyContribution || 0)} pts
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          <strong>Math Formula:</strong> 1 pt per 30ms exceeding 300ms SLA (Max 25 pts).
                        </p>
                        <div className="p-2 rounded-xl bg-slate-900/90 text-[10px] text-slate-300">
                          Avg Target Response: <strong className="text-blue-400">{performance?.avgLatency ?? 0} ms</strong> vs 300ms SLA
                        </div>
                      </div>

                      {/* Failed Checks */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-300 uppercase">3. Probe Fails</span>
                          <span className="text-sm font-black text-rose-400">
                            {Math.abs(healthExplanation.contributions.failedCheckContribution || 0)} pts
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          <strong>Math Formula:</strong> 4 pts per failed probe check on target (Max 20 pts).
                        </p>
                        <div className="p-2 rounded-xl bg-slate-900/90 text-[10px] text-slate-300">
                          Failed Target Probes: <strong className="text-rose-400">{errorsData?.totalFailures ?? 0}</strong> recorded
                        </div>
                      </div>

                      {/* Incidents */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-300 uppercase">4. Incidents</span>
                          <span className="text-sm font-black text-purple-300">
                            {Math.abs(healthExplanation.contributions.incidentContribution || 0)} pts
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          <strong>Math Formula:</strong> Critical = 25, High = 15, Medium = 8, Low = 3.
                        </p>
                        <div className="p-2 rounded-xl bg-slate-900/90 text-[10px] text-slate-300">
                          Active Incidents: <strong className="text-purple-300">{recentIncidents.length}</strong> affecting project
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {healthExplanation.explanations?.map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-200">{exp.category}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {exp.count !== undefined && `Recorded Fails / Incidents: ${exp.count}`}
                            {exp.avgLatency !== undefined && `Avg Latency: ${exp.avgLatency}ms`}
                            {exp.availability !== undefined && `Configured Uptime: ${exp.availability}%`}
                          </div>
                        </div>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          {Math.abs(exp.impact)} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PERFORMANCE INTELLIGENCE WIDGET */}
          <section className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Performance Intelligence</span>
              </h3>
              <span className="text-xs font-semibold text-amber-400">Response & Percentile Telemetry</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Latency</span>
                <div className="text-xl font-extrabold text-amber-400">{performance?.avgLatency ?? 0} <span className="text-xs text-slate-400 font-normal">ms</span></div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">P50 Latency</span>
                <div className="text-xl font-extrabold text-blue-400">{performance?.p50Latency ?? 110} <span className="text-xs text-slate-400 font-normal">ms</span></div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">P95 Latency</span>
                <div className="text-xl font-extrabold text-purple-300">{performance?.p95Latency ?? 280} <span className="text-xs text-slate-400 font-normal">ms</span></div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">P99 Latency</span>
                <div className="text-xl font-extrabold text-rose-400">{performance?.p99Latency ?? 490} <span className="text-xs text-slate-400 font-normal">ms</span></div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">TTFB</span>
                <div className="text-xl font-extrabold text-emerald-400">{performance?.ttfb ?? 55} <span className="text-xs text-slate-400 font-normal">ms</span></div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Checks</span>
                <div className="text-xl font-extrabold text-slate-200">{performance?.requestCount ?? 0}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Failed Checks</span>
                <div className="text-xl font-extrabold text-rose-400">{performance?.failedRequests ?? errorsData?.totalFailures ?? 0}</div>
              </div>
            </div>
          </section>

          {/* FAILURE CLASSIFICATION & INTERACTIVE TARGET ENDPOINT ATTRIBUTION */}
          <section className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Failure Classification & Target Endpoint Attribution</span>
              </h3>
              <span className="text-xs font-semibold text-rose-400">{errorsData?.totalFailures ?? 0} Total Failures (Click cards to inspect)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div
                onClick={() => { setActiveFailureCategory('Timeouts'); fetchCategoryFailures('Timeouts'); }}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-500 transition-all cursor-pointer text-center space-y-1 group hover:scale-[1.02]"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase block group-hover:text-amber-400">Timeouts</span>
                <div className="text-xl font-extrabold text-amber-400">{errorsData?.timeouts ?? 0}</div>
                <span className="text-[9px] text-slate-500 block">HTTP 504 / Max Exceeded</span>
              </div>

              <div
                onClick={() => { setActiveFailureCategory('HTTP 5xx'); fetchCategoryFailures('HTTP 5xx'); }}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-500 transition-all cursor-pointer text-center space-y-1 group hover:scale-[1.02]"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase block group-hover:text-rose-400">HTTP 5xx</span>
                <div className="text-xl font-extrabold text-rose-400">{errorsData?.http5xx ?? 0}</div>
                <span className="text-[9px] text-slate-500 block">Server Internal Errors</span>
              </div>

              <div
                onClick={() => { setActiveFailureCategory('HTTP 4xx'); fetchCategoryFailures('HTTP 4xx'); }}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer text-center space-y-1 group hover:scale-[1.02]"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase block group-hover:text-purple-300">HTTP 4xx</span>
                <div className="text-xl font-extrabold text-purple-300">{errorsData?.http4xx ?? 0}</div>
                <span className="text-[9px] text-slate-500 block">Client / 404 Not Found</span>
              </div>

              <div
                onClick={() => { setActiveFailureCategory('DNS Failures'); fetchCategoryFailures('DNS Failures'); }}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer text-center space-y-1 group hover:scale-[1.02]"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase block group-hover:text-blue-400">DNS Failures</span>
                <div className="text-xl font-extrabold text-blue-400">{errorsData?.dnsFailures ?? 0}</div>
                <span className="text-[9px] text-slate-500 block">Host Lookup Errors</span>
              </div>

              <div
                onClick={() => { setActiveFailureCategory('SSL Failures'); fetchCategoryFailures('SSL Failures'); }}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-500 transition-all cursor-pointer text-center space-y-1 group hover:scale-[1.02]"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase block group-hover:text-emerald-400">SSL Failures</span>
                <div className="text-xl font-extrabold text-emerald-400">{errorsData?.sslFailures ?? 0}</div>
                <span className="text-[9px] text-slate-500 block">Cert / TLS Errors</span>
              </div>

              <div
                onClick={() => { setActiveFailureCategory('Metrics Fails'); fetchCategoryFailures('Metrics Fails'); }}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer text-center space-y-1 group hover:scale-[1.02]"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase block group-hover:text-purple-300">Metrics Fails</span>
                <div className="text-xl font-extrabold text-purple-400">{errorsData?.verificationFailures ?? 0}</div>
                <span className="text-[9px] text-slate-500 block">Endpoint Verification</span>
              </div>
            </div>

            {/* Detailed Target Endpoint Failure Attribution List */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Failure Target Attribution Breakdown (Stored in DB):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div
                  onClick={() => { setActiveFailureCategory('HTTP 4xx'); fetchCategoryFailures('HTTP 4xx'); }}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 cursor-pointer space-y-1 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-rose-300">Backend API Endpoint:</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Recorded <strong className="text-purple-300">{errorsData?.http4xx || 0} HTTP 4xx</strong> errors & <strong className="text-rose-400">{errorsData?.http5xx || 0} HTTP 5xx</strong> errors.
                  </div>
                </div>

                <div
                  onClick={() => { setActiveFailureCategory('Timeouts'); fetchCategoryFailures('Timeouts'); }}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 cursor-pointer space-y-1 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-amber-300">Health & Readiness Endpoint:</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Recorded <strong className="text-amber-400">{errorsData?.timeouts || 0} Timeouts</strong> exceeding response window.
                  </div>
                </div>

                <div
                  onClick={() => { setActiveFailureCategory('Metrics Fails'); fetchCategoryFailures('Metrics Fails'); }}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 cursor-pointer space-y-1 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-purple-300">Metrics Endpoint:</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Recorded <strong className="text-purple-300">{errorsData?.verificationFailures || 0} Verification Fails</strong> during probe execution.
                  </div>
                </div>
              </div>
            </div>
          </section>



          {/* RECENT ACTIVE INCIDENTS */}
          <section aria-label="Recent Incidents" className="glass-panel p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Recent Active Incidents</span>
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-rose-400">{recentIncidents.length} Recorded</span>
                <button
                  onClick={() => setIsDeclareIncidentOpen(true)}
                  className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Declare Incident</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {recentIncidents.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center space-y-3">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs text-emerald-400 font-semibold">No active incidents currently affecting this project.</p>
                  <button
                    onClick={() => setIsDeclareIncidentOpen(true)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 inline-flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Report / Declare Incident</span>
                  </button>
                </div>
              ) : (
                recentIncidents.map((inc, idx) => (
                  <div
                    key={inc._id || inc.id || idx}
                    onClick={() => setSelectedIncident(inc)}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${inc.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                          {inc.severity}
                        </span>
                        <span className="text-xs font-bold text-white">{inc.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{inc.summary || inc.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 hover:text-purple-400 transition-colors" />
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION 5: RECENT PROBE FAILURES LOG */}
          <section className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Recent Probe Failures Log</span>
              </h3>
              <span className="text-xs font-semibold text-rose-400">{recentFailures.length} Logged Events</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {recentFailures.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-emerald-400 font-semibold">No recent verification failures for this project.</p>
                  <p className="text-[11px] text-slate-500 mt-1">All target endpoints responding within SLAs.</p>
                </div>
              ) : (
                recentFailures.map((fail, idx) => (
                  <div key={fail.id || idx} className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/20 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{fail.projectName || projectName}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                        HTTP {fail.statusCode}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span className="font-mono text-purple-300">{fail.targetType}: {fail.endpoint}</span>
                      <span>{new Date(fail.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </main>

        <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          AppDynamics Unified Project Observability Engine v4.50 • Operational Intelligence Platform
        </footer>

      </div>

      {/* MODAL: INTERACTIVE FAILURE CATEGORY DETAIL */}
      {activeFailureCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel p-6 rounded-3xl max-w-2xl w-full border border-purple-500/30 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">
                  {activeFailureCategory} — Probe Failures Inspector
                </h3>
              </div>
              <button onClick={() => { setActiveFailureCategory(null); setCategoryFailureDetails([]); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aggregated Summary Banner */}
            {(() => {
              const countMap = { 'Timeouts': errorsData?.timeouts, 'HTTP 5xx': errorsData?.http5xx, 'HTTP 4xx': errorsData?.http4xx, 'DNS Failures': errorsData?.dnsFailures, 'SSL Failures': errorsData?.sslFailures, 'Metrics Fails': errorsData?.verificationFailures };
              const descMap = { 'Timeouts': 'Probe requests exceeded the maximum response window (HTTP 504 / connection timeout). These indicate slow or unresponsive endpoints.', 'HTTP 5xx': 'Server-side internal errors returned during probe checks. May indicate crashes, overloads, or unhandled exceptions in your backend.', 'HTTP 4xx': 'Client-side errors (e.g. 404 Not Found, 401 Unauthorized) returned by target endpoints. May indicate misconfigured paths or auth issues.', 'DNS Failures': 'DNS resolution failures (ENOTFOUND / EAI_AGAIN) — the probe could not resolve the hostname. Indicates misconfigured or unreachable domain names.', 'SSL Failures': 'TLS/SSL certificate errors encountered during HTTPS probe checks. May indicate expired certs or hostname mismatches.', 'Metrics Fails': 'Verification failures on metrics endpoints — the probe received unexpected responses from /metrics or similar targets.' };
              const colorMap = { 'Timeouts': 'border-amber-500/40 bg-amber-500/10 text-amber-300', 'HTTP 5xx': 'border-rose-500/40 bg-rose-500/10 text-rose-300', 'HTTP 4xx': 'border-purple-500/40 bg-purple-500/10 text-purple-300', 'DNS Failures': 'border-blue-500/40 bg-blue-500/10 text-blue-300', 'SSL Failures': 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300', 'Metrics Fails': 'border-purple-500/40 bg-purple-500/10 text-purple-300' };
              const count = countMap[activeFailureCategory] ?? 0;
              const desc = descMap[activeFailureCategory] ?? '';
              const color = colorMap[activeFailureCategory] ?? 'border-slate-700 bg-slate-800/50 text-slate-300';
              return (
                <div className={`p-4 rounded-2xl border ${color} space-y-1`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider">{activeFailureCategory}</span>
                    <span className="text-2xl font-black">{count} <span className="text-xs font-normal opacity-70">recorded</span></span>
                  </div>
                  <p className="text-[11px] opacity-80 leading-relaxed">{desc}</p>
                </div>
              );
            })()}

            {/* Individual Records */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {categoryLoading ? (
                <div className="p-10 text-center flex flex-col items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-400 animate-spin" />
                  <span className="text-xs text-slate-400 font-semibold">Fetching probe failure records from database...</span>
                </div>
              ) : categoryFailureDetails.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
                  <Info className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400 font-semibold">No individual probe log entries for this category in the current window.</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                    The aggregated count above reflects all recorded instances. Individual probe logs may have a shorter retention window or may be from earlier verification cycles.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {categoryFailureDetails.length} individual probe records found:
                  </span>
                  {categoryFailureDetails.map((fail, idx) => (
                    <div key={fail.id || idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-[10px] uppercase border border-slate-700">{fail.targetType}</span>
                          <span className="font-bold text-white text-[11px]">{fail.projectName || projectName}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/30">
                          {fail.errorType && fail.errorType !== 'Unclassified' ? fail.errorType : `HTTP ${fail.statusCode}`}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-purple-300 break-all bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800/60">
                        {fail.endpoint}
                      </div>
                      {fail.message && fail.message !== `HTTP ${fail.statusCode}` && (
                        <div className="text-[10px] text-rose-400/80 italic">{fail.message}</div>
                      )}
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span>Response: <strong className="text-amber-400">{fail.responseTime || 0} ms</strong></span>
                        <span className="text-slate-500">{new Date(fail.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => { setActiveFailureCategory(null); setCategoryFailureDetails([]); }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}



      {/* MODAL: DECLARE INCIDENT */}
      {isDeclareIncidentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-rose-500/30 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Declare Project Incident</span>
              </h3>
              <button onClick={() => setIsDeclareIncidentOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeclareIncident} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High API Latency Spike on Checkout"
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Severity Level</label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Critical">Critical (-25 Health Pts)</option>
                  <option value="High">High (-15 Health Pts)</option>
                  <option value="Medium">Medium (-8 Health Pts)</option>
                  <option value="Low">Low (-3 Health Pts)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Incident Summary / Impact</label>
                <textarea
                  rows="3"
                  placeholder="Describe root cause investigation..."
                  value={incidentSummary}
                  onChange={(e) => setIncidentSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeclareIncidentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAction}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
                >
                  {isSubmittingAction ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                  <span>Declare Incident</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Investigation Modal */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {/* Edit Monitoring Configuration Modal */}
      {isEditConfigOpen && (
        <EditMonitoringConfigModal
          projectId={projectId}
          projectName={projectName}
          isOpen={isEditConfigOpen}
          onClose={() => setIsEditConfigOpen(false)}
          onSuccess={() => {
            setIsEditConfigOpen(false);
            loadAllProjectTelemetry();
            showToast("Monitoring configuration updated successfully!");
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-rose-500/30 space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Delete Project "{projectName}"?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently delete this project, its service definitions, dependency topologies, and all recorded probe telemetry history. This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 pt-2 justify-center">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteProject}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
              >
                {isDeleting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{isDeleting ? 'Deleting Project...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        projectId={projectId}
        projectName={projectName}
      />

    </div>
  );
}
