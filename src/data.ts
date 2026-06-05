import { ChuramLocation, Incident, WeatherData, TravelAdvisory } from './types';

export const INITIAL_LOCATIONS: ChuramLocation[] = [
  {
    id: 'adivaram',
    name: 'Adivaram (Foothills)',
    type: 'landmark',
    lat: 11.4746,
    lng: 75.9555,
    status: 'clear',
    lastUpdated: '10 mins ago',
    details: 'Churam climbing entry point. Vehicles moving smoothly. Local helpdesk counter active.',
    elevation: 75
  },
  {
    id: 'hairpin-1',
    name: 'Hairpin curve 1 (Chirakappady)',
    type: 'hairpin',
    lat: 11.4770,
    lng: 75.9590,
    status: 'clear',
    lastUpdated: '15 mins ago',
    details: 'First hairpin loop. Smooth ascending flow.',
    hairpinNumber: 1,
    elevation: 110
  },
  {
    id: 'hairpin-2',
    name: 'Hairpin curve 2',
    type: 'hairpin',
    lat: 11.4800,
    lng: 75.9610,
    status: 'clear',
    lastUpdated: '8 mins ago',
    details: 'Clear road. Caution advised on sharp turns during damp situations.',
    hairpinNumber: 2,
    elevation: 180
  },
  {
    id: 'hairpin-3',
    name: 'Hairpin curve 3',
    type: 'hairpin',
    lat: 11.4840,
    lng: 75.9640,
    status: 'slow',
    lastUpdated: '5 mins ago',
    details: 'Minor speed reduction due to visual rubbernecking from the incident uphill.',
    hairpinNumber: 3,
    elevation: 250
  },
  {
    id: 'hairpin-4',
    name: 'Hairpin curve 4',
    type: 'hairpin',
    lat: 11.4870,
    lng: 75.9635,
    status: 'slow',
    lastUpdated: '2 mins ago',
    details: 'Slow moving queue due to a stalled truck on Hairpin 5. Traffic controlled alternatively.',
    hairpinNumber: 4,
    elevation: 310
  },
  {
    id: 'hairpin-5',
    name: 'Hairpin curve 5 (The Big Bend)',
    type: 'hairpin',
    lat: 11.4910,
    lng: 75.9620,
    status: 'blocked',
    lastUpdated: 'Just now',
    details: 'HIGH ALERT. A multi-axle container trailer is unable to clear the inner circle loop. One side completely blocked. Commuters are guided by local volunteers and police. Extreme blocks.',
    hairpinNumber: 5,
    elevation: 370
  },
  {
    id: 'hairpin-6',
    name: 'Hairpin curve 6',
    type: 'hairpin',
    lat: 11.4940,
    lng: 75.9610,
    status: 'slow',
    lastUpdated: '12 mins ago',
    details: 'Vehicle queues extending downward from Hairpin 7.',
    hairpinNumber: 6,
    elevation: 430
  },
  {
    id: 'hairpin-7',
    name: 'Hairpin curve 7 (Peninsula)',
    type: 'hairpin',
    lat: 11.4980,
    lng: 75.9595,
    status: 'slow',
    lastUpdated: '15 mins ago',
    details: 'Alternate single-lane flow allowed under supervision. Expect crawl.',
    hairpinNumber: 7,
    elevation: 510
  },
  {
    id: 'hairpin-8',
    name: 'Hairpin curve 8',
    type: 'hairpin',
    lat: 11.5030,
    lng: 75.9610,
    status: 'clear',
    lastUpdated: '20 mins ago',
    details: 'Relatively free of backlog. Moving normally for downhill vehicles.',
    hairpinNumber: 8,
    elevation: 590
  },
  {
    id: 'hairpin-9',
    name: 'Hairpin curve 9 (The Misty Wrap)',
    type: 'hairpin',
    lat: 11.5090,
    lng: 75.9680,
    status: 'slow',
    lastUpdated: 'Just now',
    details: 'Mist settling fast (Visibility under 30m). Traffic slow but continuous, cautious descending speed.',
    hairpinNumber: 9,
    elevation: 660
  },
  {
    id: 'lakkidi-viewpoint',
    name: 'Lakkidi Viewpoint (Summit)',
    type: 'viewpoint',
    lat: 11.5125,
    lng: 75.9725,
    status: 'slow',
    lastUpdated: '2 mins ago',
    details: 'Heavy fog. Tourists parked on road margin causing slight bottleneck. Police warning issued.',
    elevation: 700
  },
  {
    id: 'chain-tree',
    name: 'The Chain Tree (Churam Exit)',
    type: 'landmark',
    lat: 11.5175,
    lng: 75.9815,
    status: 'clear',
    lastUpdated: '34 mins ago',
    details: 'Exit point clear. Pleasant weather with light breeze.',
    elevation: 720
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    title: 'Stalled Multi-Axle Container Trailer',
    description: 'A 14-wheel industrial cargo trailer is stuck on the sharp inner curve of bend 5 while driving downhill. Rear axles slipped in gravel margin. Recovering operations via heavy crane underway.',
    locationId: 'hairpin-5',
    locationName: 'Hairpin curve 5 (The Big Bend)',
    severity: 'critical',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 mins ago
    reportedBy: 'Kozhikode Traffic Police',
    upvotes: 42,
    type: 'stuck_vehicle',
    expectedClearance: '1 hour 15 mins (Estimated around 12:15 PM)',
    status: 'active'
  },
  {
    id: 'inc-2',
    title: 'Dense Fog & Low Visibility Alert',
    description: 'Thick mountain fog wrapping sections from viewpoint down to Hairpin 8. Visibility drops to less than 30 meters. Driving hazards. Commuters must use fog lamps and strictly avoid overtaking.',
    locationId: 'hairpin-9',
    locationName: 'Hairpin curve 9 (The Misty Wrap)',
    severity: 'high',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    reportedBy: 'KSDMA Weather Drone',
    upvotes: 28,
    type: 'weather',
    expectedClearance: 'Expected to ease partially by afternoon wind velocity',
    status: 'active'
  },
  {
    id: 'inc-3',
    title: 'KSRTC Bus Breakdown',
    description: 'A fast-passenger block has broken down near Hairpin 7 on the inner lane. Small vehicles can pass, but heavy vehicles are halted intermittently.',
    locationId: 'hairpin-7',
    locationName: 'Hairpin curve 7 (Peninsula)',
    severity: 'medium',
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(), // 1h 15m ago
    reportedBy: 'Churam Rescue Wing',
    upvotes: 19,
    type: 'stuck_vehicle',
    expectedClearance: 'Clearing process started. Towing vehicle on site.',
    status: 'clearing'
  }
];

export const INITIAL_WEATHER: WeatherData = {
  condition: 'foggy',
  temperature: 21,
  visibility: 35, // 35 meters
  precipitation: 0.8, // mm/hr
  windSpeed: 14,
  lastUpdated: '10 mins ago'
};

export const ADVISORIES: TravelAdvisory[] = [
  {
    id: 'adv-1',
    category: 'restriction',
    title: 'Heavy Truck Restriction Active',
    message: 'Multi-axle container trailers are strictly prohibited from climbing/descending the Churam between 8:00 AM and 8:00 PM to minimize gridlocks.',
    isActive: true
  },
  {
    id: 'adv-2',
    category: 'weather',
    title: 'Monsoon Alert & Potential Mudslides',
    message: 'Heavy landslide warnings are active. Commuters must maintain a defensive speed of under 20km/h and monitor local warning sirens near Hairpin Bends 2 and 6.',
    isActive: true
  },
  {
    id: 'adv-3',
    category: 'notice',
    title: 'Overtaking Ban Violations Penalities',
    message: 'Wayanad Police have deployed highway patrol cameras on all bends. Illegal overtaking on hairpin loops carries a spot fine of ₹2,000.',
    isActive: true
  }
];
