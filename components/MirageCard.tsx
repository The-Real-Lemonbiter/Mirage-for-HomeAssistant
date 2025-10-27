/**
 * Copyright (c) 2024 Lemonbiter
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
  cardStyle,
  styleOverrides
}) => {
  
  const styleProps: React.CSSProperties = {
      ...styleOverrides, // Apply overrides first
      borderRadius: styleOverrides?.['--mirage-border-radius'] || 'var(--mirage-border-radius)',
  };

  const headerInlineStyle: React.CSSProperties = {
    borderBottomStyle: 'solid',
    // Fix: Cast style override to string to satisfy CSSProperties type, which expects a string for color properties.
    color: (styleOverrides?.['--mirage-card-primary-text-color'] as string) || 'var(--mirage-card-primary-text-color)',
    borderBottomWidth: styleOverrides?.['--mirage-separator-width'] || 'var(--mirage-separator-width)',
    borderBottomColor: (styleOverrides?.['--mirage-separator-color'] as string) || 'var(--mirage-separator-color)',
  };
  
  const contentStyle: React.CSSProperties = {
    // Fix: Cast style override to string to satisfy CSSProperties type.
    color: (styleOverrides?.['--mirage-card-primary-text-color'] as string) || 'var(--mirage-card-primary-text-color)',
  }

  const themeSuffix = theme === 'dark' ? 'dark' : 'light';

  if (cardStyle === 'glass') {
    // Fix: Cast style overrides to string to satisfy CSSProperties types for filter, color, border, and shadow properties.
    styleProps.backdropFilter = (styleOverrides?.['--mirage-glass-blur'] as string) || 'var(--mirage-glass-blur)';
    styleProps.WebkitBackdropFilter = (styleOverrides?.['--mirage-glass-blur'] as string) || 'var(--mirage-glass-blur)';
    styleProps.borderWidth = styleOverrides?.['--mirage-border-width'] || 'var(--mirage-border-width)';
    styleProps.backgroundColor = (styleOverrides?.[`--mirage-glass-bg-color-${themeSuffix}`] as string) || `var(--mirage-glass-bg-color-${themeSuffix})`;
    styleProps.borderColor = (styleOverrides?.[`--mirage-glass-border-color-${themeSuffix}`] as string) || `var(--mirage-glass-border-color-${themeSuffix})`;
    styleProps.boxShadow = (styleOverrides?.[`--mirage-glass-shadow-${themeSuffix}`] as string) || `var(--mirage-glass-shadow-${themeSuffix})`;
    headerInlineStyle.borderBottomColor = (styleOverrides?.[`--mirage-glass-border-color-${themeSuffix}`] as string) || `var(--mirage-glass-border-color-${themeSuffix})`;
  } else if (cardStyle === 'solid') {
    styleProps.borderWidth = styleOverrides?.['--mirage-border-width'] || 'var(--mirage-border-width)';
    // Fix: Cast style overrides to string to satisfy CSSProperties types for color, border, and shadow properties.
    styleProps.backgroundColor = (styleOverrides?.[`--mirage-solid-bg-color-${themeSuffix}`] as string) || `var(--mirage-solid-bg-color-${themeSuffix})`;
    styleProps.borderColor = (styleOverrides?.[`--mirage-solid-border-color-${themeSuffix}`] as string) || `var(--mirage-solid-border-color-${themeSuffix})`;
    styleProps.boxShadow = (styleOverrides?.[`--mirage-solid-shadow-${themeSuffix}`] as string) || `var(--mirage-solid-shadow-${themeSuffix})`;
    headerInlineStyle.borderBottomColor = (styleOverrides?.[`--mirage-solid-border-color-${themeSuffix}`] as string) || `var(--mirage-solid-border-color-${themeSuffix})`;
  } else if (cardStyle === 'paper') {
    styleProps.borderWidth = styleOverrides?.['--mirage-border-width'] || 'var(--mirage-border-width)';
    // Fix: Cast style overrides to string to satisfy CSSProperties types for color, border, and shadow properties.
    styleProps.backgroundColor = (styleOverrides?.[`--mirage-paper-bg-color-${themeSuffix}`] as string) || `var(--mirage-paper-bg-color-${themeSuffix})`;
    styleProps.borderColor = (styleOverrides?.[`--mirage-paper-border-color-${themeSuffix}`] as string) || `var(--mirage-paper-border-color-${themeSuffix})`;
    styleProps.boxShadow = (styleOverrides?.[`--mirage-paper-shadow-${themeSuffix}`] as string) || `var(--mirage-paper-shadow-${themeSuffix})`;
    headerInlineStyle.borderBottomColor = (styleOverrides?.[`--mirage-paper-border-color-${themeSuffix}`] as string) || `var(--mirage-paper-border-color-${themeSuffix})`;
  } else { // Floating
    styleProps.borderWidth = styleOverrides?.['--mirage-border-width'] || '0px';
    // Fix: Cast style overrides to string to satisfy CSSProperties types for color and shadow properties.
    styleProps.backgroundColor = (styleOverrides?.[`--mirage-floating-bg-color-${themeSuffix}`] as string) || `var(--mirage-floating-bg-color-${themeSuffix})`;
    styleProps.boxShadow = (styleOverrides?.[`--mirage-floating-shadow-${themeSuffix}`] as string) || `var(--mirage-floating-shadow-${themeSuffix})`;
    headerInlineStyle.borderBottomWidth = '0px';
  }

  if (headerInlineStyle.borderBottomWidth === '0px' || cardStyle === 'floating') {
    headerInlineStyle.borderBottomColor = 'transparent';
  }
  
  const containerClasses = `relative border transition-all duration-300 overflow-hidden`;

  return (
    <div className={`${containerClasses} ${className}`} style={styleProps}>
      <div className={`px-6 py-4 relative z-10`} style={headerInlineStyle}>
        <h2 className="font-semibold tracking-wide text-lg">{title}</h2>
      </div>
      <div className="p-6 relative z-10" style={contentStyle}>
        {children}
      </div>
    </div>
  );
};