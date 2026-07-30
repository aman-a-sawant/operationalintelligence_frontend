import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clock, 
  RotateCw, 
  Bell, 
  Download, 
  Users, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ArrowUpDown,
  AlertTriangle,
  Database,
  Cpu,
  Globe,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp
} from 'lucide-react';

const incidentDataList = [
  {
    id: 'INC-8421',
    title: 'Checkout Service Degradation',
    journey: 'Checkout Journey',
    severity: 'Critical',
    time: '10:24 AM',
    date: 'May 28, 2025',
    rootCause: 'Slow DB queries in Order Service',
    tag: 'Database',
    impactUsers: '8,452 users',
    impactDetail: 'Payments failing',
    revenue: '$642K',
    revenueDetail: 'in next 2 hours',
    revenueLevel: 'high',
    confidence: 92,
    confidenceLabel: 'High',
    status: 'Ongoing'
  },
  {
    id: 'INC-8422',
    title: 'Payment Gateway Timeout',
    journey: 'Payment Journey',
    severity: 'High',
    time: '09:47 AM',
    date: 'May 28, 2025',
    rootCause: 'Timeouts from external gateway',
    tag: 'External Dependency',
    impactUsers: '5,213 users',
    impactDetail: 'Transactions failing',
    revenue: '$222K',
    revenueDetail: 'in next 1 hour',
    revenueLevel: 'high',
    confidence: 86,
    confidenceLabel: 'High',
    status: 'Ongoing'
  },
  {
    id: 'INC-8423',
    title: 'User Login Errors Spike',
    journey: 'Login Journey',
    severity: 'High',
    time: '08:15 AM',
    date: 'May 28, 2025',
    rootCause: 'High error rate in Auth Service',
    tag: 'Application',
    impactUsers: '3,987 users',
    impactDetail: 'Login failures',
    revenue: '$45K',
    revenueDetail: 'in next 1 hour',
    revenueLevel: 'medium',
    confidence: 78,
    confidenceLabel: 'Medium',
    status: 'Investigating'
  },
  {
    id: 'INC-8424',
    title: 'Inventory Service Slowdown',
    journey: 'Booking Journey',
    severity: 'Medium',
    time: '07:32 AM',
    date: 'May 28, 2025',
    rootCause: 'High CPU usage',
    tag: 'Infrastructure',
    impactUsers: '2,123 users',
    impactDetail: 'Booking delays',
    revenue: '$18K',
    revenueDetail: 'in next 3 hours',
    revenueLevel: 'medium',
    confidence: 65,
    confidenceLabel: 'Medium',
    status: 'Investigating'
  },
  {
    id: 'INC-8425',
    title: 'Notification Delivery Delay',
    journey: 'Notification Journey',
    severity: 'Medium',
    time: '06:48 AM',
    date: 'May 28, 2025',
    rootCause: 'Rate limiting by email provider',
    tag: 'External Dependency',
    impactUsers: '1,842 users',
    impactDetail: 'Delayed notifications',
    revenue: '$6K',
    revenueDetail: 'in next 6 hours',
    revenueLevel: 'low',
    confidence: 60,
    confidenceLabel: 'Medium',
    status: 'Monitoring'
  },
  {
    id: 'INC-8426',
    title: 'Search Service Errors',
    journey: 'Search Journey',
    severity: 'Low',
    time: '05:21 AM',
    date: 'May 28, 2025',
    rootCause: 'Null pointer exceptions',
    tag: 'Application',
    impactUsers: '312 users',
    impactDetail: 'Search failures',
    revenue: '$1K',
    revenueDetail: 'in next 6 hours',
    revenueLevel: 'low',
    confidence: 45,
    confidenceLabel: 'Low',
    status: 'Resolved'
  },
  {
    id: 'INC-8427',
    title: 'Reports Service Unavailable',
    journey: 'Reporting Journey',
    severity: 'Critical',
    time: '04:02 AM',
    date: 'May 28, 2025',
    rootCause: 'Service crashed due to OOM',
    tag: 'Infrastructure',
    impactUsers: '1,102 users',
    impactDetail: 'Reports down',
    revenue: '$85K',
    revenueDetail: 'in next 2 hours',
    revenueLevel: 'medium',
    confidence: 91,
    confidenceLabel: 'High',
    status: 'Resolved'
  }
];

