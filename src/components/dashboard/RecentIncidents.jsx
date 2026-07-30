import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  ChevronRight, 
  ShieldAlert, 
  AlertTriangle 
} from 'lucide-react';

const defaultIncidentsList = [
  {
    id: 'INC-101',
    title: 'Checkout API Latency Spike (>850ms)',
    severity: 'Critical',
    severityStyle: 'bg-red-500/20 text-red-400 border-red-500/40',
    users: '12,643 users',
    time: '14 mins ago',
    status: 'Active',
    statusDot: 'bg-red-500 animate-ping',
    statusText: 'text-red-400',
    service: 'Checkout API'
  },
  {
    id: 'INC-102',
    title: 'Stripe Payment Adapter Token Timeout',
    severity: 'High',
    severityStyle: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    users: '4,210 users',
    time: '45 mins ago',
    status: 'Investigating',
    statusDot: 'bg-orange-400',
    statusText: 'text-orange-400',
    service: 'Payment Adapter'
  },
  {
    id: 'INC-201',
    title: 'Warehouse Stock Sync Webhook Delay',
    severity: 'Medium',
    severityStyle: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    users: '1,890 users',
    time: '1 hour ago',
    status: 'Monitoring',
    statusDot: 'bg-amber-400',
    statusText: 'text-amber-400',
    service: 'Stock Sync Service'
  },
  {
    id: 'INC-301',
    title: 'OAuth2 Refresh Token Expire Loop',
    severity: 'Critical',
    severityStyle: 'bg-red-500/20 text-red-400 border-red-500/40',
    users: '8,400 users',
    time: '20 mins ago',
    status: 'Active',
    statusDot: 'bg-red-500 animate-ping',
    statusText: 'text-red-400',
    service: 'Auth Microservice'
  }
];

export default function RecentIncidents({ incidents, onSelectIncident }) {
  const navigate = useNavigate();
  const incidentsToDisplay = incidents && incidents.length > 0 ? incidents : defaultIncidentsList;

  const handleCardClick = (inc) => {
    if (onSelectIncident) onSelectIncident(inc);
    navigate(`/incidents/${inc.id || 'INC-101'}`);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between h-full hover:border-slate-700/80 transition-all">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Project Incidents</h3>
              <p className="text-[11px] text-slate-400">{incidentsToDisplay.length} active events logged</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Live Telemetry
          </span>
        </div>

        {/* Incidents List */}
        <div className="mt-4 space-y-3">
          {incidentsToDisplay.map((inc) => (
            <div
              key={inc.id}
              onClick={() => handleCardClick(inc)}
              className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800/80 hover:border-purple-500/40 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${inc.statusDot || 'bg-red-500'}`} />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30">
                    {inc.id}
                  </span>
                  <h4 className="text-xs lg:text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                    {inc.title}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pl-4">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${inc.severityStyle || 'bg-red-500/20 text-red-400 border-red-500/40'}`}>
                    {inc.severity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    {inc.users || '1,000+ users'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {inc.time || '10 mins ago'}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}

          {incidentsToDisplay.length === 0 && (
            <div className="p-6 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-2">
              <span className="text-xs font-semibold text-emerald-400 block">No Active Incidents</span>
              <p className="text-[11px] text-slate-400">All microservices in this project are running smoothly.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 text-center">
        <button 
          onClick={() => navigate('/incidents')}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-1 w-full"
        >
          <span>View Detailed Incidents Log</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
