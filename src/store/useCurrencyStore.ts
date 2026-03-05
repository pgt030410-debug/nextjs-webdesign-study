import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CurrencyType = 'KRW' | 'USD';

interface CurrencyState {
    currency: CurrencyType;
    setCurrency: (currency: CurrencyType) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set) => ({
            currency: 'KRW',
            setCurrency: (currency) => set({ currency }),
        }),
        {
            name: 'currency-storage',
        }
    )
);
