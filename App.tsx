/**
 * Copyright (c) 2024 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MirageCard } from './components/MirageCard';
import { ToggleSwitch } from './components/ToggleSwitch';
import { SettingsProvider, useSettings } from './components/SettingsProvider';
import { SettingsPanel } from './components/SettingsPanel';
import { 
  LightbulbIcon, ThermostatIcon, HumidityIcon, DoorIcon, PlayIcon, PauseIcon, NextIcon, PrevIcon, SpeakerIcon, 
  MovieIcon, BedIcon, WeatherCloudyIcon, FanIcon,
  ChipIcon, MemoryIcon, StorageIcon, WifiIcon, PowerOffIcon, ShieldCheckIcon, CoffeeIcon, UserIcon,
  SettingsIcon,
} from './components/icons';
import type { 
  ThermostatDevice, SensorDevice, MediaDevice, Scene, DimmerLightDevice, WeatherData,
  SystemStatus, NetworkDevice, MirageCardProps
} from './types';

const hexToRgba = (hex: string, alpha: number): string => {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        return `rgba(59, 130, 246, ${alpha})`;
    }
    let c = hex.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    const n = parseInt(`0x${c.join('')}`);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const Gauge: React.FC<{
  value: number;
  min?: number;
  max?: number;
  label: string;
  unit: string;
  color: string;
  theme: string;
}> = ({ value, min = 0, max = 100, label, unit, color, theme }) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const arcLength = Math.PI * 70;
  const strokeDashoffset = arcLength * (1 - percentage / 100);

  const trackColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
  
  return (
    <div className="flex flex-col items-center justify-center">
      <svg viewBox="0 0 200 100" className="w-full">
        <path d="M 30 90 A 70 70 0 0 1 170 90" fill="none" stroke={trackColor} strokeWidth="12" strokeLinecap="round" />
        <path d="M 30 90 A 70 70 0 0 1 170 90" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={arcLength} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div className="text-center -mt-10">
        <span className="text-3xl font-bold" style={{ color }}>{value.toFixed(1)}</span>
        <span className={`ml-1 text-lg`} style={{color: 'var(--mirage-card-secondary-text-color)'}}>{unit}</span>
      </div>
       <p className={`text-sm mt-1 font-medium`} style={{color: 'var(--mirage-card-secondary-text-color)'}}>{label}</p>
    </div>
  );
};

const ProgressBar: React.FC<{
  value: number;
  color: string;
  theme: string;
}> = ({ value, color, theme }) => {
  const trackColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
  return (
    <div className="w-full h-2 rounded-full" style={{backgroundColor: trackColor}}>
      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }}></div>
    </div>
  );
};


const Dashboard: React.FC = () => {
  const [dateState, setDateState] = useState(new Date());
  const { 
    theme, cardStyle, currentTextColors, accentColor, temperatureColor, weatherColor, 
    humidityColor, doorColor, borderRadius, font, animationsEnabled,
    customBgDark, customBgLight, bgColorDark, bgColorLight
  } = useSettings();
  
  const [isUserAdmin, setIsUserAdmin] = useState(true); // Simulate admin state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeScene, setActiveScene] = useState<string | null>('movie_time');
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setDateState(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // MOCK DEVICE STATES
  const [lights, setLights] = useState({ livingRoom: true, kitchen: false, bedroom: true });
  const [thermostat, setThermostat] = useState<ThermostatDevice>({ id: 'main_thermostat', name: 'Main Thermostat', currentTemp: 21, targetTemp: 22, mode: 'heat' });
  const [sensors] = useState<SensorDevice[]>([
    { id: 'front_door', name: 'Front Door', value: 'Closed', icon: 'door' },
    { id: 'living_humidity', name: 'Living Room Humidity', value: '45%', icon: 'humidity' },
  ]);
  const [media, setMedia] = useState<MediaDevice>({ isPlaying: true, artist: 'Lofi Girl', title: 'Beats to Relax/Study to', albumArt: 'https://picsum.photos/seed/lofi/200/200' });
  const [dimmer, setDimmer] = useState<DimmerLightDevice>({ id: 'fan_dimmer', name: 'Ceiling Fan', isOn: true, brightness: 70 });
  const [scenes] = useState<Scene[]>([
    { id: 'movie_time', name: 'Movie Time', icon: MovieIcon },
    { id: 'good_night', name: 'Good Night', icon: BedIcon },
  ]);
  const [weather] = useState<WeatherData>({ temperature: 18, condition: 'Partly Cloudy', icon: WeatherCloudyIcon });
  const [temperatureHistory] = useState<SensorDevice>({ id: 'living_room_temp_history', name: 'Living Room Temperature', value: '21.5°C', icon: 'temperature', history: [ { time: '12:00', value: 20 }, { time: '13:00', value: 21 }, { time: '14:00', value: 22 }, { time: '15:00', value: 21.5 }, { time: '16:00', value: 22 }, { time: '17:00', value: 22.5 }, { time: '18:00', value: 21 } ] });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({ cpuTemp: 55, memoryUsage: 62, storageFree: 750, networkStatus: 'online' });
  const [networkSpeed, setNetworkSpeed] = useState<NetworkDevice>({ downloadSpeed: 89.4, uploadSpeed: 18.2 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({ ...prev, cpuTemp: 50 + Math.random() * 10, memoryUsage: 60 + Math.random() * 5 }));
      setNetworkSpeed(prev => ({ downloadSpeed: 80 + Math.random() * 20, uploadSpeed: 15 + Math.random() * 5 }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLightToggle = (light: keyof typeof lights) => setLights(prev => ({ ...prev, [light]: !prev[light] }));
  const adjustTemp = (amount: number) => setThermostat(prev => ({ ...prev, targetTemp: prev.targetTemp + amount }));
  const togglePlay = () => setMedia(prev => ({...prev, isPlaying: !prev.isPlaying}));
  const handleDimmerToggle = () => setDimmer(prev => ({ ...prev, isOn: !prev.isOn }));
  const handleBrightnessChange = (event: React.ChangeEvent<HTMLInputElement>) => setDimmer(prev => ({ ...prev, brightness: Number(event.target.value) }));
  const handleSceneActivation = (id: string) => setActiveScene(id);
  const handleQuickAction = (id: string) => {
    setActiveQuickAction(id);
    setTimeout(() => setActiveQuickAction(null), 500);
  };
  
  const mirageCardProps: Pick<MirageCardProps, 'theme' | 'cardStyle'> = { theme, cardStyle };

  const quickActions = [
    { id: 'all_off', name: 'All Off', icon: PowerOffIcon },
    { id: 'good_morning', name: 'Morning', icon: CoffeeIcon },
    { id: 'movie_time', name: 'Movie', icon: MovieIcon },
    { id: 'away', name: 'Away', icon: ShieldCheckIcon },
  ];
  
  const fontFamilies = {
    system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    serif: '"Iowan Old Style", "Apple Garamond", Baskerville, "Times New Roman", "Droid Serif", Times, "Source Serif Pro", serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    monospace: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  };

  const backgroundStyle: React.CSSProperties = {
    color: currentTextColors.primary,
    fontFamily: fontFamilies[font],
    transition: 'background-color 0.5s ease',
  };

  const bgImage = theme === 'dark' ? customBgDark : customBgLight;
  const bgColor = theme === 'dark' ? bgColorDark : bgColorLight;

  if (bgImage) {
      backgroundStyle.backgroundImage = `url(${bgImage})`;
  } else {
      backgroundStyle.backgroundColor = bgColor;
  }

  return (
    <div 
      className={`min-h-screen w-full bg-cover bg-center bg-fixed p-4 sm:p-6 lg:p-8 transition-all duration-500`} 
      style={backgroundStyle}
    >
      <style>{`
        ${!animationsEnabled ? `
          * {
            transition: none !important;
            animation: none !important;
          }
        ` : ''}
        .glass-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 0.25rem; background: transparent; outline: none; transition: opacity .2s; position: relative; }
        .glass-slider::before { content: ''; position: absolute; inset: 0; border-radius: 9999px; background-color: ${theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'}; backdrop-filter: blur(2px); border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)'}; box-shadow: inset 0 1px 2px ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; }
        .glass-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background-color: var(--mirage-slider-thumb-bg-color); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 50%; cursor: pointer; backdrop-filter: blur(4px); box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; position: relative; z-index: 10; }
        .glass-slider::-moz-range-thumb { width: 20px; height: 20px; background-color: var(--mirage-slider-thumb-bg-color); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 50%; cursor: pointer; backdrop-filter: blur(4px); box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; }
        .glass-slider:hover::-webkit-slider-thumb, .glass-slider:hover::-moz-range-thumb { transform: scale(1.1); box-shadow: 0 4px 8px rgba(0,0,0,0.25); }
        .glass-slider:active::-webkit-slider-thumb, .glass-slider:active::-moz-range-thumb { transform: scale(0.95); }
        .upload-btn { padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; transition: background-color 0.2s; background-color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}; border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}; }
        .upload-btn:hover { background-color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}; }
        .clear-btn { padding: 0.5rem 1rem; border-radius: 0.5rem; background-color: transparent; color: ${theme === 'dark' ? 'rgba(255, 99, 132, 0.8)' : 'rgba(200, 50, 82, 0.9)'}; font-weight: 500; }
        .clear-btn:hover { color: ${theme === 'dark' ? 'rgb(255, 99, 132)' : 'rgb(200, 50, 82)'}; }
        input[type="color"] { -webkit-appearance: none; -moz-appearance: none; appearance: none; background-color: transparent; width: 40px; height: 40px; border: none; cursor: pointer; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border-radius: 8px; border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.1)'}; }
        input[type="color"]::-moz-color-swatch { border-radius: 8px; border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.1)'}; }
      `}</style>
      <main className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Good Morning{isUserAdmin ? ' (Admin)' : ''}</h1>
            <p className="text-xl" style={{ color: currentTextColors.secondary }}>
              {dateState.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' - '}
              {dateState.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
                onClick={() => setIsUserAdmin(!isUserAdmin)}
                className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                title={`Toggle Admin View (Currently: ${isUserAdmin ? 'Admin' : 'User'})`}
                aria-label="Toggle admin view"
            >
                <UserIcon className="w-6 h-6" style={{color: isUserAdmin ? accentColor : currentTextColors.secondary}}/>
            </button>
            <button
                onClick={() => setIsSettingsOpen(true)}
                className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                title="Open Mirage UI Settings"
                aria-label="Open settings panel"
            >
                <SettingsIcon className="w-6 h-6" style={{color: currentTextColors.secondary}}/>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          <MirageCard title="Quick Actions" {...mirageCardProps} className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
            <div className="flex items-center justify-around">
              {quickActions.map(action => {
                const isActive = activeQuickAction === action.id;
                const baseClasses = `flex flex-col items-center justify-center space-y-2 w-20 h-20 rounded-full transition-all duration-200 transform hover:scale-105`;
                const themeClasses = theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10';
                const activeStyle: React.CSSProperties = { backgroundColor: hexToRgba(accentColor, 0.3), transform: 'scale(1.05)' };
                
                return (
                  <button key={action.id} onClick={() => handleQuickAction(action.id)} className={`${baseClasses} ${themeClasses}`} style={isActive ? activeStyle : {}}>
                    <action.icon className="w-8 h-8" style={isActive ? {color: accentColor} : {}}/>
                    <span className="text-xs font-semibold" style={{ color: 'var(--mirage-card-secondary-text-color)' }}>{action.name}</span>
                  </button>
                )
              })}
            </div>
          </MirageCard>

          <MirageCard title="Lights" {...mirageCardProps} className="md:col-span-1">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <LightbulbIcon className={`w-6 h-6 transition-colors`} style={{color: lights.livingRoom ? accentColor : 'var(--mirage-card-secondary-text-color)'}} />
                  <span className="transition-colors" style={{color: lights.livingRoom ? accentColor : 'inherit'}}>Living Room</span>
                </div>
                <ToggleSwitch isOn={lights.livingRoom} onToggle={() => handleLightToggle('livingRoom')} theme={theme} accentColor={accentColor} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                   <LightbulbIcon className={`w-6 h-6 transition-colors`} style={{color: lights.kitchen ? accentColor : 'var(--mirage-card-secondary-text-color)'}} />
                  <span className="transition-colors" style={{color: lights.kitchen ? accentColor : 'inherit'}}>Kitchen</span>
                </div>
                <ToggleSwitch isOn={lights.kitchen} onToggle={() => handleLightToggle('kitchen')} theme={theme} accentColor={accentColor} />
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                  <LightbulbIcon className={`w-6 h-6 transition-colors`} style={{color: lights.bedroom ? accentColor : 'var(--mirage-card-secondary-text-color)'}} />
                  <span className="transition-colors" style={{color: lights.bedroom ? accentColor : 'inherit'}}>Bedroom</span>
                </div>
                <ToggleSwitch isOn={lights.bedroom} onToggle={() => handleLightToggle('bedroom')} theme={theme} accentColor={accentColor} />
              </div>
            </div>
          </MirageCard>

          <MirageCard title="Climate" {...mirageCardProps} className="md:col-span-1">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <ThermostatIcon className="w-8 h-8" style={{ color: temperatureColor || accentColor }}/>
                    <div>
                        <p className="text-lg">{thermostat.name}</p>
                        <p className="text-xs" style={{color: 'var(--mirage-card-secondary-text-color)'}}>Currently {thermostat.currentTemp}°C</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-bold">{thermostat.targetTemp}°</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <button onClick={() => adjustTemp(-1)} className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}>-</button>
                        <button onClick={() => adjustTemp(1)} className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}>+</button>
                    </div>
                </div>
            </div>
          </MirageCard>
          
          <MirageCard title="Now Playing" {...mirageCardProps} className="sm:col-span-2">
            <div className="flex items-center space-x-4">
                <img src={media.albumArt} alt="Album Art" className="w-24 h-24 rounded-lg shadow-lg" />
                <div className="flex-1">
                    <p className="font-bold text-lg">{media.title}</p>
                    <p style={{color: 'var(--mirage-card-secondary-text-color)'}}>{media.artist}</p>
                    <div className="flex items-center space-x-4 mt-4">
                        <button className="transition-colors" style={{color: 'var(--mirage-card-secondary-text-color)'}}><PrevIcon className="w-6 h-6" /></button>
                        <button onClick={togglePlay} className={`w-12 h-12 rounded-full transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-white/20 hover:bg-white/30' : 'bg-black/10 hover:bg-black/20'}`}>
                           {media.isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                        </button>
                        <button className="transition-colors" style={{color: 'var(--mirage-card-secondary-text-color)'}}><NextIcon className="w-6 h-6" /></button>
                    </div>
                </div>
                <SpeakerIcon className="w-6 h-6 self-start" style={{color: 'var(--mirage-card-secondary-text-color)'}}/>
            </div>
          </MirageCard>

          <MirageCard title={temperatureHistory.name} {...mirageCardProps} className="sm:col-span-2 lg:col-span-2">
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={temperatureHistory.history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"} />
                  <XAxis dataKey="time" tick={{ fill: 'var(--mirage-card-secondary-text-color)' }} fontSize={12} />
                  <YAxis tick={{ fill: 'var(--mirage-card-secondary-text-color)' }} fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} unit="°C" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--mirage-glass-bg-color-dark)', borderColor: 'var(--mirage-glass-border-color-dark)', borderRadius: '0.75rem', backdropFilter: 'blur(4px)', color: 'var(--mirage-card-primary-text-color)' }} labelStyle={{ color: 'var(--mirage-card-primary-text-color)' }}/>
                  <Legend wrapperStyle={{fontSize: "14px", color: 'var(--mirage-card-secondary-text-color)'}}/>
                  <Line type="monotone" dataKey="value" name="Temp" stroke={temperatureColor || accentColor} strokeWidth={2} dot={{ r: 4, fill: temperatureColor || accentColor }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MirageCard>

          <MirageCard title="System Status" {...mirageCardProps} className="sm:col-span-2 lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between"><div className="flex items-center space-x-3"><ChipIcon className="w-6 h-6" style={{color: accentColor}}/><span>CPU Temperature</span></div><span className="font-semibold">{systemStatus.cpuTemp.toFixed(1)}°C</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center space-x-3"><MemoryIcon className="w-6 h-6" style={{color: accentColor}}/><span>Memory Usage</span></div><span className="font-semibold">{systemStatus.memoryUsage.toFixed(1)}%</span></div>
              <ProgressBar value={systemStatus.memoryUsage} color={accentColor} theme={theme} />
              <div className="flex items-center justify-between"><div className="flex items-center space-x-3"><StorageIcon className="w-6 h-6" style={{color: accentColor}}/><span>Storage Free</span></div><span className="font-semibold">{systemStatus.storageFree} GB</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center space-x-3"><WifiIcon className="w-6 h-6" style={{color: accentColor}}/><span>Network</span></div><span className={`font-semibold capitalize ${systemStatus.networkStatus === 'online' ? 'text-green-400' : 'text-red-400'}`}>{systemStatus.networkStatus}</span></div>
            </div>
          </MirageCard>
          
          <MirageCard title={dimmer.name} {...mirageCardProps}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <FanIcon className={`w-6 h-6 ${dimmer.isOn ? 'animate-spin' : ''}`} style={{ animationDuration: dimmer.isOn ? `${2.5 - (dimmer.brightness / 100 * 2)}s` : '0s', color: dimmer.isOn ? accentColor : 'var(--mirage-card-secondary-text-color)' }} />
                  <span>{dimmer.isOn ? `On - ${dimmer.brightness}%` : 'Off'}</span>
                </div>
                <ToggleSwitch isOn={dimmer.isOn} onToggle={handleDimmerToggle} theme={theme} accentColor={accentColor} />
              </div>
              <div className={`px-2.5 transition-opacity ${!dimmer.isOn ? 'opacity-50' : ''}`}>
                <input type="range" min="0" max="100" value={dimmer.brightness} onChange={handleBrightnessChange} className="glass-slider" disabled={!dimmer.isOn} />
              </div>
            </div>
          </MirageCard>

          <MirageCard title="Current Weather" {...mirageCardProps}>
            <div className="flex items-center space-x-4">
              <weather.icon className="w-16 h-16" style={{color: weatherColor || accentColor}} />
              <div>
                <p className="text-4xl font-bold">{weather.temperature}°C</p>
                <p className="text-lg" style={{color: 'var(--mirage-card-secondary-text-color)'}}>{weather.condition}</p>
              </div>
            </div>
          </MirageCard>
          
          <MirageCard title="Network Speed" {...mirageCardProps} className="sm:col-span-2">
            <Gauge value={networkSpeed.downloadSpeed} max={150} label="Download" unit="Mbps" color={accentColor} theme={theme} />
          </MirageCard>

          <MirageCard title="Scenes" {...mirageCardProps} className="sm:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {scenes.map(scene => {
                const isActive = activeScene === scene.id;
                const inactiveClasses = theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10';
                const baseStyle: React.CSSProperties = { borderRadius: `${borderRadius}px` };
                const activeStyle: React.CSSProperties = { ...baseStyle, backgroundColor: hexToRgba(accentColor, theme === 'dark' ? 0.3 : 0.2) };

                return (
                  <button key={scene.id} onClick={() => handleSceneActivation(scene.id)} className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-colors ${isActive ? '' : inactiveClasses}`} style={isActive ? activeStyle : baseStyle}>
                    <scene.icon className="w-8 h-8" />
                    <span className="font-medium">{scene.name}</span>
                  </button>
                )
              })}
            </div>
          </MirageCard>
          
          <MirageCard 
            title="Special Card"
            theme={theme}
            cardStyle={'paper'} 
            className="sm:col-span-1"
            styleOverrides={{
// Fix: Corrected typo in CSS custom property key.
              '--mirage-accent-color': '#e11d48',
              '--mirage-card-primary-text-color': '#000000',
              '--mirage-card-secondary-text-color': '#4b5563',
              '--mirage-paper-bg-color-light': '#fef2f2',
              '--mirage-paper-bg-color-dark': '#4c1d24',
              '--mirage-border-radius': '8px',
              '--mirage-border-width': '2px',
              '--mirage-paper-border-color-light': '#fecaca',
              '--mirage-paper-border-color-dark': '#9f1239',
            } as React.CSSProperties}
          >
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="w-8 h-8" style={{ color: 'var(--mirage-accent-color)' }}/>
                    <p className="text-sm">This card has its own style and ignores the global theme.</p>
                </div>
            </div>
          </MirageCard>

          {sensors.map(sensor => (
            <MirageCard key={sensor.id} title={sensor.name} {...mirageCardProps}>
                <div className="flex items-center space-x-4">
                    {sensor.icon === 'door' && <DoorIcon className="w-8 h-8" style={{color: doorColor || accentColor}} />}
                    {sensor.icon === 'humidity' && <HumidityIcon className="w-8 h-8" style={{color: humidityColor || accentColor}} />}
                    <p className="text-3xl font-semibold">{sensor.value}</p>
                </div>
            </MirageCard>
          ))}
        </div>
      </main>
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <SettingsProvider>
      <Dashboard />
    </SettingsProvider>
  );
};

export default App;