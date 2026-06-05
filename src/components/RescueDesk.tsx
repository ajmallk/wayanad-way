import React, { useState } from 'react';
import { ShieldAlert, Phone, Copy, Check, Info, HeartPulse, Truck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactInfo {
  id: string;
  service: string;
  number: string;
  description: string;
  icon: React.ReactNode;
}

export default function RescueDesk() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const emergencyContacts: ContactInfo[] = [
    {
      id: 'police',
      service: 'Police Highway Patrol',
      number: '9447025100',
      description: 'NH 766 Speed monitoring, route roadblocks and security.',
      icon: <Phone className="w-4 h-4 text-sky-400" />
    },
    {
      id: 'rescue',
      service: 'Mountain Fire & Rescue Squad',
      number: '04952231210',
      description: 'Accidents, vehicle extractions and landslide clearings.',
      icon: <Activity className="w-4 h-4 text-orange-400 animate-pulse" />
    },
    {
      id: 'medical',
      service: 'Churam Medical Care (Lakkidi)',
      number: '9447600100',
      description: 'Instant trauma response and mountain climber ambulance.',
      icon: <HeartPulse className="w-4 h-4 text-rose-400" />
    },
    {
      id: 'towing',
      service: 'Heavy Crane Towing Coordinators',
      number: '9895311200',
      description: 'Removing stalled multi-axle trailers from hairpin loops.',
      icon: <Truck className="w-4 h-4 text-amber-400" />
    }
  ];

  const handleCopyNumber = (id: string, number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div id="rescue-assistance-panel" className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-xl relative">
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="p-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/10">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white font-display uppercase tracking-wider">Churam Dispatch & Rescue Hub</h2>
          <p className="text-slate-400 text-xxs">Official emergency response hotlines & towing speed-dials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {emergencyContacts.map((contact) => {
          const isCopied = copiedId === contact.id;
          return (
            <div
              key={contact.id}
              className="p-3 bg-slate-950/70 border border-slate-855 rounded-xl hover:border-slate-800 hover:bg-slate-950/90 transition-all duration-300 flex items-start gap-2.5 justify-between group"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800 mt-0.5 shrink-0">
                  {contact.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold text-slate-205 truncate">{contact.service}</h4>
                  <p className="text-white font-mono text-[12px] font-extrabold mt-0.5">{contact.number}</p>
                  <p className="text-[9px] text-slate-400 leading-snug mt-1 line-clamp-1 group-hover:line-clamp-none transition-all duration-200">
                    {contact.description}
                  </p>
                </div>
              </div>

              {/* Copy action button */}
              <button
                onClick={() => handleCopyNumber(contact.id, contact.number)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
                title="Copy number"
              >
                {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-2.5 bg-slate-950 rounded-xl border border-slate-850/60 flex items-start gap-2 text-[10px] text-slate-400 leading-normal">
        <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
        <p>
          Need general help? Emergency response dialing <b className="text-white">112</b> (Highway Patrol desk) works automatically throughout the NH 766 corridor even in dead cell network zones.
        </p>
      </div>
    </div>
  );
}
