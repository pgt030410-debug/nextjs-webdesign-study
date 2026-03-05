'use client';

import React, { useState } from 'react';
import { Check, X, Zap, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { getExchangeRate } from '@/app/actions/exchange';
import { formatCurrency } from '@/lib/utils/currency';
import { useEffect } from 'react';

export default function BillingPage() {
    const t = useTranslations('Billing');
    const { currency } = useCurrencyStore();
    const [exchangeRate, setExchangeRate] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        let isMounted = true;
        getExchangeRate(currency).then(rate => {
            if (isMounted) setExchangeRate(rate);
        });
        return () => { isMounted = false; };
    }, [currency]);

    const handleUpgrade = (planName: string) => {
        setIsProcessing(true);
        const loadingToast = toast.loading(t('toast.setup', { planName }));

        // 모의 결제 딜레이
        setTimeout(() => {
            setIsProcessing(false);
            toast.error(t('toast.pending'), { id: loadingToast });
        }, 1500);
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t('title')}</h1>
                <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
            </div>

            <div
                className="mb-8 rounded-xl border p-6 shadow-sm dark:bg-gray-900/10"
                style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 10%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 30%, transparent)'
                }}
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('currentPlanLabel')}</h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-primary-brand, #3b82f6)' }}>
                            {t('usageMessage')}
                        </p>
                    </div>
                    <button
                        disabled
                        className="rounded-lg px-4 py-2 text-sm font-semibold cursor-not-allowed"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 20%, transparent)',
                            color: 'var(--color-primary-brand, #3b82f6)'
                        }}
                    >
                        {t('currentPlanBadge')}
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Starter Plan */}
                <motion.div whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('starter.title')}</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('starter.description')}</p>
                    <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{formatCurrency(0, currency, exchangeRate)}</span>
                        <span className="text-gray-500 dark:text-gray-400">/mo</span>
                    </div>
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> {t('starter.features.0')}</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> {t('starter.features.1')}</li>
                        <li className="flex items-center gap-2 text-gray-400 dark:text-gray-600"><X size={16} /> {t('starter.features.2')}</li>
                        <li className="flex items-center gap-2 text-gray-400 dark:text-gray-600"><X size={16} /> {t('starter.features.3')}</li>
                    </ul>
                    <button disabled className="mt-8 w-full rounded-lg bg-gray-100 dark:bg-gray-800 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {t('currentPlanBadge')}
                    </button>
                </motion.div>

                {/* Pro Plan */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="relative rounded-2xl border-2 bg-white dark:bg-gray-900 p-8 shadow-md"
                    style={{ borderColor: 'var(--color-primary-brand, #3b82f6)' }}
                >
                    <div
                        className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
                    >
                        {t('pro.badge')}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {t('pro.title')} <Zap className="text-amber-500" size={18} />
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('pro.description')}</p>
                    <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{formatCurrency(29000, currency, exchangeRate)}</span>
                        <span className="text-gray-500 dark:text-gray-400">/mo</span>
                    </div>
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> {t('pro.features.0')}</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> {t('pro.features.1')}</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> {t('pro.features.2')}</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> {t('pro.features.3')}</li>
                    </ul>
                    <button
                        onClick={() => handleUpgrade('Pro')}
                        disabled={isProcessing}
                        className="mt-8 w-full rounded-lg py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
                        style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
                    >
                        {t('pro.upgrade')}
                    </button>
                </motion.div>

                {/* Enterprise Plan */}
                <motion.div whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {t('enterprise.title')} <ShieldCheck className="text-purple-500" size={18} />
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('enterprise.description')}</p>
                    <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{t('enterprise.price')}</span>
                    </div>
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> {t('enterprise.features.0')}</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> {t('enterprise.features.1')}</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> {t('enterprise.features.2')}</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> {t('enterprise.features.3')}</li>
                    </ul>
                    <button
                        onClick={() => handleUpgrade('Enterprise')}
                        disabled={isProcessing}
                        className="mt-8 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        {t('enterprise.contactSales')}
                    </button>
                </motion.div>
            </div>

            <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-8 flex items-center gap-4">
                <div
                    className="flex p-3 rounded-full"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 15%, transparent)' }}
                >
                    <CreditCard style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t('paymentMethods.title')}</h4>
                    <p
                        className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
                        style={{ color: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 80%, black)' }}
                    >{t('paymentMethods.add')}</p>
                </div>
            </div>
        </div>
    );
}
