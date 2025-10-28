/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import React from 'react';
import type { Theme } from '../types';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  theme: Theme;
  accentColor: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle, theme, accentColor }) => {
  const trackBaseClasses = 'relative w-12 h-7 rounded-full transition-colors duration-300 ease-in-out cursor-pointer';
  
  const trackStateClasses = isOn
    ? '' // Use inline style for the active color
    : theme === 'dark'
      ? 'bg-white/10'
      : 'bg-black/5';
      
  const trackStyle = isOn ? { backgroundColor: accentColor } : {};

  const thumbClasses = `
    absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md
    transition-transform duration-300 ease-in-out
    ${theme === 'light' ? 'bg-white/90 backdrop-blur-sm' : 'bg-white'}
    ${isOn ? 'translate-x-[1.25rem]' : 'translate-x-0'}
  `;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${trackBaseClasses} ${trackStateClasses}`}
      style={trackStyle}
      role="switch"
      aria-checked={isOn}
    >
      <span className="sr-only">Toggle</span>
      <span className={thumbClasses} />
    </button>
  );
};