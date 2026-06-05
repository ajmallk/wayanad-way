import React, { useState } from 'react';
import { Incident } from '../types';
import { ThumbsUp, AlertTriangle, CloudFog, CloudRain, Clock, User, CheckCircle2, SlidersHorizontal, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IncidentTimelineProps {
  incidents: Incident[];
  onUpvote: (id: string) => void;
  onFilterChange?: (filter: string) => void;
}

export default function IncidentTimeline({
  incidents,
  onUpvote
}: IncidentTimelineProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredIncidents = incidents.filter(inc => {
    if (activeTab === 'all') return inc.status !== 'resolved';
    if (activeTab === 'blocks') return inc.status !== 'resolved' && inc.severity === 'critical';
    return inc.status !== 'resolved' && inc.type === activeTab;
  });

  const getSeverityBadge = (severity: Incident['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-900/40 text-rose-450 border border-rose-500/20';
      case 'high':
        return 'bg-orange-950/40 text-orange-450 border border-orange-500/20';
      case 'medium':
        return 'bg-amber-950/40 text-amber-500 border border-amber-500/10';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  const getIncidentIcon = (type: Incident['type']) => {
    switch (type) {
      case 'stuck_vehicle':
        return <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />;
      case 'accident':
        return <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />;
      case 'weather':
        return <CloudFog className="w-5 h-5 text-indigo-400" />;
      case 'landslide':
        return <CloudRain className="w-5 h-5 text-rose-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  // Convert ISO timestamp to a highly descriptive localized Indian Time or relative elapsed statement
  const getRelativeTime = (isoString: string) => {
    try {
      const timeMs = new Date(isoString).getTime();
      const elapsedMs = Date.now() - timeMs;
      const mins = Math.floor(elapsedMs / 1000 / 60);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins} mins ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs === 1) return '1 hour ago';
      return `${hrs} hours ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div id="incident-feed-panel" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full">
      
      {/* Feed Area Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white font-display tracking-wide">Live Incident Feed</h2>
          <p className="text-slate-400 text-xs">Crowdsourced & official updates from the ghat pass</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 overflow-x-auto self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'blocks', label: 'Blocks' },
            { id: 'stuck_vehicle', label: 'Stalled' },
            { id: 'weather', label: 'Weather' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xxs px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents timeline scroll stage */}
      <div className="flex-1 overflow-y-auto max-h-[385px] pr-2 space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-semibold">No critical hazards reported under this filter</p>
            <p className="text-xs mt-1 text-slate-600">The road route appears to be clear.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-800 pl-4 ml-3 space-y-5">
            <AnimatePresence initial={false}>
              {filteredIncidents.map((inc) => {
                const isCritical = inc.severity === 'critical';
                
                return (
                  <motion.div
                    key={inc.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative group/item"
                  >
                    {/* Dotted indicator nodes */}
                    <div className="absolute -left-[27px] top-1 bg-slate-900 border border-slate-800 rounded-full p-1.5 z-10">
                      {getIncidentIcon(inc.type)}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-850 hover:border-slate-800 hover:bg-slate-950/80 transition-all duration-300">
                      {/* Top banner of Card: Location, Severity */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                        <span className="text-[11px] font-bold text-indigo-400 font-display flex items-center gap-1">
                          📍 {inc.locationName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-bold uppercase p-0.5 px-2 rounded-md ${getSeverityBadge(inc.severity)}`}>
                            {inc.severity}
                          </span>
                          {inc.status === 'clearing' && (
                            <span className="text-[8px] font-bold uppercase bg-cyan-950/40 text-cyan-400 border border-cyan-500/10 p-0.5 px-2 rounded-md animate-pulse">
                              Clearing
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main Title Description */}
                      <h3 className="text-sm font-bold text-slate-200 group-hover/item:text-white transition-colors">
                        {inc.title}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        {inc.description}
                      </p>

                      {/* Expected clearance countdown */}
                      {inc.expectedClearance && (
                        <div className="mt-3 p-2 bg-slate-900/80 border border-slate-850 rounded-lg flex items-center gap-2 text-xxs font-mono text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                          <span>Expected Clearance: <b className="text-white">{inc.expectedClearance}</b></span>
                        </div>
                      )}

                      {/* Card Footer: Metadata and Stateful Upvote button */}
                      <div className="mt-3.5 pt-3 border-t border-slate-900/60 flex items-center justify-between text-xxs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-slate-600" />
                            {getRelativeTime(inc.timestamp)}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <User className="w-3.5 h-3.5 text-slate-600" />
                            By: {inc.reportedBy}
                          </span>
                        </div>

                        {/* Interactive Stateful Counter upvoting */}
                        <button
                          onClick={() => onUpvote(inc.id)}
                          className="flex items-center gap-1.5 stroke-slate-500 text-[10px] text-slate-400 hover:text-indigo-400 bg-slate-900 hover:bg-slate-855 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-indigo-500/25 transition-all cursor-pointer font-mono font-semibold"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Verify ({inc.upvotes})</span>
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-850 text-slate-550 text-xxs flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-slate-600" /> 184 Commuters active on desk
        </span>
        <span className="font-mono">Sync: 100% cloud validated</span>
      </div>

    </div>
  );
}
