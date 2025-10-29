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

  const getIcon = (icon: SensorDevice['icon']) => {
    const iconProps = { className: "w-5 h-5" };
    switch (icon) {
      case 'door': return <DoorIcon {...iconProps} style={{ color: doorColor }} />;
      case 'humidity': return <HumidityIcon {...iconProps} style={{ color: humidityColor }} />;
      case 'cpu': return <ChipIcon {...iconProps} />;
      case 'ram': return <MemoryIcon {...iconProps} />;
      case 'storage': return <StorageIcon {...iconProps} />;
      case 'download': return <ArrowDownTrayIcon {...iconProps} />;
      case 'upload': return <ArrowUpTrayIcon {...iconProps} />;
      case 'devices': return <DevicePhoneMobileIcon {...iconProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed transition-all" style={backgroundStyle}>
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <main className="p-4 sm:p-6 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>
              Mirage
            </h1>
            <p className="text-lg" style={{ color: currentTextColors.secondary, textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              {dateState.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
             <p className="text-3xl font-light tabular-nums" style={{textShadow: '0 1px 3px rgba(0,0,0,0.2)'}}>
              {dateState.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </p>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Open Settings"
            >
              <SettingsIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          <MirageCard title="Lights" {...mirageCardProps}>
            <div className="space-y-4">
              {Object.entries(lights).map(([key, isOn]) => (
                <div key={key} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <LightbulbIcon className="w-6 h-6" style={{ color: isOn ? accentColor : 'currentColor', opacity: isOn ? 1 : 0.4 }}/>
                    <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                  </div>
                  <ToggleSwitch isOn={isOn} onToggle={() => handleLightToggle(key as keyof typeof lights)} theme={theme} accentColor={accentColor} />
                </div>
              ))}
            </div>
          </MirageCard>

          <MirageCard title="Climate" {...mirageCardProps}>
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <ThermostatIcon className="w-8 h-8" style={{ color: temperatureColor }} />
                    <div>
                        <p className="text-sm" style={{ color: 'var(--mirage-card-secondary-text-color)' }}>Inside</p>
                        <p className="text-2xl font-bold">{thermostat.currentTemp}°C</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm" style={{ color: 'var(--mirage-card-secondary-text-color)' }}>Set to</p>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => adjustTemp(-1)} className="text-2xl p-1 leading-none">-</button>
                      <p className="text-2xl font-bold tabular-nums">{thermostat.targetTemp}°C</p>
                      <button onClick={() => adjustTemp(1)} className="text-2xl p-1 leading-none">+</button>
                    </div>
                </div>
             </div>
          </MirageCard>

          <MirageCard title="Sensors" {...mirageCardProps}>
            <div className="space-y-4">
              {sensors.map(sensor => (
                <div key={sensor.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {getIcon(sensor.icon)}
                    <span>{sensor.name}</span>
                  </div>
                  <span className="font-semibold">{sensor.value}</span>
                </div>
              ))}
            </div>
          </MirageCard>
          
          <MirageCard title="Media Player" {...mirageCardProps}>
            <div className="flex items-center space-x-4">
              <img src={media.albumArt} alt="Album Art" className="w-20 h-20 rounded-md" />
              <div className="flex-1">
                <p className="font-bold truncate">{media.title}</p>
                <p className="text-sm" style={{ color: 'var(--mirage-card-secondary-text-color)' }}>{media.artist}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button><PrevIcon className="w-6 h-6" /></button>
                  <button onClick={togglePlay}>
                    {media.isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                  </button>
                  <button><NextIcon className="w-6 h-6" /></button>
                </div>
              </div>
            </div>
          </MirageCard>

          <MirageCard title="Scenes" {...mirageCardProps}>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => toggleScene('movie')} className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors ${scenes.movie ? 'bg-blue-500/30' : 'bg-white/5 hover:bg-white/10'}`}>
                <MovieIcon className="w-8 h-8" />
                <span>Movie Time</span>
              </button>
               <button onClick={() => toggleScene('goodnight')} className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors ${scenes.goodnight ? 'bg-blue-500/30' : 'bg-white/5 hover:bg-white/10'}`}>
                <BedIcon className="w-8 h-8" />
                <span>Goodnight</span>
              </button>
            </div>
          </MirageCard>
          
          <MirageCard title="Weather" {...mirageCardProps}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <WeatherCloudyIcon className="w-10 h-10" style={{ color: weatherColor }} />
                <div>
                  <p className="text-2xl font-bold">{weather.temp}°C</p>
                  <p className="text-sm" style={{ color: 'var(--mirage-card-secondary-text-color)' }}>{weather.condition}</p>
                </div>
              </div>
              <div className="text-right">
                <p>H: 22°</p>
                <p>L: 15°</p>
              </div>
            </div>
          </MirageCard>

          <MirageCard title="Users" {...mirageCardProps}>
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-6 h-6" />
                    <span>{user.name}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Home' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{user.status}</span>
                </div>
              ))}
            </div>
          </MirageCard>

          <MirageCard title="Switches" {...mirageCardProps}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <CloudRainIcon className="w-6 h-6" />
                  <span>Sprinkler</span>
                </div>
                <ToggleSwitch isOn={switches.sprinkler} onToggle={() => handleSwitchToggle('sprinkler')} theme={theme} accentColor={accentColor} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="w-6 h-6" />
                  <span>Pool Pump</span>
                </div>
                <ToggleSwitch isOn={switches.poolPump} onToggle={() => handleSwitchToggle('poolPump')} theme={theme} accentColor={accentColor} />
              </div>
            </div>
          </MirageCard>

          <MirageCard title="System Status" {...mirageCardProps} className="md:col-span-2 lg:col-span-1">
             <div className="space-y-3">
                {systemStatus.map(sensor => (
                  <div key={sensor.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {getIcon(sensor.icon)}
                      <span>{sensor.name}</span>
                    </div>
                    <span className="font-mono text-sm">{sensor.value}</span>
                  </div>
                ))}
            </div>
          </MirageCard>
          
          <MirageCard title="Network" {...mirageCardProps}>
             <div className="space-y-3">
                {networkStatus.map(sensor => (
                  <div key={sensor.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {getIcon(sensor.icon)}
                      <span>{sensor.name}</span>
                    </div>
                    <span className="font-mono text-sm">{sensor.value}</span>
                  </div>
                ))}
            </div>
          </MirageCard>
          
          <MirageCard title="Energy Usage (kWh)" {...mirageCardProps} className="md:col-span-2 lg:col-span-2">
            <div style={{ width: '100%', height: 150 }}>
              <ResponsiveContainer>
                <LineChart data={energyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="var(--mirage-card-secondary-text-color)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--mirage-card-secondary-text-color)" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30,30,30,0.8)',
                      borderColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="usage" stroke={accentColor} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MirageCard>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <SettingsProvider>
    <Dashboard />
  </SettingsProvider>
);

export default App;