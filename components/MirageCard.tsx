/**
 * Copyright (c) 2025 Lemonbiter
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import React from 'react';
import type { MirageCardProps } from '../types';

export const MirageCard: React.FC<MirageCardProps> = ({ 
  title, 
  children, 
  className, 
  theme,
  cardStyle
}) => {
  
  const themeSuffix = theme === 'dark' ? 'dark' : 'light';
  
  // Base styles are defined first
  const baseContainerStyle: React.CSSProperties = {
    borderRadius: 'var(--mirage-border-radius)',
    borderWidth: 'var(--mirage-border-width)',
    transition: 'all 0.3s ease',
  };

  const baseHeaderStyle: React.CSSProperties = {
    color: 'var(--mirage-card-primary-text-color)',
    borderBottomStyle: 'solid',
    borderBottomWidth: 'var(--mirage-separator-width)',
  };

  let specificContainerStyle: React.CSSProperties = {};
  let specificHeaderStyle: React.CSSProperties = {};
  
  // Style variations are applied based on the cardStyle prop
  switch (cardStyle) {
    case 'glass':
      specificContainerStyle = {
        backdropFilter: 'var(--mirage-glass-blur)',
        WebkitBackdropFilter: 'var(--mirage-glass-blur)',
        backgroundColor: `var(--mirage-glass-bg-color-${themeSuffix})`,
        borderColor: `var(--mirage-glass-border-color-${themeSuffix})`,
        boxShadow: `var(--mirage-glass-shadow-${themeSuffix})`,
      };
      specificHeaderStyle.borderBottomColor = `var(--mirage-glass-border-color-${themeSuffix})`;
      break;
    case 'solid':
      specificContainerStyle = {
        backgroundColor: `var(--mirage-solid-bg-color-${themeSuffix})`,
        borderColor: `var(--mirage-solid-border-color-${themeSuffix})`,
        boxShadow: `var(--mirage-solid-shadow-${themeSuffix})`,
      };
      specificHeaderStyle.borderBottomColor = `var(--mirage-solid-border-color-${themeSuffix})`;
      break;
    case 'paper':
      specificContainerStyle = {
        backgroundColor: `var(--mirage-paper-bg-color-${themeSuffix})`,
        borderColor: `var(--mirage-paper-border-color-${themeSuffix})`,
        boxShadow: `var(--mirage-paper-shadow-${themeSuffix})`,
      };
      specificHeaderStyle.borderBottomColor = `var(--mirage-paper-border-color-${themeSuffix})`;
      break;
    case 'floating':
      specificContainerStyle = {
        backgroundColor: `var(--mirage-floating-bg-color-${themeSuffix})`,
        boxShadow: `var(--mirage-floating-shadow-${themeSuffix})`,
        borderWidth: '0px',
      };
      specificHeaderStyle.borderBottomWidth = '0px';
      break;
  }

  // Combine base and specific styles to get the final result
  const finalContainerStyle = { ...baseContainerStyle, ...specificContainerStyle };
  const finalHeaderStyle = { ...baseHeaderStyle, ...specificHeaderStyle };
  
  const contentStyle: React.CSSProperties = {
    color: 'var(--mirage-card-primary-text-color)',
  };

  const containerClasses = `relative border overflow-hidden`;

  return (
    <div className={`${containerClasses} ${className}`} style={finalContainerStyle}>
      <div className={`px-6 py-4 relative z-10`} style={finalHeaderStyle}>
        <h2 className="font-semibold tracking-wide text-lg">{title}</h2>
      </div>
      <div className="p-6 relative z-10" style={contentStyle}>
        {children}
      </div>
    </div>
  );
};