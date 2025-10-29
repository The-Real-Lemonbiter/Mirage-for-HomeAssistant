/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MirageCard } from './components/MirageCard';
import { ToggleSwitch } from './components/ToggleSwitch';
import { SettingsProvider, useSettings } from './components/SettingsProvider';
import { SettingsPanel } from './components/SettingsPanel';
import { 
  LightbulbIcon, ThermostatIcon, HumidityIcon, DoorIcon, PlayIcon, PauseIcon, NextIcon, PrevIcon, SpeakerIcon, 
  SettingsIcon, MovieIcon, BedIcon, WeatherCloudyIcon, UserIcon, ChipIcon, MemoryIcon, StorageIcon,
  PowerOffIcon, RobotIcon, ShieldCheckIcon, WifiIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, DevicePhoneMobileIcon,
  SparklesIcon, CloudRainIcon,
} from './components/icons';
import type { 
  ThermostatDevice, SensorDevice, MediaDevice, MirageCardProps
} from './types';

const Dashboard: React.FC = () => {
  const [dateState, setDateState] = useState(new Date());
  const { 
    theme, currentTextColors, activeThemeConfig, settings
  } = useSettings();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
  const [scenes, setScenes] = useState({ movie: true, goodnight: false });
  const [switches, setSwitches] = useState({ sprinkler: false, poolPump: true });
  const [weather] = useState({ temp: 18, condition: 'Cloudy' });
  const [users] = useState([
    { id: 'user1', name: 'You', status: 'Home' },
    { id: 'user2', name: 'Partner', status: 'Away' },
  ]);
  const [systemStatus] = useState<SensorDevice[]>([
    { id: 'cpu_load', name: 'CPU Load', value: '34%', icon: 'cpu' },
    { id: 'ram_usage', name: 'Memory', value: '6.7/16 GB', icon: 'ram' },
    { id: 'storage_usage', name: 'Storage', value: '450 GB', icon: 'storage' },
  ]);
  const [networkStatus] = useState<SensorDevice[]>([
    { id: 'net_download', name: 'Download', value: '345 Mbps', icon: 'download' },
    { id: 'net_upload', name: 'Upload', value: '88 Mbps', icon: 'upload' },
    { id: 'net_devices', name: 'Devices', value: '17 Connected', icon: 'devices' },
  ]);
   const [energyData] = useState([
      { day: 'Mon', usage: 4.2 },
      { day: 'Tue', usage: 5.1 },
      { day: 'Wed', usage: 6.5 },
      { day: 'Thu', usage: 5.8 },
      { day: 'Fri', usage: 7.2 },
      { day: 'Sat', usage: 8.9 },
      { day: 'Sun', usage: 7.5 },
    ]);
  
  const handleLightToggle = (light: keyof typeof lights) => setLights(prev => ({ ...prev, [light]: !prev[light] }));
  const adjustTemp = (amount: number) => setThermostat(prev => ({ ...prev, targetTemp: prev.targetTemp + amount }));
  const togglePlay = () => setMedia(prev => ({...prev, isPlaying: !prev.isPlaying}));
  const toggleScene = (scene: keyof typeof scenes) => setScenes(prev => ({ ...prev, [scene]: !prev[scene] }));
  const handleSwitchToggle = (switchKey: keyof typeof switches) => setSwitches(prev => ({ ...prev, [switchKey]: !prev[switchKey] }));

  const { cardStyle, accentColor, temperatureColor, humidityColor, doorColor, weatherColor } = activeThemeConfig;
  const { font } = settings.general;

  const mirageCardProps: Pick<MirageCardProps, 'theme' | 'cardStyle'> = { theme, cardStyle };

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

  if (activeThemeConfig.customBg) {
      backgroundStyle.backgroundImage = `url(${activeThemeConfig.customBg})`;
  } else {
      backgroundStyle.backgroundColor = activeThemeConfig.bgColor;
  }

  return (
    <div 
      className={`min-h-screen w-full bg-cover bg-center bg-fixed p-4 sm:p-6 lg:p-8 transition-all duration-500`} 
      style={backgroundStyle}
    >
      <main className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Good Morning</h1>
            <p className="text-xl" style={{ color: currentTextColors.secondary }}>
              {dateState.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' - '}
              {dateState.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <MirageCard title="Lights" {...mirageCardProps}>
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

          <MirageCard title="Climate" {...mirageCardProps}>
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

          <MirageCard title="Scenes" {...mirageCardProps}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <MovieIcon className={`w-6 h-6 transition-colors`} style={{color: scenes.movie ? accentColor : 'var(--mirage-card-secondary-text-color)'}} />
                  <span className="transition-colors" style={{color: scenes.movie ? accentColor : 'inherit'}}>Movie Time</span>
                </div>
                <ToggleSwitch isOn={scenes.movie} onToggle={() => toggleScene('movie')} theme={theme} accentColor={accentColor} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <BedIcon className={`w-6 h-6 transition-colors`} style={{color: scenes.goodnight ? accentColor : 'var(--mirage-card-secondary-text-color)'}} />
                  <span className="transition-colors" style={{color: scenes.goodnight ? accentColor : 'inherit'}}>Good Night</span>
                </div>
                <ToggleSwitch isOn={scenes.goodnight} onToggle={() => toggleScene('goodnight')} theme={theme} accentColor={accentColor} />
              </div>
            </div>
          </MirageCard>

          <MirageCard title="Weather" {...mirageCardProps}>
            <div className="flex items-center space-x-4">
                <WeatherCloudyIcon className="w-12 h-12" style={{ color: weatherColor || accentColor }}/>
                <div>
                    <p className="text-4xl font-bold">{weather.temp}°</p>
                    <p className="text-sm" style={{color: 'var(--mirage-card-secondary-text-color)'}}>{weather.condition}</p>
                </div>
            </div>
          </MirageCard>
          
          <MirageCard title="Now Playing" {...mirageCardProps} className="sm:col-span-2 lg:col-span-2">
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

          <MirageCard title="System Status" {...mirageCardProps} className="sm:col-span-2 lg:col-span-2">
            <div className="space-y-4">
                {systemStatus.map(sensor => {
                    let Icon;
                    switch (sensor.icon) {
                        case 'cpu': Icon = ChipIcon; break;
                        case 'ram': Icon = MemoryIcon; break;
                        case 'storage': Icon = StorageIcon; break;
                        default: Icon = LightbulbIcon;
                    }
                    return (
                        <div key={sensor.id} className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Icon className="w-6 h-6" style={{ color: accentColor }}/>
                                <span>{sensor.name}</span>
                            </div>
                            <span className="font-medium">{sensor.value}</span>
                        </div>
                    );
                })}
            </div>
          </MirageCard>

          <MirageCard title="Sensors" {...mirageCardProps}>
            <div className="space-y-4">
                {sensors.map(sensor => {
                    let Icon;
                    let color;
                    switch (sensor.icon) {
                        case 'door': Icon = DoorIcon; color = doorColor || accentColor; break;
                        case 'humidity': Icon = HumidityIcon; color = humidityColor || accentColor; break;
                        default: Icon = LightbulbIcon; color = accentColor;
                    }
                    return (
                        <div key={sensor.id} className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Icon className="w-6 h-6" style={{ color }}/>
                                <span>{sensor.name}</span>
                            </div>
                            <span className="font-medium">{sensor.value}</span>
                        </div>
                    );
                })}
            </div>
          </MirageCard>
          
          <MirageCard title="Who's Home" {...mirageCardProps}>
            <div className="space-y-3">
                {users.map(user => (
                    <div key={user.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: user.status === 'Home' ? accentColor : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')}}>
                          <UserIcon className="w-5 h-5" style={{ color: user.status === 'Home' ? 'white' : 'var(--mirage-card-secondary-text-color)' }} />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs" style={{color: 'var(--mirage-card-secondary-text-color)'}}>{user.status}</p>
                        </div>
                    </div>
                ))}
            </div>
          </MirageCard>

          <MirageCard title="Geräte" {...mirageCardProps}>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSwitchToggle('sprinkler')}
                className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all duration-300`}
                style={{ 
                  backgroundColor: switches.sprinkler ? accentColor : (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                  color: switches.sprinkler ? 'white' : 'var(--mirage-card-secondary-text-color)'
                }}
              >
                <CloudRainIcon className="w-8 h-8" />
                <span className="text-sm font-medium" style={{ color: switches.sprinkler ? 'white' : 'var(--mirage-card-primary-text-color)'}}>Sprinkler</span>
              </button>
              <button 
                onClick={() => handleSwitchToggle('poolPump')}
                className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all duration-300`}
                style={{ 
                  backgroundColor: switches.poolPump ? accentColor : (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                  color: switches.poolPump ? 'white' : 'var(--mirage-card-secondary-text-color)'
                }}
              >
                <SparklesIcon className="w-8 h-8" />
                <span className="text-sm font-medium" style={{ color: switches.poolPump ? 'white' : 'var(--mirage-card-primary-text-color)'}}>Pool-Pumpe</span>
              </button>
            </div>
          </MirageCard>

          <MirageCard title="Quick Actions" {...mirageCardProps}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <button className={`w-16 h-16 rounded-full transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}>
                  <PowerOffIcon className="w-8 h-8" />
                </button>
                <span className="text-xs" style={{color: 'var(--mirage-card-secondary-text-color)'}}>Lights Off</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <button className={`w-16 h-16 rounded-full transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}>
                  <RobotIcon className="w-8 h-8" />
                </button>
                <span className="text-xs" style={{color: 'var(--mirage-card-secondary-text-color)'}}>Clean House</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <button className={`w-16 h-16 rounded-full transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}>
                  <ShieldCheckIcon className="w-8 h-8" />
                </button>
                <span className="text-xs" style={{color: 'var(--mirage-card-secondary-text-color)'}}>Secure Home</span>
              </div>
            </div>
          </MirageCard>
          
          <MirageCard title="Network Status" {...mirageCardProps} className="sm:col-span-2 lg:col-span-2">
            <div className="space-y-4">
                {networkStatus.map(sensor => {
                    let Icon;
                    switch (sensor.icon) {
                        case 'download': Icon = ArrowDownTrayIcon; break;
                        case 'upload': Icon = ArrowUpTrayIcon; break;
                        case 'devices': Icon = DevicePhoneMobileIcon; break;
                        default: Icon = WifiIcon;
                    }
                    return (
                        <div key={sensor.id} className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Icon className="w-6 h-6" style={{ color: accentColor }}/>
                                <span>{sensor.name}</span>
                            </div>
                            <span className="font-medium">{sensor.value}</span>
                        </div>
                    );
                })}
            </div>
          </MirageCard>
          
          <MirageCard title="Energy Usage (Last 7 Days)" {...mirageCardProps} className="sm:col-span-2 lg:col-span-4">
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={energyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                  <XAxis dataKey="day" stroke={currentTextColors.secondary} tick={{ fontSize: 12 }} />
                  <YAxis stroke={currentTextColors.secondary} tick={{ fontSize: 12 }} unit="kWh"/>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: cardStyle === 'solid' ? (theme === 'dark' ? settings.night.solidColor : settings.day.solidColor) : (theme === 'dark' ? '#2d3748' : '#e2e8f0'),
                      borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                      borderRadius: 'var(--mirage-border-radius)',
                    }}
                    itemStyle={{ color: currentTextColors.primary }}
                    labelStyle={{ color: currentTextColors.secondary }}
                  />
                  <Line type="monotone" dataKey="usage" stroke={accentColor} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Usage" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MirageCard>

        </div>
      </main>
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

// This wrapper remains for standalone preview usage if needed.
const App: React.FC = () => {
  return (
    <SettingsProvider>
      <Dashboard />
    </SettingsProvider>
  );
};

export default App;