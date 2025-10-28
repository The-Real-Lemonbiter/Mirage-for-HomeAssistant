/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import 'react';

// Fix: Augment React's CSSProperties to allow custom properties which are used for styleOverrides.
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

export type Theme = 'light' | 'dark';
export type CardStyle = 'glass' | 'solid' | 'floating' | 'paper';
export type FontStyle = 'system' | 'serif' | 'monospace';
export type CardTextColorMode = 'auto' | 'light' | 'dark';
export type Language = 'en' | 'de' | 'fr';

export interface ThermostatDevice {
  id: string;
  name: string;
  currentTemp: number;
  targetTemp: number;
  mode: 'heat' | 'cool' | 'off';
}

export interface SensorDevice {
  id:string;
  name: string;
  value: string;
  icon: 'door' | 'humidity' | 'temperature';
  history?: { time: string; value: number }[];
}

export interface MediaDevice {
    isPlaying: boolean;
    artist: string;
    title: string;
    albumArt: string;
}

export interface Scene {
  id: string;
  name: string;
  // Fix: The icon component type should include `style` to match its usage in `App.tsx`.
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export interface DimmerLightDevice {
  id: string;
  name: string;
  isOn: boolean;
  brightness: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export interface SystemStatus {
  cpuTemp: number;
  memoryUsage: number;
  storageFree: number;
  networkStatus: 'online' | 'offline';
}

export interface NetworkDevice {
  downloadSpeed: number; // in Mbps
  uploadSpeed: number; // in Mbps
}

export interface TextColors {
  primary: string;
  secondary: string;
}

// Represents the state that can be saved/loaded in a preset
export interface SettingsState {
  theme: Theme;
  cardStyle: CardStyle;
  transparency: number;
  blurIntensity: number;
  solidColorDark: string;
  solidColorLight: string;
  paperColorDark: string;
  paperColorLight: string;
  floatingOpacity: number;
  floatingColorDark: string;
  floatingColorLight: string;
  borderThickness: number;
  separatorThickness: number;
  borderRadius: number;
  accentColor: string;
  temperatureColor: string | null;
  weatherColor: string | null;
  humidityColor: string | null;
  doorColor: string | null;
  darkThemeTextColors: TextColors;
  lightThemeTextColors: TextColors;
  cardTextColorMode: CardTextColorMode;
  bgColorDark: string;
  bgColorLight: string;
  customBgDark: string | null;
  customBgLight: string | null;
  font: FontStyle;
  animationsEnabled: boolean;
  language: Language;
}

export interface Preset {
  key: string;
  name: string;
  isDefault?: boolean;
  settings: Partial<SettingsState>;
}

export interface MirageCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  theme: Theme;
  cardStyle: CardStyle;
  styleOverrides?: React.CSSProperties;
}


export interface SettingsContextType extends SettingsState {
  setTheme: (theme: Theme) => void;
  setCardStyle: (style: CardStyle) => void;
  setTransparency: (value: number) => void;
  setBlurIntensity: (value: number) => void;
  setSolidColorDark: (color: string) => void;
  setSolidColorLight: (color: string) => void;
  setPaperColorDark: (color: string) => void;
  setPaperColorLight: (color: string) => void;
  setFloatingOpacity: (value: number) => void;
  setFloatingColorDark: (color: string) => void;
  setFloatingColorLight: (color: string) => void;
  setBorderThickness: (value: number) => void;
  setSeparatorThickness: (value: number) => void;
  setBorderRadius: (value: number) => void;
  setAccentColor: (color: string) => void;
  setTemperatureColor: (color: string | null) => void;
  setWeatherColor: (color: string | null) => void;
  setHumidityColor: (color: string | null) => void;
  setDoorColor: (color: string | null) => void;
  setDarkThemeTextColors: (colors: TextColors) => void;
  setLightThemeTextColors: (colors: TextColors) => void;
  setCardTextColorMode: (mode: CardTextColorMode) => void;
  setBgColorDark: (color: string) => void;
  setBgColorLight: (color: string) => void;
  setCustomBgDark: (bg: string | null) => void;
  setCustomBgLight: (bg: string | null) => void;
  setFont: (font: FontStyle) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setLanguage: (lang: Language) => void;
  
  resetSettings: () => void;
  currentTextColors: TextColors;

  // Translation function
  t: (key: string, replacements?: { [key: string]: string }) => string;

  // Preset management
  presets: Preset[];
  applyPreset: (preset: Preset) => void;
  savePreset: (name: string) => void;
  deletePreset: (key: string) => void;
  
  // Import/Export
  exportSettings: () => string;
  importSettings: (settingsString: string) => boolean;
}