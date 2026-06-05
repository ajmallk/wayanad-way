import React from 'react';
import { ChuramLocation } from '../types';
import { motion } from 'motion/react';
import { TrendingUp, Sunrise, Cloud } from 'lucide-react';

interface ElevationProfileProps {
  locations: ChuramLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (location: ChuramLocation) => void;
}

export default function ElevationProfile({
  locations,
  selectedLocationId,
  onSelectLocation
}: ElevationProfileProps) {
  // Sort locations from ascending elevation order
  const sortedByElevation = [...locations].sort((a, b) => (a.elevation || 0) - (b.elevation || 0));

  // Width of graph = 450, Height of graph = 160
  // Pad coordinates slightly to prevent clipping
  const graphWidth = 460;
  const graphHeight = 150;
  const paddingX = 35;
  const paddingY = 25;

  const getCoordinates = (index: number, elevation: number) => {
    const totalPoints = sortedByElevation.length;
    const x = paddingX + (index / (totalPoints - 1)) * (graphWidth - paddingX * 2);

    // Max elevation around 730m, min elevation around 75m
    const minElev = 75;
    const maxElev = 730;
    const heightRange = maxElev - minElev;
    const y = graphHeight - paddingY - ((elevation - minElev) / heightRange) * (graphHeight - paddingY * 2);

    return { x, y };
  };

  // Generate SVG path for the mountain profile line
  const bezierPathData = () => {
    if (sortedByElevation.length === 0) return '';
    return sortedByElevation.reduce((acc, loc, index) => {
      const { x, y } = getCoordinates(index, loc.elevation || 75);
      if (index === 0) return `M ${x} ${y}`;
      
      const prevPt = getCoordinates(index - 1, sortedByElevation[index - 1].elevation || 75);
      // Create a smooth wave climb between nodes
      const cp1x = prevPt.x + (x - prevPt.x) / 3;
      const cp1y = prevPt.y;
      const cp2x = prevPt.x + (2 * (x - prevPt.x)) / 3;
      const cp2y = y;
      
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
    }, '');
  };

  // Generate background closed fill path to show a mountain silhouette
  const silhouettePathData = () => {
    const baseLine = bezierPathData();
    if (!baseLine) return '';
    const firstPt = getCoordinates(0, sortedByElevation[0].elevation || 75);
    const lastPt = getCoordinates(sortedByElevation.length - 1, sortedByElevation[sortedByElevation.length - 1].elevation || 75);
    return `${baseLine} L ${lastPt.x} ${graphHeight - 10} L ${firstPt.x} ${graphHeight - 10} Z`;
  };

  const getNodeColor = (status: ChuramLocation['status']) => {
    switch (status) {
      case 'clear': return 'fill-emerald-400 stroke-emerald-600 bg-emerald-500';
      case 'slow': return 'fill-amber-400 stroke-amber-600 bg-amber-500';
      case 'heavy': return 'fill-orange-400 stroke-orange-655 bg-orange-500';
      case 'blocked': return 'fill-rose-500 stroke-rose-600 bg-rose-500 animate-pulse';
      default: return 'fill-slate-500 stroke-slate-600 bg-slate-500';
    }
  };

  return (
    <div id="elevation-altimeter-deck" className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:100%_25px] opacity-20 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-3 relative z-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-900 font-display tracking-wide uppercase">Vertical Altimeter Profile</h3>
        </div>
        <span className="text-[9px] font-mono font-bold text-slate-500">
          NH 766 Altitude Gradient (75m ➔ 720m)
        </span>
      </div>

      <div className="relative h-[155px] bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center p-1 overflow-visible">
        <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-full select-none overflow-visible">
          <defs>
            {/* Soft linear gradient for the mountain filling */}
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
            </linearGradient>
            {/* Ambient indicator glow */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dotted helper lines for alt levels */}
          <line x1={paddingX} y1={paddingY} x2={graphWidth - paddingX} y2={paddingY} stroke="#0f172a" strokeOpacity="0.05" strokeDasharray="3,3" />
          <text x={graphWidth - paddingX - 10} y={paddingY + 11} className="fill-slate-500 font-mono text-[8px] text-right font-semibold">Summit Lakkidi (700m)</text>

          <line x1={paddingX} y1={(paddingY + graphHeight - paddingY)/2} x2={graphWidth - paddingX} y2={(paddingY + graphHeight - paddingY)/2} stroke="#0f172a" strokeOpacity="0.05" strokeDasharray="3,3" />
          <text x={graphWidth - paddingX - 10} y={(paddingY + graphHeight - paddingY)/2 + 11} className="fill-slate-500 font-mono text-[8px] font-semibold">Midway pass (400m)</text>

          {/* Solid base mountain filled silhouette */}
          <path
            d={silhouettePathData()}
            fill="url(#curveGradient)"
            className="transition-all duration-300"
          />

          {/* Smooth alpine climb line path */}
          <path
            d={bezierPathData()}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0px 3px 4px rgba(99, 102, 241, 0.2))' }}
            className="transition-all duration-300"
          />

          {/* Coordinate Plot Nodes */}
          {sortedByElevation.map((loc, index) => {
            const { x, y } = getCoordinates(index, loc.elevation || 75);
            const isSelected = selectedLocationId === loc.id;
            const nodeClr = getNodeColor(loc.status).split(' ')[0];
            const nodeStrk = getNodeColor(loc.status).split(' ')[1];

            return (
              <g
                key={loc.id}
                className="cursor-pointer group"
                onClick={() => onSelectLocation(loc)}
              >
                {/* Large outer hover active pulse bounds */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "11" : "7"}
                  fill="transparent"
                  className="group-hover:fill-indigo-500/10 transition-all duration-300"
                />

                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="9.5"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="1.5"
                    className="animate-ping"
                    opacity="0.6"
                  />
                )}

                {/* Main plot indicator dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "5" : "3.5"}
                  className={`${nodeClr} transition-all duration-300`}
                  stroke={isSelected ? "#ffffff" : "rgba(15, 23, 42, 0.2)"}
                  strokeWidth={isSelected ? "1.5" : "1"}
                  style={{ filter: isSelected ? 'url(#neonGlow)' : 'none' }}
                />

                {/* Display Altitude values for main terminals */}
                {(index === 0 || index === sortedByElevation.length - 1 || isSelected) && (
                  <g transform={`translate(${x}, ${y - 10})`}>
                    <rect
                      x="-25"
                      y="-12"
                      width="50"
                      height="14"
                      rx="3"
                      fill="#ffffff"
                      stroke={isSelected ? "#6366f1" : "rgba(15, 23, 42, 0.1)"}
                      strokeWidth="0.5"
                    />
                    <text
                      x="0"
                      y="-2"
                      textAnchor="middle"
                      className="fill-slate-800 font-mono text-[8px] font-extrabold"
                    >
                      {loc.elevation}m
                    </text>
                  </g>
                )}

                {/* Small indicator numbers for loops */}
                {loc.hairpinNumber && !isSelected && (
                  <text
                    x={x}
                    y={y + 11}
                    textAnchor="middle"
                    className="fill-slate-500 font-mono text-[7px] group-hover:fill-slate-800 transition-colors font-semibold"
                  >
                    H{loc.hairpinNumber}
                  </text>
                )}

                {/* Floating dynamic label for selection */}
                {isSelected && (
                  <g transform={`translate(${x}, ${y + 15})`}>
                    <rect
                      x="-45"
                      y="1"
                      width="90"
                      height="13"
                      rx="3"
                      fill="#1e1b4b"
                      stroke="#4f46e5"
                      strokeWidth="0.5"
                    />
                    <text
                      x="0"
                      y="10"
                      textAnchor="middle"
                      className="fill-indigo-100 font-mono text-[8px] font-extrabold truncate"
                    >
                      {loc.name.split(' (')[0]}
                    </text>
                  </g>
                )}

              </g>
            );
          })}
        </svg>

        {/* Legend float */}
        <div className="absolute bottom-2 left-3 flex gap-2.5 bg-white/95 p-1 px-2 border border-slate-205 rounded text-[8px] font-bold font-mono text-slate-600 pointer-events-none shadow-xxs">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Clear</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Slow</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Heavy</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Blocked</span>
        </div>
      </div>
    </div>
  );
}
