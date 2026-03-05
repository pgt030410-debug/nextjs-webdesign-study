'use client';

import React, { useTransition } from 'react';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useRouter } from 'next/navigation';

export const CurrencySwitcher = () => {
    const { currency, setCurrency } = useCurrencyStore();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextCurrency = e.target.value as 'KRW' | 'USD';
        setCurrency(nextCurrency);

        startTransition(() => {
            document.cookie = `NEXT_CURRENCY=${nextCurrency}; path=/; max-age=31536000; SameSite=Lax`;
            router.refresh();
        });
    };

    return (
        <div className="relative inline-block text-left mr-2 sm:mr-4">
            <select
                value={currency}
                onChange={handleCurrencyChange}
                disabled={isPending}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 font-mono tracking-wider focus:ring-2 focus:ring-primary-brand sm:text-sm sm:leading-6 cursor-pointer bg-white"
                title="Select Currency"
            >
                <option value="KRW">KRW (₩)</option>
                <option value="USD">USD ($)</option>
            </select>
        </div>
    );
};