export default function IncidentTable({ onSelectIncident }) {
  const navigate = useNavigate();
  const [activeTabFilter, setActiveTabFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('Last 24 hours');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState('10');

  const filterTabs = [
    { label: 'All', count: 28 },
    { label: 'Critical', count: 4 },
    { label: 'High', count: 9 },
    { label: 'Medium', count: 10 },
    { label: 'Low', count: 5 },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const handleRowClick = (inc) => {
    if (onSelectIncident) onSelectIncident(inc);
    navigate(`/incidents/${inc.id || 'INC-8421'}`);
  };

  const filteredIncidents = incidentDataList.filter(inc => {
    const matchesFilter = activeTabFilter === 'All' || inc.severity.toLowerCase() === activeTabFilter.toLowerCase();
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.journey.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTagStyle = (tag) => {
    switch (tag) {
      case 'Database':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/60';
      case 'Infrastructure':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60';
      case 'Application':
        return 'bg-blue-950/60 text-blue-300 border-blue-800/60';
      case 'External Dependency':
        return 'bg-slate-800/70 text-slate-300 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5 shadow-sm shadow-red-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'Ongoing':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            Ongoing
          </span>
        );
      case 'Investigating':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Investigating
          </span>
        );
      case 'Monitoring':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            Monitoring
          </span>
        );
      case 'Resolved':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  const renderConfidenceRing = (percentage, label) => {
    const ringColor = percentage >= 80 ? 'text-emerald-400' : percentage >= 60 ? 'text-amber-400' : 'text-blue-400';

    return (
      <div className="flex items-center gap-2">
        <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
          <svg className="w-7 h-7 transform -rotate-90">
            <circle
              cx="14"
              cy="14"
              r="11"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="14"
              cy="14"
              r="11"
              stroke="currentColor"
              strokeWidth="2.5"
              className={ringColor}
              fill="transparent"
              strokeDasharray="69.11"
              strokeDashoffset={69.11 - (percentage / 100) * 69.11}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[9px] font-extrabold text-white">{percentage}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-100">{percentage}%</span>
          <span className="text-[10px] text-slate-400 font-medium">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* TOP ACTION BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        
        {/* Left: Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incidents or ID..."
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-blue-500/60 text-xs md:text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            /
          </span>
        </div>

        {/* Center: Filter Button */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            <Filter className="w-4 h-4 text-blue-400" />
            <span>Filter</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Time Range Dropdown */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh Incidents"
          >
            <RotateCw className={`w-4 h-4 text-slate-400 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          {/* Notification Button */}
          <button className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center border border-[#050B1F]">
              3
            </span>
          </button>

        </div>

      </div>

      {/* FILTER TABS & EXPORT ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => {
            const isActive = activeTabFilter === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTabFilter(tab.label)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40 ring-2 ring-blue-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Export Button */}
        <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-2 self-end sm:self-auto">
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>Export</span>
        </button>

      </div>

      {/* TABLE CONTAINER */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5">Incident</th>
                <th className="py-4 px-4">Severity</th>
                <th className="py-4 px-4">
                  <div className="flex items-center gap-1">
                    <span>Time</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-5">Root Cause</th>
                <th className="py-4 px-5">Business Impact</th>
                <th className="py-4 px-5">Revenue Loss</th>
                <th className="py-4 px-4">Confidence</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredIncidents.map((inc, index) => (
                <tr
                  key={inc.id}
                  onClick={() => handleRowClick(inc)}
                  className="hover:bg-slate-800/50 transition-colors duration-150 cursor-pointer group"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  
                  {/* Column 1: Incident Number + Title & Journey */}
                  <td className="py-4 px-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30 shrink-0">
                          {inc.id}
                        </span>
                        <div className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                          {inc.title}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium pl-0.5">
                        {inc.journey}
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Severity */}
                  <td className="py-4 px-4">
                    {getSeverityBadge(inc.severity)}
                  </td>

                  {/* Column 3: Time */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5 text-slate-300 font-medium">
                      <div>{inc.time}</div>
                      <div className="text-[10px] text-slate-500">{inc.date}</div>
                    </div>
                  </td>

                  {/* Column 4: Root Cause & Tag */}
                  <td className="py-4 px-5">
                    <div className="space-y-1.5">
                      <div className="font-medium text-slate-200 leading-snug">
                        {inc.rootCause}
                      </div>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${getTagStyle(inc.tag)}`}>
                        {inc.tag}
                      </span>
                    </div>
                  </td>

                  {/* Column 5: Business Impact */}
                  <td className="py-4 px-5">
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-200">{inc.impactUsers}</div>
                        <div className="text-[11px] text-slate-400">{inc.impactDetail}</div>
                      </div>
                    </div>
                  </td>

                  {/* Column 6: Revenue Loss */}
                  <td className="py-4 px-5">
                    <div>
                      <div className={`font-extrabold text-sm ${
                        inc.revenueLevel === 'high' ? 'text-red-400 text-glow-red' :
                        inc.revenueLevel === 'medium' ? 'text-orange-400' :
                        'text-emerald-400'
                      }`}>
                        {inc.revenue}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {inc.revenueDetail}
                      </div>
                    </div>
                  </td>

                  {/* Column 7: Confidence Circular Indicator */}
                  <td className="py-4 px-4">
                    {renderConfidenceRing(inc.confidence, inc.confidenceLabel)}
                  </td>

                  {/* Column 8: Status Pill */}
                  <td className="py-4 px-4">
                    {getStatusPill(inc.status)}
                  </td>

                  {/* Column 9: Row Action */}
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-purple-300 group-hover:border-purple-500/40 group-hover:scale-105 transition-all shadow-sm">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* BOTTOM PAGINATION BAR */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          {/* Left: Range count */}
          <div>
            Showing <span className="font-bold text-white">1</span> to <span className="font-bold text-white">7</span> of <span className="font-bold text-white">28</span> incidents
          </div>

          {/* Center: Pagination */}
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold border border-blue-400/40 shadow-sm shadow-blue-600/30">
              1
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800">
              2
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800">
              3
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800">
              4
            </button>
            <span className="px-1 text-slate-500">...</span>
            <button className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800">
              5
            </button>
            <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Rows per page */}
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2.5 py-1 font-semibold outline-none focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

        </div>

      </div>

    </div>
  );
}
