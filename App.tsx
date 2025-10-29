/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import React, { useState, useEffect } from 'react';
import { MirageCard } from './components/MirageCard';
import { ToggleSwitch } from './components/ToggleSwitch';
import { SettingsProvider, useSettings } from './components/SettingsProvider';
import { SettingsPanel } from './components/SettingsPanel';
import { 
  LightbulbIcon, ThermostatIcon, HumidityIcon, DoorIcon, PlayIcon, PauseIcon, NextIcon, PrevIcon, SpeakerIcon, 
  SettingsIcon,
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
  
  const handleLightToggle = (light: keyof typeof lights) => setLights(prev => ({ ...prev, [light]: !prev[light] }));
  const adjustTemp = (amount: number) => setThermostat(prev => ({ ...prev, targetTemp: prev.targetTemp + amount }));
  const togglePlay = () => setMedia(prev => ({...prev, isPlaying: !prev.isPlaying}));
  
  const { cardStyle, accentColor, temperatureColor, humidityColor, doorColor } = activeThemeConfig;
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
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