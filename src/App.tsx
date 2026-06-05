import React, { useState, useMemo } from 'react';
import { ChuramLocation, Incident, WeatherData, WeatherCondition } from './types';
import { INITIAL_LOCATIONS, INITIAL_INCIDENTS, INITIAL_WEATHER, ADVISORIES } from './data';
import OfflineChuramMap from './components/OfflineChuramMap';
import GhatGoogleMap from './components/GhatGoogleMap';
import ElevationProfile from './components/ElevationProfile';
import RescueDesk from './components/RescueDesk';
import TrafficBentoStats from './components/TrafficBentoStats';
import IncidentTimeline from './components/IncidentTimeline';
import ReportForm from './components/ReportForm';
import Advisories from './components/Advisories';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Compass,
  Navigation,
  Sparkles,
  Wifi,
  CloudFog,
  CheckCircle2,
  ChevronRight,
  Info,
  Search,
  SlidersHorizontal,
  Map,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function App() {
  const [locations, setLocations] = useState<ChuramLocation[]>(INITIAL_LOCATIONS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>('hairpin-5'); // Defaults to the active block loop
  
  // Custom states for usability enrichment
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'clear' | 'slow' | 'heavy' | 'blocked'>('all');
  const [activeMapType, setActiveMapType] = useState<'vector' | 'satellite'>(hasValidKey ? 'satellite' : 'vector');
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Dynamic metrics selectors
  const congestionIndex = useMemo(() => {
    let scoreSum = 0;
    locations.forEach((loc) => {
      if (loc.status === 'slow') scoreSum += 25;
      if (loc.status === 'heavy') scoreSum += 65;
      if (loc.status === 'blocked') scoreSum += 100;
    });
    const maxScore = locations.length * 100;
    return maxScore > 0 ? (scoreSum / maxScore) * 100 : 0;
  }, [locations]);

  const travelTimeMinutes = useMemo(() => {
    const baseTime = 22; // ideal run 14 km
    let delaySum = 0;
    locations.forEach((loc) => {
      if (loc.status === 'slow') delaySum += 4;
      if (loc.status === 'heavy') delaySum += 14;
      if (loc.status === 'blocked') delaySum += 34;
    });
    return baseTime + delaySum;
  }, [locations]);

  const blockCount = useMemo(() => {
    return locations.filter((loc) => loc.status === 'blocked').length;
  }, [locations]);

  const selectedLocation = useMemo(() => {
    return locations.find((l) => l.id === selectedLocationId) || null;
  }, [locations, selectedLocationId]);

  // Handle active weather changes and simulate updates across mountain pass climbs
  const handleWeatherSimulationChange = (condition: WeatherCondition) => {
    let vis = 5000;
    let temp = 28;
    let precip = 0.0;
    let wind = 8;
    
    if (condition === 'misty') {
      vis = 120;
      temp = 22;
      precip = 0.2;
      wind = 10;
    } else if (condition === 'foggy') {
      vis = 35;
      temp = 19;
      precip = 0.8;
      wind = 14;
    } else if (condition === 'rainy') {
      vis = 85;
      temp = 21;
      precip = 4.2;
      wind = 18;
    } else if (condition === 'heavy_rain') {
      vis = 15;
      temp = 17;
      precip = 14.8;
      wind = 26;
    }
    
    setWeather({
      condition,
      temperature: temp,
      visibility: vis,
      precipitation: precip,
      windSpeed: wind,
      lastUpdated: 'Just now'
    });

    // Recalculate node statuses based on climate constraints
    setLocations((prev) =>
      prev.map((loc) => {
        // Retain original trailer blockage at hairpin 5
        if (loc.id === 'hairpin-5') return loc;

        let simulatedStatus: ChuramLocation['status'] = 'clear';
        let customReport = loc.name + ' looking stable.';

        if (condition === 'heavy_rain') {
          if (loc.elevation && loc.elevation > 400) {
            simulatedStatus = 'heavy';
            customReport = 'MONSOON FORCE: Mountain water torrents flowing over loops. Reduced traction. Keep safe distances.';
          } else {
            simulatedStatus = 'slow';
            customReport = 'WET ROAD ACCENTS: Rainfall slick surface. Caution advised.';
          }
        } else if (condition === 'foggy') {
          if (loc.elevation && loc.elevation > 500) {
            simulatedStatus = 'slow';
            customReport = 'RADAR MIST WARNING: Visual range under 35 meters. Mandatory headlight use in upper loops.';
          }
        } else if (condition === 'misty') {
          if (loc.id === 'hairpin-9' || loc.id === 'lakkidi-viewpoint') {
            simulatedStatus = 'slow';
            customReport = 'DAMP BLANKET: Light whispy fog covers summit viewpoints.';
          }
        } else {
          // Sunny
          simulatedStatus = 'clear';
          customReport = 'OPTIMAL TRANSIT: Clean sunny skies, asphalt is dry with excellent tires coefficient.';
        }

        return {
          ...loc,
          status: simulatedStatus,
          lastUpdated: 'Just now',
          details: customReport
        };
      })
    );
  };

  // Feed Upvotes Handler
  const handleUpvote = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, upvotes: inc.upvotes + 1 } : inc))
    );
  };

  // Add Incident and synchronize state with respective locations
  const handleAddReport = (
    newReport: Omit<Incident, 'id' | 'timestamp' | 'upvotes' | 'status'>
  ) => {
    const freshId = `inc-${Date.now()}`;
    const freshIncident: Incident = {
      ...newReport,
      id: freshId,
      timestamp: new Date().toISOString(),
      upvotes: 1,
      status: 'active'
    };

    // Prepend to timeline state
    setIncidents((prev) => [freshIncident, ...prev]);

    // Map severities to traffic colors
    let locationStatus: ChuramLocation['status'] = 'clear';
    if (newReport.severity === 'critical') locationStatus = 'blocked';
    else if (newReport.severity === 'high') locationStatus = 'heavy';
    else if (newReport.severity === 'medium') locationStatus = 'slow';

    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === newReport.locationId
          ? {
              ...loc,
              status: locationStatus,
              lastUpdated: 'Just now',
              details: `DRIVER ALERT: ${newReport.title}. Detail: ${newReport.description}`
            }
          : loc
      )
    );

    // Focus on report node position
    setSelectedLocationId(newReport.locationId);
  };

  const handleSelectLocation = (loc: ChuramLocation) => {
    setSelectedLocationId(loc.id);
  };

  // Filter climbs based on keyword inputs and status chips
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchSearch =
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (loc.hairpinNumber && `curve ${loc.hairpinNumber}`.includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || loc.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [locations, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Dynamic warning banner */}
      <AnimatePresence>
        {blockCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0 }}
            className="bg-rose-600 text-white font-sans font-bold text-xs flex items-center justify-center gap-2 p-2.5 shadow-md relative z-40 overflow-hidden"
          >
            <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
            <span className="uppercase tracking-wide font-mono text-[11px] font-extrabold text-center">
              ALERT: Thamarassery Mountain Pass (NH 766) has active roadblocks. Alternating single lane traffic implemented on heavy curves.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Container Wrap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* Header Hero Branding Area */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 border-b border-slate-900 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-indigo-500/10 to-indigo-650/5 border border-indigo-500/25 text-indigo-400 rounded-2xl shadow-lg ring-1 ring-white/5">
              <Navigation className="w-6 h-6 rotate-45 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display tracking-tight">
                  Churam Traffic Codex
                </h1>
                <span className="h-2.5 w-2.5 relative flex">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 py-0.5 px-1.5 rounded-full bg-emerald-950/40 border border-emerald-555/15 font-bold uppercase tracking-wider">Feed Live</span>
              </div>
              <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                Dynamic visual routing log, real-time weather weather effects, elevation index, & crowd safety monitors for NH 766.
              </p>
            </div>
          </div>

          {/* Quick HUD controls */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xxs">
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-2 px-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-350 flex items-center gap-1.5 transition-all shadow-md cursor-pointer text-xxs font-semibold uppercase tracking-wider"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>GIS API Settings</span>
            </button>
            
            <div className="p-2 px-3.5 bg-indigo-950/20 border border-indigo-900/30 rounded-xl text-indigo-300 flex items-center gap-1.5 shadow-md">
              <Wifi className="w-3.5 h-3.5" />
              <span>Telemetry Connected</span>
            </div>
          </div>
        </header>

        {/* 1. Bento Dashboard Metrics HUD */}
        <TrafficBentoStats
          locations={locations}
          incidents={incidents}
          weather={weather}
          congestionIndex={congestionIndex}
          travelTimeMinutes={travelTimeMinutes}
          blockCount={blockCount}
          onWeatherChange={handleWeatherSimulationChange}
        />

        {/* 2. Main split Screen layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Curve index lookup with altitude profile */}
          <section className="lg:col-span-5 space-y-5">
            
            {/* Interactive Elevation Mountain Altimeter */}
            <ElevationProfile
              locations={locations}
              selectedLocationId={selectedLocationId}
              onSelectLocation={handleSelectLocation}
            />

            {/* Elevation Ascent list container */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-850 shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-505/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-white font-display tracking-wide uppercase">Climber Index Directory</h2>
                  <p className="text-slate-400 text-xxs">Search hairpin loops from Foothills up to Summit viewpoint</p>
                </div>
                <div className="p-1 px-2.5 bg-slate-950 border border-slate-850 rounded text-xxs font-mono text-slate-400 font-bold uppercase tracking-wider">
                  9 Curves Logged
                </div>
              </div>

              {/* Dynamic Search input */}
              <div className="relative mb-3.5">
                <input
                  type="text"
                  placeholder="Look up curves number, name, status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-300 text-xs rounded-xl p-2.5 pl-9 focus:border-indigo-500/80 focus:outline-none placeholder-slate-650 transition-all font-sans"
                />
                <div className="absolute left-3 top-3.5 pointer-events-none text-slate-600">
                  <Search className="w-3.5 h-3.5" />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xxs font-mono text-slate-500 hover:text-white uppercase p-1 px-2 hover:bg-slate-850 rounded transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Status Category Filter Chips */}
              <div className="flex flex-wrap gap-1.5 mb-4 text-xxs font-semibold font-mono border-b border-slate-850/60 pb-3">
                {[
                  { id: 'all', label: 'All Segments', color: 'hover:text-white' },
                  { id: 'clear', label: '🟢 Clear', color: 'text-emerald-450' },
                  { id: 'slow', label: '🟡 Slow/Damp', color: 'text-amber-400' },
                  { id: 'heavy', label: '🟠 Heavy', color: 'text-orange-400' },
                  { id: 'blocked', label: '🔴 Blocked', color: 'text-rose-400' }
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setStatusFilter(chip.id as any)}
                    className={`p-1.5 px-3 rounded-lg transition-all cursor-pointer border ${
                      statusFilter === chip.id
                        ? 'bg-slate-800 border-slate-700 text-white font-extrabold shadow'
                        : 'border-slate-850/40 text-slate-500 hover:bg-slate-950 ' + chip.color
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Sequential loops climbers directory */}
              <div id="elevation-node-list" className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredLocations.length === 0 ? (
                  <div className="py-12 text-center text-slate-600 border border-dashed border-slate-850 rounded-xl my-2">
                    <CheckCircle2 className="w-8 h-8 text-slate-800 mx-auto mb-2" />
                    <p className="text-xs font-semibold">No roadside sectors matched your query</p>
                    <p className="text-[10px] text-slate-700 mt-1">Try relaxing your constraints or query spelling.</p>
                  </div>
                ) : (
                  filteredLocations.map((loc, idx) => {
                    const isSelected = selectedLocationId === loc.id;
                    
                    let statusColor = 'border-slate-850/60 bg-slate-950/20';
                    let statusBullet = 'bg-slate-700';
                    let statusLabel = 'Clear';
                    
                    if (loc.status === 'blocked') {
                      statusColor = 'border-rose-500/20 bg-rose-950/20 shadow';
                      statusBullet = 'bg-rose-500 animate-pulse';
                      statusLabel = 'Blocked';
                    } else if (loc.status === 'heavy') {
                      statusColor = 'border-orange-500/20 bg-orange-950/15';
                      statusBullet = 'bg-orange-500';
                      statusLabel = 'Heavy General';
                    } else if (loc.status === 'slow') {
                      statusColor = 'border-amber-500/10 bg-amber-950/10';
                      statusBullet = 'bg-amber-500';
                      statusLabel = 'Caution / Damp';
                    } else if (loc.status === 'clear') {
                      statusColor = 'border-slate-850 bg-slate-950/25';
                      statusBullet = 'bg-emerald-500';
                      statusLabel = 'Free Flowing';
                    }

                    return (
                      <motion.div
                        key={loc.id}
                        onClick={() => handleSelectLocation(loc)}
                        whileHover={{ x: 2 }}
                        className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 cursor-pointer hover:border-slate-700 group ${
                          isSelected ? 'ring-1 ring-indigo-500/50 border-indigo-500/30 bg-indigo-950/10 shadow-lg' : ''
                        } ${statusColor}`}
                        id={`node-row-${loc.id}`}
                      >
                        {/* Dot loop index */}
                        <div className="flex flex-col items-center flex-shrink-0 mt-1">
                          <span className={`h-2.5 w-2.5 rounded-full ${statusBullet} shadow`} />
                          <span className="w-[1px] h-9 bg-slate-850 mt-1.5 border-dashed" />
                        </div>

                        {/* Node details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <h3 className="text-xs font-bold text-slate-100 group-hover:text-indigo-400 transition-colors truncate font-display">
                              {loc.name}
                            </h3>
                            <span className="text-[9px] font-mono font-bold text-slate-550 shrink-0">
                              el: {loc.elevation}m
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-snug group-hover:line-clamp-none transition-all duration-200">
                            {loc.details}
                          </p>
                          
                          <div className="flex items-center gap-1.5 mt-1.5 text-[8.5px] font-mono text-slate-500 group-hover:text-slate-400">
                            <span className="uppercase text-[8px] font-extrabold flex items-center gap-0.5">
                              Status: <b className={
                                loc.status === 'blocked' ? 'text-rose-400' :
                                loc.status === 'heavy' ? 'text-orange-400' :
                                loc.status === 'slow' ? 'text-amber-500' : 'text-emerald-450'
                              }>{statusLabel}</b>
                            </span>
                            <span>•</span>
                            <span>{loc.lastUpdated}</span>
                          </div>
                        </div>

                        <ChevronRight className={`w-3.5 h-3.5 text-slate-600 transition-all group-hover:text-indigo-400 shrink-0 self-center ${
                          isSelected ? 'translate-x-0.5 text-indigo-400' : ''
                        }`} />
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Travel Rules advisories board */}
            <Advisories advisories={ADVISORIES} />
          </section>

          {/* Right Panel: Map deck and Incident submit log */}
          <section className="lg:col-span-7 space-y-5">
            
            {/* Elegant Map Deck Layout Card */}
            <div className="rounded-2xl border border-slate-850 overflow-hidden shadow-xl bg-slate-900 flex flex-col justify-between">
              
              {/* Map Deck Header */}
              <div className="p-4 bg-slate-950/60 border-b border-slate-855 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-450 font-mono text-[9px] font-bold rounded flex items-center gap-1 uppercase tracking-wider">
                    <Map className="w-3.5 h-3.5" /> GPS Render
                  </div>
                  <h3 className="text-xs font-semibold text-slate-300">NH 766 Mountain pass Interactive</h3>
                </div>

                {/* Satellite VS vector Toggle selection tabs */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                  <button
                    onClick={() => setActiveMapType('vector')}
                    className={`text-[9px] px-2.5 py-1.5 rounded-lg font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      activeMapType === 'vector'
                        ? 'bg-slate-850 text-white'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Schematic view
                  </button>
                  <button
                    onClick={() => {
                      if (!hasValidKey) {
                        setShowConfigModal(true);
                      } else {
                        setActiveMapType('satellite');
                      }
                    }}
                    className={`text-[9px] px-2.5 py-1.5 rounded-lg font-bold font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                      activeMapType === 'satellite'
                        ? 'bg-slate-855 text-indigo-300 border border-indigo-500/10 shadow'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Satellite Map
                    {!hasValidKey && <span className="h-1.5 w-1.5 bg-yellow-450 rounded-full animate-pulse" />}
                  </button>
                </div>
              </div>

              {/* Core Map Stage (Conditional Sat vs Vector) */}
              <div className="p-0 bg-slate-950">
                {activeMapType === 'satellite' && hasValidKey ? (
                  <GhatGoogleMap
                    locations={locations}
                    selectedLocation={selectedLocation}
                    onSelectLocation={handleSelectLocation}
                    apiKey={API_KEY}
                  />
                ) : (
                  <OfflineChuramMap
                    locations={locations}
                    selectedId={selectedLocationId}
                    onSelectLocation={handleSelectLocation}
                  />
                )}
              </div>
            </div>

            {/* Quick Dispatch Contacts Desk */}
            <RescueDesk />

            {/* Incident Alert Form box */}
            <ReportForm
              locations={locations}
              onAddReport={handleAddReport}
            />

            {/* Incident alerts timeline */}
            <IncidentTimeline
              incidents={incidents}
              onUpvote={handleUpvote}
            />

          </section>

        </main>

        {/* Footer */}
        <footer className="mt-14 pt-6 border-t border-slate-900 text-center text-xs text-slate-550 font-mono">
          <p>NHK NH766 Thamarassery Wayanad Churam Traffic Desk • Kozhikode - Wayanad Border, Kerala</p>
          <p className="mt-1 text-[10px] text-slate-650">A beautiful informational Codex. Real-time simulated indicators recalculate dynamically.</p>
        </footer>

      </div>

      {/* Google Maps API configuration modal helpful drawer */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-[450px] w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 relative shadow-2xl"
            >
              <div className="mx-auto w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mb-4 text-indigo-400">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>

              <h3 className="text-base font-bold text-white text-center font-display mb-1">
                How to activate premium Google Satellite Maps
              </h3>
              <p className="text-slate-400 text-[11px] text-center mb-4 leading-relaxed">
                The satellite maps require a Google Cloud Maps javascript API key configured inside your platform environment.
              </p>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">STEP 1. Retrieve Credential</span>
                  <a
                    href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-indigo-300 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    Establish your credential on Google Cloud Console <ChevronRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">STEP 2. Bind Secret key in workspace</span>
                  <ul className="list-decimal list-inside space-y-1.5 text-xxs font-medium text-slate-300">
                    <li>Open <b>Settings</b> represented by the <strong className="text-indigo-300">⚙️ gear</strong> at the top right header.</li>
                    <li>Toggle to the <b>Secrets</b> panel list.</li>
                    <li>Set up a variable named <code>GOOGLE_MAPS_PLATFORM_KEY</code>.</li>
                    <li>Paste your key code as value and click Add.</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowConfigModal(false)}
                className="mt-5 w-full bg-indigo-650 hover:bg-indigo-700 p-2.5 font-bold font-mono text-[10px] text-white uppercase rounded-xl transition-all cursor-pointer shadow-md"
              >
                Dismiss & Continue Sandbox Simulation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
