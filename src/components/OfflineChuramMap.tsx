import React from 'react';
import { ChuramLocation } from '../types';
import { motion } from 'motion/react';
import { MapPin, Compass, EyeOff, Sparkles, Navigation } from 'lucide-react';

interface OfflineChuramMapProps {
  locations: ChuramLocation[];
  selectedId: string | null;
  onSelectLocation: (location: ChuramLocation) => void;
  isLoading?: boolean;
}

// Coordinate mapping from geographical bounds to a 400x500 box
// Wayanad Churam bounds roughly:
// Lat: [11.470, 11.520] -> Y: [500, 0]
// Lng: [75.950, 75.985] -> X: [0, 400]
const mapGeoToCanvas = (lat: number, lng: number) => {
  const minLat = 11.470;
  const maxLat = 11.520;
  const minLng = 75.950;
  const maxLng = 75.985;

  // Linear scaling
  const pctY = 1 - (lat - minLat) / (maxLat - minLat);
  const pctX = (lng - minLng) / (maxLng - minLng);

  // Pad slightly to prevent boundary clip
  const padX = 40 + pctX * (400 - 80);
  const padY = 40 + pctY * (500 - 80);

  return { x: padX, y: padY };
};

export default function OfflineChuramMap({
  locations,
  selectedId,
  onSelectLocation,
  isLoading = false
}: OfflineChuramMapProps) {
  // Sort locations sequentially to render the route path
  // Hairpins in order: Adivaram, HP1 to HP9, Lakkidi Viewpoint, Chain Tree
  const sortedRoute = [...locations].sort((a, b) => {
    const elevationA = a.elevation || 0;
    const elevationB = b.elevation || 0;
    return elevationA - elevationB;
  });

  // Calculate the SVG path for the NH766 Churam serpentine route
  const getPathData = () => {
    if (sortedRoute.length === 0) return '';
    const points = sortedRoute.map(loc => mapGeoToCanvas(loc.lat, loc.lng));
    
    // Draw smooth bezier curve connecting points
    return points.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      
      // Add winding curves between points to simulate ghat bends
      const prev = points[idx - 1];
      const midX = (prev.x + pt.x) / 2;
      const midY = (prev.y + pt.y) / 2;
      
      // Introduce an engineered weave shift depending on index to simulate hairpins
      const offset = idx % 2 === 0 ? 30 : -30;
      const ctrlX = midX + offset;
      const ctrlY = midY;
      
      return `${acc} Q ${ctrlX} ${ctrlY}, ${pt.x} ${pt.y}`;
    }, '');
  };

  const getStatusColor = (status: ChuramLocation['status']) => {
    switch (status) {
      case 'clear': return 'fill-emerald-500 stroke-emerald-600 bg-emerald-500 text-emerald-500';
      case 'slow': return 'fill-amber-500 stroke-amber-600 bg-amber-500 text-amber-500';
      case 'heavy': return 'fill-orange-500 stroke-orange-600 bg-orange-500 text-orange-500';
      case 'blocked': return 'fill-rose-600 stroke-rose-700 bg-rose-600 text-rose-600';
      default: return 'fill-slate-400 stroke-slate-500 bg-slate-400 text-slate-400';
    }
  };

  return (
    <div id="vector-map-panel" className="relative p-4 md:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden h-[540px] flex flex-col justify-between">
      {/* Absolute Ambient Grid Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-25" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Map Header Controls */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1 px-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xxs font-medium rounded-md flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Vector Engine Active
          </div>
          <span className="text-xs text-slate-400">NH 766 Route Schematic</span>
        </div>
        <div className="text-right flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-emerald-400 font-mono">Telemetry Sync</span>
        </div>
      </div>

      {/* Interactive Vector Stage */}
      <div className="relative flex-1 w-full h-[380px] flex items-center justify-center pointer-events-auto">
        {locations.length === 0 ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto mb-2" />
            <span className="text-slate-400 text-sm">Synthesizing GIS route...</span>
          </div>
        ) : (
          <svg
            viewBox="0 0 400 500"
            className="w-full h-full max-h-[380px] select-none"
            style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.45))' }}
          >
            {/* Mountain Grid Elevation Accents */}
            <line x1="20" y1="40" x2="380" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
            <text x="35" y="35" className="fill-slate-500 font-mono text-[9px]">SUMMIT LAKKIDI (700m - 720m)</text>
            
            <line x1="20" y1="240" x2="380" y2="240" stroke="rgba(255,255,255,0.03)" strokeDasharray="4,4" />
            <text x="35" y="235" className="fill-slate-500 font-mono text-[9px]">MID WAY (370m)</text>

            <line x1="20" y1="460" x2="380" y2="460" stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
            <text x="35" y="455" className="fill-slate-500 font-mono text-[9px]">FOOTHILLS ADIVARAM (75m)</text>

            {/* Inactive Shadow Route (depth layering) */}
            <path
              d={getPathData()}
              fill="none"
              stroke="#0f172a"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
            
            {/* Base Highway Asphalt Road */}
            <path
              d={getPathData()}
              fill="none"
              stroke="#334155"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />

            {/* Dynamic Overlay Coloring Route Segments Based on Density */}
            {sortedRoute.slice(0, -1).map((loc, index) => {
              const nextLoc = sortedRoute[index + 1];
              const ptStart = mapGeoToCanvas(loc.lat, loc.lng);
              const ptEnd = mapGeoToCanvas(nextLoc.lat, nextLoc.lng);
              
              // Segment color determined by worse node status of the two
              let segmentColor = '#10b981'; // green
              if (loc.status === 'blocked' || nextLoc.status === 'blocked') {
                segmentColor = '#e11d48'; // dark rose red
              } else if (loc.status === 'heavy' || nextLoc.status === 'heavy') {
                segmentColor = '#f97316'; // orange
              } else if (loc.status === 'slow' || nextLoc.status === 'slow') {
                segmentColor = '#f59e0b'; // amber
              }

              // Visual highlight path for active segments
              return (
                <path
                  key={`seg-${loc.id}`}
                  d={`M ${ptStart.x} ${ptStart.y} Q ${(ptStart.x + ptEnd.x)/2 + (index % 2 === 0 ? 30 : -30)} ${(ptStart.y + ptEnd.y)/2}, ${ptEnd.x} ${ptEnd.y}`}
                  fill="none"
                  stroke={segmentColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity={loc.status === 'clear' && nextLoc.status === 'clear' ? '0.15' : '0.8'}
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Hairpin Bend Interactive Points */}
            {sortedRoute.map((loc) => {
              const { x, y } = mapGeoToCanvas(loc.lat, loc.lng);
              const isSelected = selectedId === loc.id;
              const statusColor = getStatusColor(loc.status).split(' ')[0];

              return (
                <g
                  key={loc.id}
                  className="cursor-pointer group"
                  onClick={() => onSelectLocation(loc)}
                  id={`marker-node-${loc.id}`}
                >
                  {/* Select Pulse Effect */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      className={`animate-ping ${statusColor}`}
                      opacity="0.30"
                    />
                  )}

                  {/* Core Pin Outline */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? "9" : "6.5"}
                    fill="#1e293b"
                    stroke={isSelected ? "#6366f1" : "rgba(255,255,255,0.4)"}
                    strokeWidth={isSelected ? "2.5" : "1"}
                    className="transition-all duration-300 group-hover:scale-125"
                  />

                  {/* Colored Status Core Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? "5.5" : "4.5"}
                    className={`${statusColor} transition-all duration-300`}
                  />

                  {/* Small Label Indicators for Hairpins */}
                  {loc.hairpinNumber && (
                    <g transform={`translate(${x + 10}, ${y + 3})`}>
                      <rect
                        x="-2"
                        y="-8"
                        width="15"
                        height="11"
                        rx="2"
                        fill="rgba(15, 23, 42, 0.75)"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="0.5"
                        className="group-hover:fill-slate-800"
                      />
                      <text
                        x="1.5"
                        y="1"
                        className="fill-slate-300 font-mono text-[8px] font-bold text-center"
                      >
                        H{loc.hairpinNumber}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Selected Landmark Overlay Card inside Map */}
        {selectedId && (() => {
          const location = locations.find(l => l.id === selectedId);
          if (!location) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 bg-slate-950/95 border border-slate-800/80 p-3 rounded-xl flex items-start gap-3 backdrop-blur-md shadow-2xl z-20 pointer-events-auto"
            >
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                location.status === 'blocked' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' :
                location.status === 'heavy' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/25' :
                location.status === 'slow' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25' :
                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
              }`}>
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white truncate font-display">{location.name}</h4>
                  <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-mono font-bold tracking-wide ${
                    location.status === 'blocked' ? 'bg-rose-900/30 text-rose-400' :
                    location.status === 'heavy' ? 'bg-orange-950/30 text-orange-400' :
                    location.status === 'slow' ? 'bg-amber-950/30 text-amber-500' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {location.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-slate-500 text-xxs font-mono">
                  <span>Elevation: {location.elevation}m</span>
                  <span>•</span>
                  <span>Updated: {location.lastUpdated}</span>
                </div>
                <p className="text-slate-300 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {location.details}
                </p>
              </div>
            </motion.div>
          );
        })()}
      </div>

      {/* Mountain Pass Profile Footer */}
      <div className="relative z-10 p-3 bg-slate-950/60 border border-slate-800/50 rounded-xl flex justify-between items-center text-xs">
        <div className="flex items-center text-slate-400 gap-1.5">
          <Navigation className="w-3.5 h-3.5 rotate-45 text-indigo-400" />
          <span className="font-mono text-xxs">Compass Range</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xxs text-slate-400 font-mono">Clear</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xxs text-slate-400 font-mono">Slow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-xxs text-slate-400 font-mono">Heavy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xxs text-slate-400 font-mono">Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
