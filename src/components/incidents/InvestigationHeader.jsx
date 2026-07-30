import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Share2, 
  Bot, 
  ChevronDown, 
  AlertTriangle, 
  Clock, 
  Users, 
  Layers, 
  CheckCircle2, 
  Menu,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function InvestigationHeader({ incidentId = "INC-8421", onOpenCopilot, onOpenMenu }) {
  const navigate = useNavigate();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Breadcrumb + Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Breadcrumbs & Back Navigation */}
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <button 
            onClick={() => navigate('/incidents')}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors font-semibold group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Incidents</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="font-mono text-purple-400 font-bold px-2 py-0.5 bg-purple-500/10 rounded border border-purple-500/30">
            {incidentId}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-bold">Investigation</span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{copiedShare ? "Link Copied!" : "Share"}</span>
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/40 hover:to-indigo-600/40 border border-purple-500/40 text-xs font-bold text-purple-200 shadow-lg shadow-purple-600/20 hover:scale-[1.02] transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>AI Copilot</span>
          </button>

          {/* Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <span>Actions</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isActionsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isActionsOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0B1536] border border-slate-800 shadow-2xl z-50 py-1.5 backdrop-blur-xl">
                <button 
                  onClick={() => setIsActionsOpen(false)}
                  className="w-full px-3.5 py-2 text-xs text-left text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Execute Auto-Remediation
                </button>
                <button 
                  onClick={() => setIsActionsOpen(false)}
                  className="w-full px-3.5 py-2 text-xs text-left text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Rollback Deployment v2.4.1
                </button>
                <button 
                  onClick={() => setIsActionsOpen(false)}
                  className="w-full px-3.5 py-2 text-xs text-left text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Generate Postmortem RCA
                </button>
                <div className="my-1 border-t border-slate-800" />
                <button 
                  onClick={() => setIsActionsOpen(false)}
                  className="w-full px-3.5 py-2 text-xs text-left text-red-400 hover:bg-red-500/10 transition-colors font-semibold"
                >
                  Mark as Resolved
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Main Title + Metadata Banner Row */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Title & Badge */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="text-purple-400 font-mono">{incidentId}</span>
              <span>Checkout API Errors</span>
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5 shadow-sm shadow-red-500/20 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              CRITICAL
            </span>
          </div>

          {/* Incident Summary Metadata Pills */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Detected: <strong className="text-slate-100">May 24, 10:24 AM</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Duration: <strong className="text-amber-400">36m 24s</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-orange-400" />
              Affected Users: <strong className="text-orange-400 font-bold">824</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Services: <strong className="text-slate-100">3</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Open
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
