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
        return <Camera className="w-4 h-4 text-orange-600" />;
      case 'weather':
        return <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getAdvisoryColor = (cat: TravelAdvisory['category']) => {
    switch (cat) {
      case 'restriction':
        return 'border-orange-200 bg-orange-50 text-orange-900';
      case 'weather':
        return 'border-rose-200 bg-rose-50 text-rose-900';
      default:
        return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    }
  };

  return (
    <div id="advisory-rules-panel" className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm font-sans">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-150">
          <HardHat className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display tracking-wide animate-none">Transit & Safety Rules</h2>
          <p className="text-slate-500 text-xs font-medium">Official statutory bylaws for NH 766 pass</p>
        </div>
      </div>

      <div className="space-y-3">
        {advisories.map((adv) => {
          const isExpanded = expandedId === adv.id;
          return (
            <div
              key={adv.id}
              className={`border rounded-xl transition-all duration-300 ${getAdvisoryColor(adv.category)} ${
                isExpanded ? 'ring-1 ring-indigo-500/20 shadow-xs' : ''
              }`}
            >
              {/* Header toggler */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : adv.id)}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 bg-white rounded-lg border border-slate-200/60 shadow-xxs">
                    {getAdvisoryIcon(adv.category)}
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 hover:text-slate-950 transition-colors leading-snug">
                    {adv.title}
                  </h3>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    isExpanded ? 'rotate-90 text-indigo-600' : ''
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
                    <div className="p-3.5 pt-0 border-t border-slate-200/30 text-slate-705 text-xs leading-relaxed font-sans font-medium">
                      {adv.message}
                      
                      {/* Standard emergency hotlines for reference */}
                      {adv.category === 'weather' && (
                        <div className="mt-2.5 p-2 bg-white font-mono text-[10px] rounded border border-slate-150 text-slate-655 flex flex-wrap gap-x-4 gap-y-1 shadow-xxs">
                          <span>Rescue Squad: <b className="text-indigo-650 font-black">9447025100</b></span>
                          <span>Highway Patrol: <b className="text-indigo-650 font-black">100 / 112</b></span>
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

      <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
        <Compass className="w-5 h-5 text-indigo-600 animate-spin-slow flex-shrink-0" />
        <p className="text-[10px] text-slate-600 leading-normal font-sans font-medium">
          Wayanad Ghat climbers are required by state police laws to maintain continuous single-line queues and keep headlights on at all times under foggy sections.
        </p>
      </div>

    </div>
  );
}
