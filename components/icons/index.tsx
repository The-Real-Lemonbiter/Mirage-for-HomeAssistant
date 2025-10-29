/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import React from 'react';

type IconProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const LightbulbIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

export const ThermostatIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" />
  </svg>
);

export const HumidityIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.377c-2.886 3.65-8 9.5-8 12.123C4 20.933 7.582 22 12 22s8-1.067 8-3.5c0-2.623-5.114-8.473-8-12.123zM12 18s3-2 3-4c0-1.4-1.5-2.5-3-2.5S9 12.6 9 14c0 2 3 4 3 4z" />
  </svg>
);

export const DoorIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v16m8-16v16H8V4h8zM15 12h.01" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
    </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

export const NextIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
);

export const PrevIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
);

export const SpeakerIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const BorderIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="18" height="18" rx="1" strokeWidth="3" fill="none" />
  </svg>
);

export const BorderRadiusIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="3" fill="none" />
  </svg>
);

export const SeparatorIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
  </svg>
);

export const ContrastIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20V4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z" />
  </svg>
);

export const MovieIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

export const BedIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4a1 1 0 00-1 1v6a1 1 0 001 1h16a1 1 0 001-1v-6a1 1 0 00-1-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12V9a4 4 0 014-4h8a4 4 0 014 4v3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12v-2a2 2 0 012-2h6a2 2 0 012 2v2" />
    </svg>
);

export const WeatherCloudyIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h1m8-9v1M4.22 6.22l.707.707M12 21a9.003 9.003 0 008.66-6H3.34A9.003 9.003 0 0012 21z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a6.955 6.955 0 014.95 2.05A6.955 6.955 0 0122 10a7 7 0 11-14 0c0-2.31.84-4.4 2.2-6 .4-.48.83-.92 1.3-1.32A6.955 6.955 0 0112 3z" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const ChipIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H4a1 1 0 00-1 1v5m0 6v5a1 1 0 001 1h5m6 0h5a1 1 0 001-1v-5m0-6V4a1 1 0 00-1-1h-5M9 9h6v6H9V9z" />
    </svg>
);

export const MemoryIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 4V2M14 4V2M10 22v-2M14 22v-2M4 10H2M22 10h-2M4 14H2M22 14h-2" />
    </svg>
);

export const StorageIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

export const PowerOffIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6" />
    </svg>
);

export const RobotIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m14 0h2M3 15h2m14 0h2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5a7 7 0 100 14 7 7 0 000-14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8" />
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.955V12a9 9 0 019-9c3.032 0 5.801 1.455 7.618 3.784z" />
    </svg>
);

export const WifiIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.556A5.5 5.5 0 0112 15c1.442 0 2.78.536 3.889 1.556" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.343 12.787a10.5 10.5 0 0115.314 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" />
    </svg>
);

export const ArrowDownTrayIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const ArrowUpTrayIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

export const DevicePhoneMobileIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22l-.648-1.438a3.375 3.375 0 00-2.672-2.672L11.5 17.25l1.438-.648a3.375 3.375 0 002.672-2.672L16.25 12l.648 1.438a3.375 3.375 0 002.672 2.672L21 17.25l-1.438.648a3.375 3.375 0 00-2.672 2.672z" />
    </svg>
);

export const CloudRainIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 16.5c.348 0 .684-.04.996-.118A5.25 5.25 0 0015 7.5a5.25 5.25 0 00-5.25 5.25c0 1.28.467 2.45 1.25 3.333a5.21 5.21 0 01-.122.062 5.25 5.25 0 00-6.634 8.053" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a2.25 2.25 0 002.25-2.25c0-1.24-1.01-2.25-2.25-2.25s-2.25 1.01-2.25 2.25c0 1.24 1.01 2.25 2.25 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 21a2.25 2.25 0 002.25-2.25c0-1.24-1.01-2.25-2.25-2.25s-2.25 1.01-2.25 2.25c0 1.24 1.01 2.25 2.25 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 18a2.25 2.25 0 002.25-2.25c0-1.24-1.01-2.25-2.25-2.25s-2.25 1.01-2.25 2.25c0 1.24 1.01 2.25 2.25 2.25z" />
    </svg>
);

export const StyleGlassIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M19.7,2.3C19.3,1.9,18.7,1.9,18.3,2.3L2.3,18.3c-0.4,0.4-0.4,1,0,1.4C2.5,19.9,2.7,20,3,20s0.5-0.1,0.7-0.3L19.7,3.7 C20.1,3.3,20.1,2.7,19.7,2.3z M19,10c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S21.2,10,19,10z M19,16c-1.1,0-2-0.9-2-2s0.9-2,2-2 s2,0.9,2,2S20.1,16,19,16z M5,8C2.8,8,1,9.8,1,12s1.8,4,4,4s4-1.8,4-4S7.2,8,5,8z M5,14c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S6.1,14,5,14z M12,1c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S14.2,1,12,1z M12,7C10.9,7,10,6.1,10,5s0.9-2,2-2s2,0.9,2,2S13.1,7,12,7z" />
  </svg>
);

export const StyleSolidIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M2,2v20h20V2H2z M20,20H4V4h16V20z"/>
  </svg>
);

export const StylePaperIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M19.4,3.1L19.4,3.1C19.1,2.7,18.6,2.5,18,2.5H6C5.4,2.5,4.9,2.7,4.6,3.1l0,0c-0.3,0.4-0.4,0.9-0.4,1.4v15 C4.2,20.5,4.7,21,5.2,21h13.5c0.6,0,1-0.5,1-1V4.5C19.8,3.9,19.7,3.4,19.4,3.1z M18,19H6c-0.6,0-1-0.4-1-1V5c0-0.6,0.4-1,1-1h12 c0.6,0,1,0.4,1,1v13C19,18.6,18.6,19,18,19z"/>
  </svg>
);

export const StyleFloatingIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z"/>
  </svg>
);

export const BlurIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="4" cy="12" r="2" /> <circle cx="12" cy="12" r="2" /> <circle cx="20" cy="12" r="2" />
  </svg>
);

export const ColorPaletteIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const XIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const FontIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-4-4h8" />
        <path d="M4 6h16" />
    </svg>
);

export const AnimationIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export const SaveIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1-4l-3-3m0 0l-3 3m3-3v11" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const ExportIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const ImportIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
    </svg>
);

export const LanguageIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m0 16v-2M13.828 17.828a4 4 0 11-5.656-5.656 4 4 0 015.656 5.656zM13 12H9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm-9-9h2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12h-2.25M12 3v2.25M12 18.75V21m-4.502-1.998L6 17.25m10.5 1.5l1.502 1.502M6 6.75l-1.502-1.502" />
    </svg>
);