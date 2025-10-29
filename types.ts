/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import 'react';
import type { HAConnection } from './ha-connection';

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
export type EditMode = 'day' | 'night';

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
}

export interface MediaDevice {
    isPlaying: boolean;
    artist: string;
    title: string;
    albumArt: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
}

// Represents theme-specific settings that can differ between day and night.
export interface ThemeConfig {
  cardStyle: CardStyle;
  transparency: number;
  blurIntensity: number;
  solidColor: string;
  paperColor: string;
  floatingOpacity: number;
  floatingColor: string;
  borderThickness: number;
  separatorThickness: number;
  borderRadius: number;
  accentColor: string;
  temperatureColor: string | null;
  weatherColor: string | null;
  humidityColor: string | null;
  doorColor: string | null;
  pageTextColor: TextColors;
  cardTextColorMode: CardTextColorMode;
  bgColor: string;
  customBg: string | null;
}

// Represents settings that are not theme-dependent.
export interface GeneralSettings {
  font: FontStyle;
  animationsEnabled: boolean;
}

// The complete state managed by the provider
export interface SettingsState {
  day: ThemeConfig;
  night: ThemeConfig;
  general: GeneralSettings;
}

export interface Preset {
  key: string;
  name: string;
  isDefault?: boolean;
  // A preset can contain settings for day, night, or both.
  settings: {
    day?: Partial<ThemeConfig>;
    night?: Partial<ThemeConfig>;
    general?: Partial<GeneralSettings>;
  }
}

export interface MirageCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  theme: Theme;
  cardStyle: CardStyle;
}


export interface SettingsContextType {
  // Current state snapshot
  settings: SettingsState | null; // Can be null until loaded from HA
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Edit mode for settings panel
  activeEditMode: EditMode;
  setActiveEditMode: (mode: EditMode) => void;
  
  // Getters for currently active theme (based on light/dark mode)
  activeThemeConfig: ThemeConfig;
  currentTextColors: TextColors;
  
  // Generic setter for the active theme config
  updateActiveThemeConfig: (key: keyof ThemeConfig, value: any) => void;

  // Generic setter for general settings
  updateGeneralSetting: (key: keyof GeneralSettings, value: any) => void;
  
  // Actions
  resetSettings: (mode: 'day' | 'night' | 'general' | 'all') => void;

  // Translation function
  t: (key: string, replacements?: { [key: string]: string }) => string;
  haLanguage: string;
  setHaLanguage: (lang: string) => void;

  // Preset management
  presets: Preset[];
  applyPreset: (preset: Preset) => void;
  savePreset: (name: string) => void;
  deletePreset: (key: string) => void;
  
  // Import/Export
  exportSettings: () => string;
  importSettings: (settingsString: string) => boolean;

  // HA specific actions
  saveSettingsToHA: () => Promise<void>;
  uploadBackgroundImage: (file: File) => Promise<string | null>;
  haConnection: HAConnection | null;
}