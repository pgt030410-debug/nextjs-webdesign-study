'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Anomaly {
    date: string;
    metric: string;
    value: number;
    issue: string;
}

export default function AnomalyAlerts({ anomalies }: { anomalies: Anomaly[] | null }) {
    const t = useTranslations('Dashboard.anomaly');

    if (!anomalies) {
        return (
            <Card className="border-red-200/50 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 shadow-sm animate-pulse">
                <CardHeader>
                    <CardTitle className="text-red-800 dark:text-red-400 font-bold flex gap-2"><AlertCircle size={20} /> {t('loading')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-10 bg-red-100 dark:bg-red-900/20 rounded-md w-full mb-2"></div>
                </CardContent>
            </Card>
        );
    }

    if (anomalies.length === 0) {
        return (
            <Card className="border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white font-bold flex gap-2">{t('noAlertsTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">{t('noAlertsDesc')}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-gray-900 overflow-hidden relative">
            <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ background: 'linear-gradient(90deg, var(--color-primary-brand, #ef4444), transparent)' }}
            />
            <CardHeader
                className="rounded-t-xl border-b border-gray-100 dark:border-white/10 pb-4 pt-5 bg-white dark:bg-gray-900"
            >
                <CardTitle
                    className="font-bold flex items-center gap-3 text-gray-900 dark:text-white text-lg"
                >
                    <div
                        className="p-1.5 rounded-lg flex items-center justify-center border shadow-sm"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #ef4444) 10%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--color-primary-brand, #ef4444) 20%, transparent)',
                            boxShadow: '0 0 15px -4px color-mix(in srgb, var(--color-primary-brand, #ef4444) 50%, transparent)'
                        }}
                    >
                        <AlertCircle size={20} style={{ color: 'var(--color-primary-brand, #ef4444)' }} />
                    </div>
                    {t('actionRequired', { count: anomalies.length })}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
                {anomalies.map((anom, idx) => (
                    <div key={idx} className="flex flex-col gap-1 border-b border-gray-100 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{anom.date}</span>
                            <span
                                className="text-xs px-2 py-0.5 rounded-full font-medium tracking-tight"
                                style={{
                                    backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #ef4444) 15%, transparent)',
                                    color: 'var(--color-primary-brand, #ef4444)'
                                }}
                            >
                                {t('reviewNeeded')}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                            {anom.issue} <span style={{ color: 'var(--color-primary-brand, #ef4444)' }} className="font-semibold">{t('metric', { metric: anom.metric })}</span>
                        </p>
                        <p className="text-xs text-gray-500">{t('dropEstimate', { value: anom.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) })}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
