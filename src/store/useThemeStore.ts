import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    brandColor: string;
    brandName: string;
    isCustomColor: boolean;
    customHex: string;
    setBrandColor: (color: string) => void;
    setBrandName: (name: string) => void;
    setCustomHex: (hex: string) => void;
    resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            brandColor: 'blue', // Default Tailwind color name
            brandName: 'SaaS Admin',
            isCustomColor: false,
            customHex: '#3b82f6',
            setBrandColor: (color) => set({ brandColor: color, isCustomColor: false }),
            setBrandName: (name) => set({ brandName: name }),
            setCustomHex: (hex) => set({ customHex: hex, isCustomColor: true }),
            resetTheme: () => set({ brandColor: 'blue', brandName: 'SaaS Admin', isCustomColor: false, customHex: '#3b82f6' }),
        }),
        {
            name: 'b2b-saas-theme-storage',
        }
    )
);
