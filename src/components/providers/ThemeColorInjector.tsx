'use client';

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

/**
 * Injects custom CSS variables into the root document based on the Zustand theme store.
 * Useful for overriding Tailwind's default colors with custom hex codes dynamically.
 */
const TAILWIND_PRESETS: Record<string, string> = {
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  emerald: '#10b981',
  rose: '#f43f5e',
  amber: '#f59e0b',
  slate: '#64748b',
};

export function ThemeColorInjector() {
  const { brandColor, isCustomColor, customHex } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeColor = isCustomColor && customHex ? customHex : (TAILWIND_PRESETS[brandColor] || '#2563eb');

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        :root {
          --color-primary-brand: ${activeColor};
        }
        
        .dark {
          --color-primary-brand: ${activeColor};
        }
      `
    }} />
  );
}
