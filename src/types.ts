export type TrafficStatus = 'clear' | 'slow' | 'heavy' | 'blocked';

export type WeatherCondition = 'sunny' | 'misty' | 'rainy' | 'heavy_rain' | 'foggy';

export type LocationType = 'hairpin' | 'viewpoint' | 'landmark';

export interface ChuramLocation {
  id: string;
  name: string;
  type: LocationType;
  lat: number;
  lng: number;
  status: TrafficStatus;
  lastUpdated: string;
  details: string;
  hairpinNumber?: number;
  elevation?: number; // Elevation in meters
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  locationId: string;
  locationName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string; // ISO string or relative time
  reportedBy: string;
  upvotes: number;
  type: 'accident' | 'stuck_vehicle' | 'landslide' | 'construction' | 'weather' | 'general';
  expectedClearance?: string; // Expected clearance time details
  status: 'active' | 'clearing' | 'resolved';
}

export interface WeatherData {
  condition: WeatherCondition;
  temperature: number; // in Celsius
  visibility: number; // in meters
  precipitation: number; // in mm/hr
  windSpeed: number; // in km/h
  lastUpdated: string;
}

export interface TravelAdvisory {
  id: string;
  category: 'restriction' | 'weather' | 'notice';
  title: string;
  message: string;
  isActive: boolean;
}
