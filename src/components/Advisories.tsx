import React, { useState } from 'react';
import { TravelAdvisory } from '../types';
import { AlertTriangle, ShieldCheck, ChevronRight, HardHat, Camera, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdvisoriesProps {
  advisories: TravelAdvisory[];
}

export default function Advisories({ advisories }: AdvisoriesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getAdvisoryIcon = (cat: TravelAdvisory['category']) => {
    switch (cat) {
      case 'restriction':
        return <Camera className="w-4 h-4 text-orange-400" />;
      case 'weather':
        return <AlertTriangle className="w-4 h-4 text-rose-450 animate-pulse" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getAdvisoryColor = (cat: TravelAdvisory['category']) => {
    switch (cat) {
      case 'restriction':
        return 'border-orange-500/25 bg-orange-950/15';
      case 'weather':
        return 'border-rose-500/25 bg-rose-950/15';
      default:
        return 'border-emerald-500/20 bg-emerald-950/10';
    }
  };

  return (
    <div id="advisory-rules-panel" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
          <HardHat className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-display tracking-wide">Transit & Safety Rules</h2>
          <p className="text-slate-400 text-xs text-shor">Official statutory bylaws for NH 766 pass</p>
        </div>
      </div>

      <div className="space-y-3">
        {advisories.map((adv) => {
          const isExpanded = expandedId === adv.id;
          return (
            <div
              key={adv.id}
              className={`border rounded-xl transition-all duration-300 ${getAdvisoryColor(adv.category)} ${
                isExpanded ? 'ring-1 ring-indigo-500/30' : ''
              }`}
            >
              {/* Header toggler */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : adv.id)}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 bg-slate-900 rounded-lg border border-slate-800">
                    {getAdvisoryIcon(adv.category)}
                  </div>
                  <h3 className="text-xs font-semibold text-slate-200 hover:text-white transition-colors leading-snug">
                    {adv.title}
                  </h3>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                    isExpanded ? 'rotate-90 text-indigo-400' : ''
                  }`}
                />
              </button>

              {/* Detail body */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 pt-0 border-t border-slate-900/40 text-slate-300 text-xs leading-relaxed">
                      {adv.message}
                      
                      {/* Standard emergency hotlines for reference */}
                      {adv.category === 'weather' && (
                        <div className="mt-2.5 p-2 bg-slate-950 font-mono text-[10px] rounded border border-slate-900 text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                          <span>Rescue Squad: <b className="text-white">9447025100</b></span>
                          <span>Highway Patrol: <b className="text-white">100 / 112</b></span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center gap-3">
        <Compass className="w-5 h-5 text-indigo-400 animate-spin-slow flex-shrink-0" />
        <p className="text-[10px] text-slate-400 leading-normal">
          Wayanad Ghat climbers are required by state police laws to maintain continuous single-line queues and keep headlights on at all times under foggy sections.
        </p>
      </div>

    </div>
  );
}
