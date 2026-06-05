import React, { useState, useMemo, useEffect } from 'react';
import { ChuramLocation, Incident, WeatherCondition } from './types';
import { INITIAL_LOCATIONS, INITIAL_INCIDENTS } from './data';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Phone,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Info,
  MapPin,
  Send,
  Volume2,
  PhoneCall,
  Sun,
  CloudFog,
  CloudRain,
  Undo2,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // ---- ACCESSIBILITY AND LOCALIZATION STATES ----
  const [largeText, setLargeText] = useState<boolean>(true); // Default to big text helper for older/child users!
  const [useMalayalam, setUseMalayalam] = useState<boolean>(false);

  // ---- APP CORE STATUS STATES ----
  const [locations, setLocations] = useState<ChuramLocation[]>(() => {
    const local = localStorage.getItem('churam_locations');
    return local ? JSON.parse(local) : INITIAL_LOCATIONS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const local = localStorage.getItem('churam_incidents');
    return local ? JSON.parse(local) : INITIAL_INCIDENTS;
  });

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>('hairpin-5');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ---- SIMPLIFIED REPORT FORM STATES ----
  const [formLocationId, setFormLocationId] = useState<string>('hairpin-5');
  const [formBlockType, setFormBlockType] = useState<string>('stuck_vehicle');
  const [formDetails, setFormDetails] = useState<string>('');
  const [formReporter, setFormReporter] = useState<string>('');

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('churam_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('churam_incidents', JSON.stringify(incidents));
  }, [incidents]);

  // ---- DYNAMIC CALCULATIONS ----
  const activeBlocks = useMemo(() => {
    return locations.filter((loc) => loc.status === 'blocked');
  }, [locations]);

  const selectedLocation = useMemo(() => {
    return locations.find((l) => l.id === selectedLocationId) || null;
  }, [locations, selectedLocationId]);

  // Translate labels for Kids & Elders (English & Malayalam)
  const trans = {
    title: useMalayalam ? 'ചുരം റോഡ് അലേർട്ടുകൾ (NH 766)' : 'Churam Live Traffic Companion',
    subtitle: useMalayalam 
      ? 'കുട്ടികൾക്കും മുതിർന്നവർക്കും വളരെ എളുപ്പത്തിൽ മനസ്സിലാക്കാവുന്ന താമരശ്ശേരി ചുരം യാത്രാ വിവരങ്ങൾ.' 
      : 'NH 766 Thamarassery Ghat Pass Real-Time Roadblock Alerts. Easy to read for grandparents and children.',
    bigTextToggle: useMalayalam ? '🔠 വലിയ അക്ഷരങ്ങൾ' : '🔠 Extra Large Font',
    standardTextToggle: useMalayalam ? '🔠 സാധാരണ അക്ഷരങ്ങൾ' : '🔠 Standard Font',
    langToggle: useMalayalam ? '🌐 Click for English' : '🌐 മലയാളത്തിൽ വായിക്കുക',
    
    // Quick Bulletin
    noBloxTitle: useMalayalam ? '🟢 യാത്ര ചെയ്യാൻ പൂർണ്ണമായും സുരക്ഷിതം!' : '🟢 ALL CLEAR! ROAD IS OPEN',
    noBloxDesc: useMalayalam 
      ? 'ചുരത്തിൽ എവിടെയും ഇപ്പോൾ ഗതാഗത തടസ്സങ്ങൾ ഇല്ല. വേഗത കുറച്ചു ശ്രദ്ധയോടെ വണ്ടി ഓടിക്കുക.' 
      : 'No active road blocks! Vehicles are moving normally across all hairpin climbs.',
    bloxTitle: useMalayalam ? '🛑 ഗതാഗത തടസ്സം റിപ്പോർട്ട് ചെയ്തിട്ടുണ്ട്!' : '🛑 ROAD BLOCK ALERT!',
    bloxDesc: useMalayalam 
      ? `ചുരത്തിൽ ഇപ്പോൾ ${activeBlocks.length} സ്ഥലത്ത് റോഡ് തടസ്സപ്പെട്ടിരിക്കുന്നു. താഴെയുള്ള വിവരങ്ങൾ കാണുക.` 
      : `Warning: Road closed/blocked at ${activeBlocks.length} location(s) on the mountain pass right now.`,
    
    locationOfBlock: useMalayalam ? 'തടസ്സമുള്ള കൃത്യമായ സ്ഥലം:' : 'Exact Location of Roadblock:',
    detailsHeader: useMalayalam ? 'വിശദാംശങ്ങൾ:' : 'Details & Status:',
    elevationLabel: useMalayalam ? 'കയറുന്ന ഉയരം:' : 'Climb Elevation:',
    lastUpdatedLabel: useMalayalam ? 'അവസാന പരിശോധന:' : 'Last Check:',
    resolvedActionBtn: useMalayalam ? 'ഇവിടെയുള്ള ബ്ലോക്ക് മാറി എന്ന് രേഖപ്പെടുത്തൂ ✅' : 'I see this section is CLEAR now ✅',
    
    // S-curve Road Climb Ladder representation
    mapTitle: useMalayalam ? 'വഴിയിലെ അവസ്ഥകൾ പരിശോധിക്കൂ (താഴെ നിന്ന് മുകളിലേക്ക്):' : 'Check Road Sections (From Bottom to Top):',
    mapSub: useMalayalam ? 'പച്ച നിറം സുരക്ഷിതമായ വഴിയേയും ചുവപ്പ് നിറം തടസ്സത്തേയും കാണിക്കുന്നു.' : 'Green items list clear sections. Red items indicates blocked spots.',
    bottomMarker: useMalayalam ? '🚗 അടിവാരം (മലയുടെ താഴെ ഭാഗം)' : '🚗 ADIVARAM ENTRY (Foot of Mountain)',
    topMarker: useMalayalam ? '⛰️ ലക്കിടി വ്യൂപോയിന്റ് (മലയുടെ മുകളിൽ)' : '⛰️ LAKKIDI VIEWPOINT (Summit Peak)',
    
    // Simplified reporting form
    formHeader: useMalayalam ? 'റോഡിൽ നിങ്ങൾ തടസ്സം കണ്ടോ? എല്ലാവരേയും അറിയിക്കൂ' : 'Report a Roadblock to Help Others',
    formDesc: useMalayalam ? 'വളരെ ലളിതമായ ഒറ്റ ക്ലിക്ക് വഴി പുതിയ ബ്ലോക്കുകൾ താഴെ റിപ്പോർട്ട് ചെയ്യാം.' : 'Elders & children can easily submit updates. Tell everyone behind you!',
    formLabelWhere: useMalayalam ? '1. എവിടെയാണ് തടസ്സമുള്ളത്?' : '1. Where is the obstacle?',
    formLabelWhat: useMalayalam ? '2. അവിടെ എന്താണ് സംഭവിച്ചത്?' : '2. What is the problem there?',
    formLabelExtra: useMalayalam ? '3. കൂടുതൽ വിവരങ്ങൾ എഴുതാം (ഓപ്ഷണൽ)' : '3. What else can you see? (Written simply)',
    formPlaceholderExtra: useMalayalam ? 'ഉദാ: വലിയ ട്രക്ക് കിടക്കുന്നു, ചെറിയ വണ്ടിക്ക് പോകാം...' : 'e.g., Heavy lorry is stuck on the inside curb.',
    formLabelWho: useMalayalam ? '4. നിങ്ങളുടെ പേര് എഴുതാം' : '4. Your Name (helps to verify)',
    formPlaceholderWho: useMalayalam ? 'ഉദാ: രാഘവേട്ടൻ, അപ്പു (10 വയസ്സ്)...' : 'e.g., Unni (Commuter), Priya (Teacher)...',
    formSubmit: useMalayalam ? '📣 ഈ വിവരം എല്ലാവർക്കും കൈമാറൂ' : '📣 Broadcast Alert to Travellers',
    
    // Emergency numbers
    emergencyHeader: useMalayalam ? 'അടിയന്തിര സഹായത്തിന് ഇവിടെ നേരിട്ട് വിളിക്കാം:' : 'Emergency Numbers (Direct Touch Dial):',
    policeLabel: useMalayalam ? 'ഹൈവേ പോലീസ് കൺട്രോൾ റൂം' : 'Highway Police Desk',
    rescueLabel: useMalayalam ? 'ഫയർ & ചുരം റെസ്ക്യൂ വിങ്' : 'Fire & Mountain Rescue',
    medicalLabel: useMalayalam ? 'ആംബുലൻസ് / ട്രോമാകെയർ' : 'Ghat Pass Ambulance Service',
    
    resetBtn: useMalayalam ? 'തത്സമയ വിവരങ്ങൾ സാധാരണ നിലയിലാക്കാൻ ഇവിടെ ഞെക്കൂ (Default Reset)' : 'Reset Portal Status Back for Testing',
    legalFooter: useMalayalam ? 'ഈ വിവരങ്ങൾ വഴിയാത്രക്കാർ നൽകുന്ന തത്സമയ അപ്ഡേറ്റുകളാണ്.' : 'Public crowdsourced companion for Kozhikode-Wayanad NH 766 commuters.',
    hairpinText: useMalayalam ? 'ഹെയർപിൻ വളവ്' : 'Hairpin Curve'
  };

  const handleResolveBlock = (locationId: string) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === locationId
          ? {
              ...loc,
              status: 'clear',
              lastUpdated: 'Just now',
              details: useMalayalam 
                ? 'തടസ്സങ്ങൾ പൂർണ്ണമായി നീക്കി. ഇപ്പോൾ ഇതുവഴിയുള്ള യാത്ര സുരക്ഷിതമാണ്.'
                : 'Road opened! The obstacle was completely cleared and flow is restored.'
            }
          : loc
      )
    );
    setIncidents((prev) =>
      prev.filter((inc) => inc.locationId !== locationId)
    );
    setSelectedLocationId(locationId);
    setSuccessMessage(useMalayalam ? 'തടസ്സം വിജയകരമായി പരിഹരിച്ചു!' : 'Alert resolved! Live status marked as clear.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleResetToNormal = () => {
    localStorage.removeItem('churam_locations');
    localStorage.removeItem('churam_incidents');
    setLocations(INITIAL_LOCATIONS);
    setIncidents(INITIAL_INCIDENTS);
    setSelectedLocationId('hairpin-5');
    setSuccessMessage(useMalayalam ? 'വിവരങ്ങൾ ആദ്യം മുതലുള്ള റൂട്ടിലേക്ക് മാറ്റി!' : 'Route reset to default simulated blockage state.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddLiveIncident = (e: React.FormEvent) => {
    e.preventDefault();

    const targetLoc = locations.find((l) => l.id === formLocationId);
    if (!targetLoc) return;

    let friendlyTitle = 'Obstruction';
    let friendlyDesc = 'Traffic slow down.';

    if (formBlockType === 'stuck_vehicle') {
      friendlyTitle = useMalayalam ? 'വലിയ വാഹനം കേടായി കുടുങ്ങി കിടക്കുന്നു' : 'Heavy Vehicle Stuck on Bend';
      friendlyDesc = useMalayalam 
        ? 'ഒരു വലിയ ബസോ അല്ലെങ്കിൽ ലോറിയോ വളവ് തിരിയാൻ സാധിക്കാതെ വഴി തടസ്സപ്പെടുത്തിയിരിക്കുന്നു.'
        : 'A big transport container or public bus is stuck on the corner. Turning is restricted.';
    } else if (formBlockType === 'accident') {
      friendlyTitle = useMalayalam ? 'ചെറിയ വാഹനാപകടം നടന്നിട്ടുണ്ട്' : 'Minor Collision Accident';
      friendlyDesc = useMalayalam
        ? 'വാഹനാപകടം ഉണ്ടായതിനാൽ പോലീസ് ഗതാഗത നിയന്ത്രണം ഒരുക്കിയിരിക്കുന്നു.'
        : 'A minor vehicle collision. Police are controlling traffic flow alternatively.';
    } else if (formBlockType === 'landslide') {
      friendlyTitle = useMalayalam ? 'റൂട്ടിൽ കല്ലും മണ്ണും വീണിരിക്കുന്നു' : 'Rockfall or Landslide Rocks';
      friendlyDesc = useMalayalam
        ? 'മുകളിലെ കുന്നിൽ നിന്നും ചെറിയ രീതിയിൽ പാറയോ മണ്ണോ റോഡിലേക്ക് വീണിട്ടുണ്ട്.'
        : 'Small stones and mountain mud have slipped onto the tarmac.';
    } else if (formBlockType === 'weather') {
      friendlyTitle = useMalayalam ? 'കനത്ത മഞ്ഞും പുകയും കാരണം ഒന്നും കാണാൻ വയ്യ' : 'Dangerous Heavy Fog & Low Visibility';
      friendlyDesc = useMalayalam
        ? 'വളരെ ശക്തമായ മൂടൽമഞ്ഞ് അനുഭവപ്പെടുന്നുണ്ട്. വഴി കാണാൻ ബുദ്ധിമുട്ടാണ്.'
        : 'Thick blinding fog. Visibility is extremely low.';
    } else {
      friendlyTitle = useMalayalam ? 'വഴി പൂർണ്ണമായും ഒഴിഞ്ഞു' : 'Road Section is Completely Open';
      friendlyDesc = useMalayalam
        ? 'ഗതാഗത തടസ്സങ്ങൾ ഒന്നും തന്നെയില്ല.'
        : 'All blocks cleared. Vehicles are free to pass normally.';
    }

    if (formDetails.trim()) {
      friendlyDesc += ` (Commuter Note: ${formDetails})`;
    }

    const reporterName = formReporter.trim() ? formReporter.trim() : (useMalayalam ? 'യാത്രക്കാരൻ' : 'Kind Commuter');

    // Add Incident
    const newInc: Incident = {
      id: `incident-${Date.now()}`,
      title: friendlyTitle,
      description: friendlyDesc,
      locationId: formLocationId,
      locationName: targetLoc.name,
      severity: formBlockType === 'clear' ? 'low' : 'critical',
      timestamp: 'Just now',
      reportedBy: reporterName,
      upvotes: 1,
      type: formBlockType === 'clear' ? 'general' : (formBlockType as any),
      status: 'active'
    };

    setIncidents((prev) => [newInc, ...prev]);
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === formLocationId
          ? {
              ...loc,
              status: formBlockType === 'clear' ? 'clear' : 'blocked',
              lastUpdated: 'Just now',
              details: friendlyDesc
            }
          : loc
      )
    );

    setSelectedLocationId(formLocationId);
    setFormDetails('');
    setFormReporter('');

    setSuccessMessage(useMalayalam ? 'അലേർട്ട് വിജയകരമായി പ്രക്ഷേപണം ചെയ്തു!' : 'Roadblock report published! Thank you.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className={`min-h-screen bg-[#f1f5f9] text-slate-900 transition-all duration-200 selection:bg-indigo-600 selection:text-white ${largeText ? 'text-lg leading-relaxed' : 'text-sm'}`}>
      
      {/* HEADER BAR: Designed specifically to be bold and clear, and fully SEO indexable */}
      <header className="bg-white border-b-4 border-indigo-600 shadow-sm relative sticky top-0 z-50 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          
          {/* Elderly & Children Inclusive Controls panel */}
          <div className="flex items-center justify-between gap-3 bg-indigo-50 p-3 rounded-2xl flex-wrap">
            
            <button
              id="large-text-btn"
              onClick={() => setLargeText(!largeText)}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white border-2 border-indigo-200 text-indigo-700 font-extrabold text-sm rounded-xl cursor-pointer hover:bg-indigo-100/55 transition-all shadow-xxs"
              aria-label="Toggle larger accessible text size"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>{largeText ? trans.standardTextToggle : trans.bigTextToggle}</span>
            </button>

            <button
              id="malayalam-toggle-btn"
              onClick={() => setUseMalayalam(!useMalayalam)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl cursor-pointer transition-all shadow-sm"
              aria-label="Switch language to Malayalam or English"
            >
              🌐 {trans.langToggle}
            </button>
          </div>

          {/* Simple descriptive Title */}
          <div className="flex items-center gap-2.5 justify-center md:justify-start">
            <div className={`bg-rose-500 text-white p-2.5 rounded-full ${activeBlocks.length > 0 ? 'animate-bounce' : ''}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`${largeText ? 'text-2.5xl md:text-3.5xl' : 'text-xl md:text-2xl'} font-black tracking-tight text-slate-950`}>
                {trans.title}
              </h1>
              <h2 className={`${largeText ? 'text-md md:text-lg' : 'text-xs md:text-sm'} text-slate-500 font-medium`}>
                {trans.subtitle}
              </h2>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">

        {/* Dynamic Interactive Alert Banner: Shows immediately if there are blocks */}
        <div className="space-y-4">
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ transform: 'scale(0.95)', opacity: 0 }}
                animate={{ transform: 'scale(1)', opacity: 1 }}
                exit={{ transform: 'scale(0.95)', opacity: 0 }}
                className="bg-emerald-600 text-white p-4.5 rounded-2xl shadow-md font-bold text-center flex items-center justify-center gap-2"
                id="accessible-toast"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BLOCKAGE QUICK INDICATOR CRITICAL BAR */}
          <div id="blockage-heavy-announcement">
            {activeBlocks.length > 0 ? (
              <div className="bg-red-550 text-white p-6 rounded-3xl shadow-md border-4 border-red-700">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                  <div className="flex items-center gap-4 text-center md:text-left select-none">
                    <span className="text-5xl md:text-6xl" role="img" aria-label="Alert hand signal">🛑</span>
                    <div>
                      <h3 className={`${largeText ? 'text-2xl md:text-3.5xl' : 'text-xl md:text-2xl'} font-black text-rose-100`}>
                        {trans.bloxTitle}
                      </h3>
                      <p className="text-white text-md font-extrabold mt-1">
                        {trans.bloxDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Highlighted exact Blocked hairpin node immediately for children and elders */}
                <div className="mt-5 p-4 bg-red-950/20 border border-white/20 rounded-2xl space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-200 block">
                    ⚠️ {trans.locationOfBlock}
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeBlocks.map((block) => (
                      <div
                        key={block.id}
                        onClick={() => setSelectedLocationId(block.id)}
                        className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div>
                          <strong className="text-white text-md block font-black">
                            📍 {block.name}
                          </strong>
                          <span className="text-xs text-rose-100/90 font-medium">
                            {block.details}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white shrink-0" />
                      </div>
                    ))}
                  </div>

                  {/* Accessible instruction */}
                  <div className="mt-3 p-3 bg-white/10 rounded-xl space-y-1">
                    <p className={`font-extrabold ${largeText ? 'text-sm md:text-md' : 'text-xs'}`}>
                      🚘 {useMalayalam ? 'പകരമുള്ള വഴികൾ (Alternate Route Suggestion):' : 'Suggested Action:'}
                    </p>
                    <p className={`${largeText ? 'text-[13px] md:text-sm' : 'text-xs'} text-rose-100 leading-normal`}>
                      {useMalayalam 
                        ? 'കുട്ടികളോ പ്രായമായവരോ കൂടെയുണ്ടെങ്കിൽ കുറ്റ്യാടി ചുരം വഴിയുള്ള മറ്റ് പാത ഉപയോഗിക്കുക.' 
                        : 'If driving light cars/bikes, expect single lane cues. Buses and multi-axle cargo lists are advised to detour via Kuttiady Ghat Pass or Palakkad bypass.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-sm border-4 border-emerald-700 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center md:text-left">
                  <span className="text-5xl md:text-6xl select-none" role="img" aria-label="Happy smiley route open">🟢</span>
                  <div>
                    <h3 className={`${largeText ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} font-black`}>
                      {trans.noBloxTitle}
                    </h3>
                    <p className="text-emerald-100 font-extrabold mt-1">
                      {trans.noBloxDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STICKY ACCESSIBLE TIMELINE MAP (ROAD LADDER TRACE) */}
        <section id="climb-route-ladder" className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          
          <div className="mb-4">
            <h3 className={`${largeText ? 'text-2xl' : 'text-lg'} font-black text-slate-950`}>
              {trans.mapTitle}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm">
              {trans.mapSub}
            </p>
          </div>

          <p className="text-center font-mono font-bold text-slate-400 text-xxs tracking-wider border-b border-dashed border-slate-200 pb-2">
            {trans.topMarker}
          </p>

          {/* LINEAR WATERFALL ROAD BLOCKS VIEW: Extremely clear, no technical cluttered charts */}
          <div className="space-y-3.5 pl-3 border-l-4 border-indigo-100 ml-4.5 py-4 relative">
            
            {locations.slice().reverse().map((loc) => {
              const isSelected = selectedLocationId === loc.id;
              const isBlocked = loc.status === 'blocked';
              const isSlow = loc.status === 'slow' || loc.status === 'heavy';

              // Visual indicator tokens
              let statusLabel = useMalayalam ? '🟢 സുഖകരം' : '🟢 Open';
              let bgSelection = 'bg-[#f8fafc] border-slate-200 hover:bg-slate-100/60';
              let ringColor = 'ring-emerald-250 bg-emerald-500';
              let textStyle = 'text-slate-900';

              if (isBlocked) {
                statusLabel = useMalayalam ? '🛑 തടസ്സപ്പെട്ടു!' : '🛑 blocked!';
                bgSelection = 'bg-rose-50 border-rose-300 hover:bg-rose-100/60 shadow-xs';
                ringColor = 'ring-rose-250 bg-rose-500 animate-pulse';
                textStyle = 'text-red-950 font-black';
              } else if (isSlow) {
                statusLabel = useMalayalam ? '🟡 പതുക്കെ' : '🟡 Slow Queue';
                bgSelection = 'bg-amber-50 border-amber-300 hover:bg-amber-100/60';
                ringColor = 'ring-amber-250 bg-amber-500';
                textStyle = 'text-amber-950';
              }

              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocationId(loc.id)}
                  className={`p-4 rounded-2.5xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3.5 relative ${bgSelection} ${
                    isSelected ? 'ring-3 ring-indigo-500/80 border-indigo-650 z-10 scale-102 bg-indigo-50/50' : ''
                  }`}
                  id={`ladder-row-${loc.id}`}
                >
                  {/* Big physical bullet node */}
                  <div className={`absolute -left-[27.5px] top-6 h-4 w-4 rounded-full ring-4 ${ringColor}`} />

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className={`${largeText ? 'text-lg md:text-xl' : 'text-sm md:text-md'} ${textStyle}`}>
                        {loc.name}
                      </strong>
                      {loc.hairpinNumber && (
                        <span className="p-1 px-2.5 bg-indigo-100/60 border border-indigo-150 text-indigo-950 font-black rounded-lg text-xxs font-sans uppercase">
                          {trans.hairpinText} {loc.hairpinNumber}
                        </span>
                      )}
                    </div>
                    
                    {/* Simplified direct action text summary */}
                    <p className={`${largeText ? 'text-sm md:text-md leading-relaxed mt-1 text-slate-700' : 'text-xs mt-0.5 text-slate-550'} line-clamp-1`}>
                      {loc.details}
                    </p>
                  </div>

                  {/* Status pill right alignment */}
                  <div className="text-right shrink-0">
                    <span className={`px-2.5 py-1.5 rounded-xl border font-black text-[11px] md:text-xs tracking-wide uppercase ${
                      isBlocked ? 'bg-red-650 text-white border-red-700' : isSlow ? 'bg-amber-400 text-slate-950 border-amber-500' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })}

          </div>

          <p className="text-center font-mono font-bold text-slate-400 text-xxs tracking-wider border-t border-dashed border-slate-200 pt-2 mb-1">
            {trans.bottomMarker}
          </p>

          {/* DYNAMIC CARD DETAIL DRAWER FOCUS */}
          <div className="mt-4 p-5 bg-indigo-50 border-2 border-indigo-100 rounded-3xl">
            {selectedLocation ? (
              <div className="space-y-2">
                <span className="text-xxs uppercase tracking-widest text-[#4f46e5] font-black block">
                  📍 {selectedLocation.name} details
                </span>
                <p className={`${largeText ? 'text-[17px] md:text-xl font-bold' : 'text-sm font-semibold'} text-slate-950`}>
                  &quot;{selectedLocation.details}&quot;
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-3 border-t border-indigo-200/50 font-mono text-xs text-indigo-950">
                  <span>{trans.elevationLabel} <b>{selectedLocation.elevation}m</b></span>
                  <span>{trans.lastUpdatedLabel} <b>{selectedLocation.lastUpdated}</b></span>
                  
                  {/* SIMULATOR QUICK CLEAR ACTION BUTTON */}
                  {selectedLocation.status === 'blocked' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolveBlock(selectedLocation.id);
                      }}
                      className="font-sans ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-850 text-white font-black rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      {trans.resolvedActionBtn}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Click any section above to see altitude metrics and localized breakdown notices.
              </p>
            )}
          </div>

        </section>

        {/* REPORT FORM & COMMUNITY TIMELINE SPLITTER */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* SIMPLIFIED LIVE NOTIFIER PANEL */}
          <div id="quick-alert-submission" className="p-5 md:p-6 bg-white border border-slate-200/95 rounded-3xl shadow-sm">
            
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-indigo-650" />
              <h3 className={`${largeText ? 'text-xl md:text-2xl' : 'text-md md:text-lg'} font-black text-slate-950`}>
                {trans.formHeader}
              </h3>
            </div>
            <p className="text-slate-500 text-xs md:text-sm mb-4 leading-relaxed">
              {trans.formDesc}
            </p>

            <form onSubmit={handleAddLiveIncident} className="space-y-4">
              
              {/* WHERE Select */}
              <div>
                <label className="block text-xxs font-black text-slate-450 uppercase tracking-widest mb-1.5">
                  {trans.formLabelWhere}
                </label>
                <select
                  value={formLocationId}
                  onChange={(e) => setFormLocationId(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-250 text-slate-900 rounded-xl p-3.5 font-bold cursor-pointer focus:bg-white select-none leading-normal text-sm"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} {loc.hairpinNumber ? ` (Bend ${loc.hairpinNumber})` : ''} — {loc.status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* WHAT buttons block */}
              <div>
                <label className="block text-xxs font-black text-slate-450 uppercase tracking-widest mb-2">
                  {trans.formLabelWhat}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'stuck_vehicle', m: '🚚 Stuck Vehicle', ml: '🚚 വാഹനം കുടുങ്ങി' },
                    { id: 'accident', m: '💥 Accident Spot', ml: '💥 അപകടം' },
                    { id: 'landslide', m: '🌧️ Rock/Soil Fall', ml: '🌧️ മണ്ണൊലിപ്പ്' },
                    { id: 'weather', m: '🌫️ Thick Fog', ml: '🌫️ കനത്ത മഞ്ഞ്' },
                    { id: 'clear', m: '🟢 All Clean Now', ml: '🟢 എല്ലാം ഒഴിവ്' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setFormBlockType(preset.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer leading-tight ${
                        formBlockType === preset.id
                          ? 'bg-indigo-600 border-indigo-700 text-white shadow-sm font-black'
                          : 'bg-[#f8fafc] border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {useMalayalam ? preset.ml : preset.m}
                    </button>
                  ))}
                </div>
              </div>

              {/* EXTRA Details (Simple single-line) */}
              <div>
                <label className="block text-xxs font-black text-slate-450 uppercase tracking-widest mb-1.5">
                  {trans.formLabelExtra}
                </label>
                <input
                  type="text"
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  placeholder={trans.formPlaceholderExtra}
                  className="w-full bg-[#f8fafc] border border-slate-250 text-slate-900 rounded-xl p-3.5 text-xs font-semibold focus:bg-white"
                />
              </div>

              {/* REPORTER NAME */}
              <div>
                <label className="block text-xxs font-black text-slate-450 uppercase tracking-widest mb-1.5">
                  {trans.formLabelWho}
                </label>
                <input
                  type="text"
                  value={formReporter}
                  onChange={(e) => setFormReporter(e.target.value)}
                  placeholder={trans.formPlaceholderWho}
                  className="w-full bg-[#f8fafc] border border-slate-250 text-slate-900 rounded-xl p-3.5 text-xs font-semibold focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full h-13 bg-[#f59e0b] hover:bg-[#d97706] active:bg-[#b45309] text-slate-950 font-black text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow cursor-pointer uppercase tracking-wider"
              >
                <Send className="w-5 h-5 shrink-0" />
                <span>{trans.formSubmit}</span>
              </button>

            </form>
          </div>

          {/* SIMPLIFY REALTIME RECENT BLOCK ALERTS TIMELINE */}
          <div className="space-y-6">
            
            {/* Direct speed emergency help tools dialer */}
            <div className="p-5 md:p-6 bg-rose-50 border-2 border-rose-250 rounded-3xl shadow-xs">
              <h3 className="text-red-950 text-md font-black uppercase tracking-wider mb-1">
                🚨 {trans.emergencyHeader}
              </h3>
              <p className="text-rose-800 text-xs mb-4">
                {useMalayalam ? 'തത്സമയം സഹായത്തിനായി ഈ നമ്പറുകളിൽ ക്ലിക്ക് ചെയ്യ്താൽ മതിയാകും.' : 'Just click any red phone number to call directly from your smartphone.'}
              </p>

              <div className="space-y-2">
                {[
                  { id: '1', name: trans.policeLabel, num: '9447025100' },
                  { id: '2', name: trans.rescueLabel, num: '04952231210' },
                  { id: '3', name: trans.medicalLabel, num: '9447600100' }
                ].map((sos) => (
                  <a
                    key={sos.id}
                    href={`tel:${sos.num}`}
                    className="p-3 bg-white hover:bg-rose-100 border border-rose-200 rounded-2xl flex items-center justify-between transition-all font-mono text-xs font-semibold cursor-pointer text-slate-800 focus:ring-3 focus:ring-rose-250 group"
                  >
                    <span className="font-sans font-extrabold text-slate-850 truncate max-w-[190px] group-hover:text-red-800">
                      {sos.name}
                    </span>
                    <span className="flex items-center gap-1 bg-red-600 text-white p-2 px-3 rounded-lg font-bold group-hover:bg-red-700">
                      <PhoneCall className="w-3 h-3 text-white animate-bounce" />
                      {sos.num}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Simulated Live Broadcast Stream logs for Google Search relevance */}
            <div className="p-5 md:p-6 bg-white border border-slate-200 rounded-3xl shadow-xs">
              <h4 className="text-slate-900 text-sm font-black uppercase tracking-wider mb-3">
                💬 {useMalayalam ? 'വഴിയാത്രക്കാരുടെ തത്സമയ അപ്ഡേറ്റുകൾ:' : 'Commuter Verified Stream Logs:'}
              </h4>

              <div className="space-y-3.5 max-h-[210px] overflow-y-auto pr-1">
                {incidents.length === 0 ? (
                  <p className="text-slate-450 text-xs text-center py-6">All clear! No live reports recorded.</p>
                ) : (
                  incidents.map((inc) => (
                    <article key={inc.id} className="p-3.5 bg-slate-50 border border-slate-205 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <strong className="text-indigo-800 text-[11px]">📍 {inc.locationName}</strong>
                        <span className="text-[9px] font-mono text-slate-450">{inc.timestamp}</span>
                      </div>
                      <p className="font-black text-slate-950 scale-y-102 leading-tight">{inc.title}</p>
                      <p className="text-slate-600 text-xxs font-medium leading-normal">{inc.description}</p>
                      <p className="text-[10px] text-slate-400 font-sans pt-1 border-t border-slate-200/50">
                        Reporter: <b>{inc.reportedBy}</b> • upvotes: {inc.upvotes}
                      </p>
                    </article>
                  ))
                )}
              </div>

              {/* Reset to normal simulation trigger */}
              <div className="mt-4 pt-4 border-t border-slate-150 text-center">
                <button
                  onClick={handleResetToNormal}
                  className="text-xxs font-mono text-slate-450 hover:text-indigo-600 border border-slate-200 rounded-lg p-2 px-3 tracking-widest cursor-pointer transition-all flex items-center justify-center gap-1.5 mx-auto hover:bg-slate-50 font-bold"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>{trans.resetBtn}</span>
                </button>
              </div>

            </div>

          </div>

        </section>

        {/* SEO FRIENDLY COMPREHENSIVE REGIONAL EXPLANATION ARTICLE */}
        {/* Strictly compliant with organic search crawlability, using descriptive headings and normal tags */}
        <article id="seo-regional-curation" className="p-6 md:p-8 bg-slate-200 rounded-3xl border border-slate-300">
          <header>
            <h3 className="text-xs font-mono font-black text-indigo-700 uppercase tracking-widest mb-1.5">
              Live Transit Encyclopedia Database
            </h3>
            <h2 className="text-base md:text-lg font-black text-slate-950 mb-3 leading-tight font-display">
              Thamarassery Churam Ghat Road National Highway 766 Kozhikode to Wayanad Route Details
            </h2>
          </header>
          
          <div className="space-y-3 text-xs md:text-[13px] text-slate-75 * leading-relaxed font-sans font-medium">
            <p>
              The <strong>Thamarassery Ghat Pass</strong>, locally designated as <strong>താമരശ്ശേരി ചുരം</strong> is Kerala’s most famous mountain highway pass. It resides along <strong>National Highway 766 (NH 766)</strong>, serving as the absolute primary logistical link connecting Kozhikode (Calicut) with the high-altitude district of Wayanad, and continuing forward towards Mysore and Bangalore in Karnataka. 
            </p>
            <p>
              With an average elevation ascending from 75 meters at Adivaram up to 700 meters at the Lakkidi summit within only 14 kilometers, this narrow tarmac features <strong>9 extreme hairpin curves</strong>. Due to the high slope gradient of up to 1:15, heavy freight lorries and tourist vehicles occasionally face mechanical breaks on the sharp inner radii of Curve 3, Curve 5 (well-known as the Big Bend), and Curve 7. 
            </p>
            <p>
              Our <strong>Churam Live companion platform</strong> was created to deliver direct, uncluttered status reports. By removing modern decorative visual panels, older citizens, local bus drivers, emergency responders, and families can easily check if any hairpins are currently blocked. This proactive status check helps reduce high vehicle build-up, allows travelers to select the alternate <strong>Kuttiady Churam</strong> or Vadakara passes early, and ensures children can follow pass maps easily.
            </p>
          </div>
        </article>

      </main>

      {/* FOOTER WRAPPER */}
      <footer className="mt-14 bg-slate-905 text-slate-400 py-8 border-t border-slate-300 text-center text-xs font-mono">
        <div className="max-w-4xl mx-auto px-4 space-y-2.5">
          <p className="font-extrabold text-slate-700">
            Wayanad Churam Live Road Status & NH 766 Block Tracker • Kozhikode - Wayanad Border, Kerala, India.
          </p>
          <p className="text-[11px] text-slate-500">
            {trans.legalFooter} • Designed with High-Contrast Accessible Text for Senior Citizens.
          </p>
        </div>
      </footer>

    </div>
  );
}
