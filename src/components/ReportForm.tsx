import React, { useState } from 'react';
import { ChuramLocation, Incident } from '../types';
import { Send, MapPin, AlertTriangle, Clock, User, ShieldAlert, BadgeInfo } from 'lucide-react';

interface ReportFormProps {
  locations: ChuramLocation[];
  onAddReport: (report: Omit<Incident, 'id' | 'timestamp' | 'upvotes' | 'status'>) => void;
}

export default function ReportForm({ locations, onAddReport }: ReportFormProps) {
  const [locationId, setLocationId] = useState('');
  const [type, setType] = useState<'accident' | 'stuck_vehicle' | 'landslide' | 'construction' | 'weather' | 'general'>('general');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expectedClearance, setExpectedClearance] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Field validations
    if (!locationId) {
      setErrorMsg('Please select the affected section or hairpin curve.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please enter a brief title for the incident.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please write a short description to guide travelers.');
      return;
    }
    if (!reportedBy.trim()) {
      setErrorMsg('Please enter your moniker or role (e.g. "Local Commuter").');
      return;
    }

    const matchedLocation = locations.find(l => l.id === locationId);
    if (!matchedLocation) {
      setErrorMsg('Invalid location point.');
      return;
    }

    // Call callback to inject report into global State
    onAddReport({
      title: title.trim(),
      description: description.trim(),
      locationId,
      locationName: matchedLocation.name,
      severity,
      type,
      expectedClearance: expectedClearance.trim() || undefined,
      reportedBy: reportedBy.trim()
    });

    // Reset Form Fields and trigger satisfaction animations
    setTitle('');
    setDescription('');
    setExpectedClearance('');
    setReportedBy('');
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <div id="reporting-form-panel" className="p-5 rounded-2xl bg-white border border-slate-205 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display tracking-wide animate-none">Report Churam Bottleneck</h2>
          <p className="text-slate-500 text-xs">Help other drivers make informed choices. Submit details below.</p>
        </div>
      </div>

      {isSuccess && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 text-xs flex items-start gap-2.5 animate-fade-in">
          <BadgeInfo className="w-4 h-4 mt-0.5 flex-shrink-0 animate-bounce" />
          <div>
            <p className="font-semibold">Incident Registered Successfully!</p>
            <p className="text-[11px] mt-0.5 text-emerald-600 font-medium">The live feed timeline and congestion metrics have been re-calibrated. Drive safe!</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-150 rounded-xl text-rose-850 text-xs font-mono font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Location & Hazard Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xxs font-semibold uppercase text-slate-500 mb-1.5 font-mono">Affected Location *</label>
            <div className="relative">
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:bg-white focus:outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="">-- Choose Segment --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} {loc.hairpinNumber ? `(Curve ${loc.hairpinNumber})` : ''}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xxs font-semibold uppercase text-slate-500 mb-1.5 font-mono">Hazard Category *</label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:bg-white focus:outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="stuck_vehicle">Stalled cargo truck / Bus</option>
                <option value="accident">Accident spot</option>
                <option value="landslide">Landslide / Rockfall</option>
                <option value="weather">Foggy / Dense Mist</option>
                <option value="construction">Road Maintenance</option>
                <option value="general">Heavy General Slowdown</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Severity Coefficient & Clearance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xxs font-semibold uppercase text-slate-500 mb-1.5 font-mono">Congestion Severity *</label>
            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200">
              {[
                { id: 'low', label: 'Mild', color: 'bg-slate-900 border-slate-800 hover:text-slate-200 text-slate-500' },
                { id: 'medium', label: 'Slow', color: 'text-amber-500 bg-amber-950/20 hover:text-amber-450 border-amber-900/30' },
                { id: 'high', label: 'Heavy', color: 'text-orange-500 bg-orange-950/20 hover:text-orange-450 border-orange-900/30' },
                { id: 'critical', label: 'Blocked', color: 'text-rose-500 bg-rose-950/20 hover:text-rose-450 border-rose-905/30' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSeverity(lvl.id as any)}
                  className={`flex-1 font-mono text-[10px] font-bold py-1.5 rounded-lg border transition-all cursor-pointer ${
                    severity === lvl.id
                      ? 'bg-white text-indigo-700 border-slate-300 shadow-sm font-black animate-none'
                      : 'text-slate-500 hover:bg-white border-transparent'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xxs font-semibold uppercase text-slate-500 mb-1.5 font-mono">Est. Clearance (optional)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. '45 mins' or 'By 3:00 PM'"
                value={expectedClearance}
                onChange={(e) => setExpectedClearance(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 px-3 focus:bg-white focus:outline-none placeholder-slate-400 font-medium"
              />
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xxs font-semibold uppercase text-slate-500 mb-1.5 font-mono">Short Update Title *</label>
          <input
            type="text"
            placeholder="e.g. 'Stuck tourist van on bend 6 lane'"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 px-3 focus:bg-white focus:outline-none placeholder-slate-400 font-medium"
          />
        </div>

        {/* Detailed description */}
        <div>
          <label className="block text-xxs font-semibold uppercase text-slate-500 mb-1.5 font-mono">Describe Situation *</label>
          <textarea
            rows={3}
            placeholder="Provide specific details. Can vehicles pass through alternate lanes? Is there helper support active?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 px-3 focus:bg-white focus:outline-none resize-none leading-relaxed placeholder-slate-400 font-medium"
          />
        </div>

        {/* Commuter Role / Moniker */}
        <div>
          <label className="block text-xxs font-semibold uppercase text-slate-500 mb-1.5 font-mono">Reporter Name / handle *</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 'Sandeep, Taxi Driver' or 'Koyilandy Commuter'"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-805 text-xs rounded-xl p-2.5 px-3 focus:bg-white focus:outline-none placeholder-slate-400 font-medium"
            />
            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm animate-none"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Transmit Live Alert</span>
        </button>
      </form>
    </div>
  );
}
