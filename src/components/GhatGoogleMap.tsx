import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { ChuramLocation } from '../types';
import { Navigation, MapPin, Sparkles } from 'lucide-react';

interface GhatGoogleMapProps {
  locations: ChuramLocation[];
  selectedLocation: ChuramLocation | null;
  onSelectLocation: (location: ChuramLocation) => void;
  apiKey: string;
}

// Controller component to smoothly center and zoom when the parent selection changes
function MapController({ selectedLocation }: { selectedLocation: ChuramLocation | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedLocation) return;
    map.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    // Zoom in a bit closer if it's a specific hairpin bend
    const zoomLevel = selectedLocation.type === 'hairpin' ? 15 : 14;
    map.setZoom(zoomLevel);
  }, [map, selectedLocation]);

  return null;
}

export default function GhatGoogleMap({
  locations,
  selectedLocation,
  onSelectLocation,
  apiKey
}: GhatGoogleMapProps) {
  const [activeInfoWindow, setActiveInfoWindow] = useState<ChuramLocation | null>(null);

  // Sync active info window with external parent selection
  useEffect(() => {
    if (selectedLocation) {
      setActiveInfoWindow(selectedLocation);
    }
  }, [selectedLocation]);

  const getPinProps = (status: ChuramLocation['status']) => {
    switch (status) {
      case 'clear':
        return { background: '#10b981', borderColor: '#065f46', glyphColor: '#ffffff' };
      case 'slow':
        return { background: '#f59e0b', borderColor: '#92400e', glyphColor: '#ffffff' };
      case 'heavy':
        return { background: '#f97316', borderColor: '#9a3412', glyphColor: '#ffffff' };
      case 'blocked':
        return { background: '#e11d48', borderColor: '#9f1239', glyphColor: '#ffffff' };
      default:
        return { background: '#64748b', borderColor: '#334155', glyphColor: '#ffffff' };
    }
  };

  const centerCoord = { lat: 11.4940, lng: 75.9625 }; // Precise center of the Churam Loops span

  return (
    <APIProvider apiKey={apiKey} version="weekly">
      <div id="google-map-panel" className="relative p-0 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden h-[540px] flex flex-col justify-between">
        
        {/* Core Map Stage */}
        <div className="w-full flex-1 relative min-h-[480px]">
          <Map
            defaultCenter={centerCoord}
            defaultZoom={13.5}
            mapId="DEMO_MAP_ID"
            mapTypeControl={true}
            streetViewControl={false}
            fullscreenControl={true}
            gestureHandling="greedy"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
          >
            <MapController selectedLocation={selectedLocation} />

            {/* Custom Google Traffic Overlay can be enabled natively or we place our detailed Pins */}
            {locations.map((loc) => {
              const pinStyles = getPinProps(loc.status);
              const isSelected = selectedLocation?.id === loc.id;
              
              return (
                <AdvancedMarker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  onClick={() => {
                    onSelectLocation(loc);
                    setActiveInfoWindow(loc);
                  }}
                  title={loc.name}
                >
                  <Pin
                    background={pinStyles.background}
                    borderColor={pinStyles.borderColor}
                    glyphColor={pinStyles.glyphColor}
                    scale={isSelected ? 1.3 : 1.0}
                    glyph={loc.hairpinNumber ? `${loc.hairpinNumber}` : '•'}
                  />
                </AdvancedMarker>
              );
            })}

            {/* Native Map InfoWindow overlay */}
            {activeInfoWindow && (
              <InfoWindow
                position={{ lat: activeInfoWindow.lat, lng: activeInfoWindow.lng }}
                onCloseClick={() => {
                  setActiveInfoWindow(null);
                }}
              >
                <div className="p-1 px-[2px] text-slate-900 max-w-[240px]">
                  <div className="flex items-center gap-1.5 justify-between">
                    <h5 className="font-bold text-xs font-display text-slate-900 max-w-[155px] truncate">{activeInfoWindow.name}</h5>
                    <span className={`text-[9px] font-mono leading-none px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      activeInfoWindow.status === 'blocked' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      activeInfoWindow.status === 'heavy' ? 'bg-orange-100 text-orange-850' :
                      activeInfoWindow.status === 'slow' ? 'bg-amber-100 text-amber-850' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {activeInfoWindow.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Elevation: {activeInfoWindow.elevation}m | NH 766
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1 lines-clamp-3 leading-tight">
                    {activeInfoWindow.details}
                  </p>
                  <div className="text-[9px] text-slate-400 mt-1.5 flex justify-between font-mono">
                    <span>GPS: {activeInfoWindow.lat.toFixed(4)}, {activeInfoWindow.lng.toFixed(4)}</span>
                    <span className="font-semibold text-indigo-600">Updated {activeInfoWindow.lastUpdated}</span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>

          {/* Quick HUD Overlay */}
          <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md shadow-sm border border-slate-200 p-1.5 px-3 rounded-lg text-slate-800 text-xxs font-semibold flex items-center gap-1.5 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Google Maps Engine API Loaded</span>
          </div>
        </div>

        {/* Legend strip */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs relative z-10 font-sans">
          <div className="flex items-center text-slate-600 gap-1.5">
            <Navigation className="w-3.5 h-3.5 rotate-45 text-indigo-600" />
            <span className="font-mono text-xxs uppercase tracking-wide font-bold">Live Pin Overlay Layer</span>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: '#10b981' }} />
              <span className="text-[10px] text-slate-600 font-bold font-mono">Clear</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: '#f59e0b' }} />
              <span className="text-[10px] text-slate-600 font-bold font-mono">Slow</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: '#f97316' }} />
              <span className="text-[10px] text-slate-600 font-bold font-mono">Heavy</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full shadow-sm animate-pulse" style={{ backgroundColor: '#e11d48' }} />
              <span className="text-[10px] text-slate-600 font-bold font-mono">Blocked</span>
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
}
