import React from 'react';
import { ChuramLocation, Incident, WeatherData, WeatherCondition } from '../types';
import { motion } from 'motion/react';
import {
  Gauge,
  Clock,
  ShieldAlert,
  CloudFog,
  CloudRain,
  Sun,
  Timer,
  Info,
  Thermometer,
  Eye,
  Wind,
  CloudLightning,
  CornerDownRight,
  ShieldCheck
} from 'lucide-react';

interface TrafficBentoStatsProps {
  locations: ChuramLocation[];
  incidents: Incident[];
  weather: WeatherData;
  congestionIndex: number;
  travelTimeMinutes: number;
  blockCount: number;
  onWeatherChange?: (condition: WeatherCondition) => void;
}

export default function TrafficBentoStats({
  locations,
  incidents,
  weather,
  congestionIndex,
  travelTimeMinutes,
  blockCount,
  onWeatherChange
}: TrafficBentoStatsProps) {
  // Determine overall status text, colors and warnings
  const getGhatStatus = () => {
    if (blockCount > 0) {
      return {
        label: 'CRITICAL BLOCKAGE',
        desc: 'Hairpin 5 fully blocked. Expect severe climbing delays.',
        color: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
        glow: 'bg-rose-500'
      };
    }
    if (congestionIndex > 50) {
      return {
        label: 'HEAVY GRIDLOCKS',
        desc: 'Frequent stop-and-go queues throughout Churam.',
        color: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
        glow: 'bg-orange-500'
      };
    }
    if (congestionIndex > 25) {
      return {
        label: 'MODERATE SLOWDOWN',
        desc: 'Crawling traffic on curves, drive defensively.',
        color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
        glow: 'bg-amber-500'
      };
    }
    return {
      label: 'FREE FLOWING',
      desc: 'All curves normal. Excellent driving conditions.',
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
      glow: 'bg-emerald-500'
    };
  };

  const status = getGhatStatus();
  const normalTime = 22; // Base time in minutes on a perfectly clear day
  const timeDifference = travelTimeMinutes - normalTime;

  // Weather icon mapping
  const getWeatherIcon = (cond: WeatherData['condition']) => {
    switch (cond) {
      case 'foggy':
        return <CloudFog className="w-7 h-7 text-neutral-400" />;
      case 'misty':
        return <CloudFog className="w-7 h-7 text-cyan-200" />;
      case 'rainy':
        return <CloudRain className="w-7 h-7 text-indigo-400 animate-pulse" />;
      case 'heavy_rain':
        return <CloudLightning className="w-7 h-7 text-sky-400 animate-bounce" />;
      case 'sunny':
        return <Sun className="w-7 h-7 text-amber-400 animate-spin-slow" />;
      default:
        return <Sun className="w-7 h-7 text-slate-400" />;
    }
  };

  const weatherLabel = (cond: WeatherData['condition']) => {
    switch (cond) {
      case 'foggy': return 'Dense Mountain Mist';
      case 'misty': return 'Light Sweeping Fog';
      case 'rainy': return 'Monsoon Rain';
      case 'heavy_rain': return 'Extreme Downpours';
      case 'sunny': return 'Clear / Sunny';
      default: return 'Stable Atmosphere';
    }
  };

  const weatherOptions: { id: WeatherCondition; label: string; icon: React.ReactNode }[] = [
    { id: 'sunny', label: 'Sunny', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'misty', label: 'Mist', icon: <CloudFog className="w-3.5 h-3.5" /> },
    { id: 'foggy', label: 'Fog', icon: <CloudFog className="w-3.5 h-3.5 text-neutral-400" /> },
    { id: 'rainy', label: 'Rain', icon: <CloudRain className="w-3.5 h-3.5" /> },
    { id: 'heavy_rain', label: 'Monsoon', icon: <CloudLightning className="w-3.5 h-3.5 text-rose-300" /> }
  ];

  return (
    <div id="traffic-bento-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
      
      {/* 1. Global Congestion Dial */}
      <motion.div 
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-xl overflow-hidden flex flex-col justify-between relative group"
      >
        <div className="absolute top-0 right-0 p-3 text-slate-800/40 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-300">
          <Gauge className="w-16 h-16" />
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Churam Density</span>
          <span className={`text-[10px] font-mono font-extrabold uppercase rounded p-1 px-2 border ${status.color}`}>
            {congestionIndex.toFixed(0)}% Index
          </span>
        </div>
        
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-display tracking-tight">
            {congestionIndex > 70 ? 'Extreme' : congestionIndex > 40 ? 'Heavy Flow' : congestionIndex > 15 ? 'Moderate' : 'Smooth'}
          </span>
        </div>
        
        {/* Customized Dynamic Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${congestionIndex}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                congestionIndex > 70 ? 'bg-gradient-to-r from-rose-500 to-red-650' :
                congestionIndex > 40 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                congestionIndex > 15 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                'bg-gradient-to-r from-emerald-400 to-emerald-500'
              }`}
            />
          </div>
          <div className="flex justify-between text-slate-500 mt-2 font-mono text-[9px] uppercase tracking-wider font-semibold">
            <span>Adivaram Entry</span>
            <span>Summit Exit</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Real-Time Travel Time Assessor */}
      <motion.div 
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-xl flex flex-col justify-between relative group"
      >
        <div className="absolute top-0 right-0 p-3 text-slate-800/40 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-300">
          <Clock className="w-16 h-16" />
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Simulated Ascent</span>
          <span className="text-[10px] font-mono font-bold text-slate-300 uppercase bg-slate-950 border border-slate-850 p-1 px-2 rounded">
            NH 766 • 14 KM
          </span>
        </div>
        
        <div className="mt-4">
          <div className="text-3xl font-extrabold text-white font-display tracking-tight flex items-baseline gap-1.5">
            {travelTimeMinutes} <span className="text-sm font-medium text-slate-400 uppercase font-sans tracking-wide">minutes</span>
          </div>
          {timeDifference > 0 ? (
            <p className="text-[10px] text-rose-400 mt-1.5 flex items-center gap-1 font-sans leading-none font-medium">
              <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
              Heavy bottleneck: +{timeDifference}m penalty added
            </p>
          ) : (
            <p className="text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1 font-sans leading-none font-medium">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              Optimal conditions: climbing on baseline time
            </p>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Speed Ceiling: <b className="text-slate-200">30 km/h</b></span>
          <span>Average climb: <b className="text-slate-200">{(14 / (travelTimeMinutes / 60)).toFixed(1)} km/h</b></span>
        </div>
      </motion.div>

      {/* 3. Road Hazard Warnings Count */}
      <motion.div 
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-xl flex flex-col justify-between relative group"
      >
        <div className="absolute top-0 right-0 p-3 text-slate-800/40 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-300">
          <ShieldAlert className="w-16 h-16" />
        </div>
        
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Disruption Node Logs</span>
          {blockCount > 0 ? (
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase bg-rose-950/40 p-1 px-2 rounded border border-rose-500/20">
              Active Block
            </span>
          ) : (
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-500/10 p-1 px-2 rounded">
              Route Open
            </span>
          )}
        </div>
        
        <div className="mt-4">
          <div className="text-3xl font-extrabold text-white font-display tracking-tight flex items-baseline gap-1.5">
            {blockCount} <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Closed loop</span>
          </div>
        </div>

        {/* Hazard alert box overlay */}
        <div className="mt-3.5 p-2 bg-slate-950 rounded-xl border border-slate-850 flex items-center gap-2">
          <div className="flex h-1.5 w-1.5 relative shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.glow} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status.glow}`}></span>
          </div>
          <p className="text-[10px] text-slate-300 font-bold truncate uppercase tracking-widest font-mono">
            {status.label}
          </p>
        </div>
      </motion.div>

      {/* 4. Weather Simulation Control Center */}
      <motion.div 
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-xl flex flex-col justify-between relative"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Climate Radar Simulator</span>
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase bg-indigo-950/40 p-1 px-2 rounded border border-indigo-500/10">
            Interactive
          </span>
        </div>

        <div className="flex items-center justify-between py-1 bg-slate-950/40 px-2 rounded-xl border border-slate-850/60 mb-2">
          <div className="flex flex-col">
            <div className="text-lg font-extrabold text-white font-mono flex items-center gap-1 leading-tight">
              <Thermometer className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{weather.temperature}°C</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[130px]">
              {weatherLabel(weather.condition)}
            </span>
          </div>
          <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
            {getWeatherIcon(weather.condition)}
          </div>
        </div>

        {/* Dynamic Simulated weather trigger tab buttons */}
        {onWeatherChange && (
          <div className="mt-1">
            <span className="text-[8px] font-mono font-bold uppercase text-slate-500 tracking-wider block mb-1">Set Simulation Preset:</span>
            <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
              {weatherOptions.map((opt) => {
                const isActive = weather.condition === opt.id;
                return (
                  <button
                    key={opt.id}
                    title={opt.label}
                    onClick={() => onWeatherChange(opt.id)}
                    className={`flex-1 flex items-center justify-center gap-1 text-[9px] font-mono font-bold p-1 rounded-md transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-white border border-slate-755 shadow-md'
                        : 'text-slate-500 hover:text-slate-350 hover:bg-slate-900/60'
                    }`}
                  >
                    {opt.icon}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Real-time Atmospheric Attributes reading */}
        <div className="mt-3 pt-2.5 border-t border-slate-850 flex justify-between gap-1 items-center font-mono text-[9px]">
          <div className="flex flex-col items-center flex-1">
            <span className="text-[8px] uppercase text-slate-500 font-bold">Visibility</span>
            <span className={`font-semibold ${weather.visibility < 100 ? 'text-amber-400' : 'text-slate-300'}`}>
              {weather.visibility}m
            </span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-[8px] uppercase text-slate-500 font-bold">Wind</span>
            <span className="text-slate-300 font-semibold">{weather.windSpeed}k/h</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-[8px] uppercase text-slate-500 font-bold">Precip.</span>
            <span className="text-slate-300 font-semibold">{weather.precipitation}mm</span>
          </div>
        </div>

      </motion.div>

    </div>
  );
}
