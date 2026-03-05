import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import WebhookSettings from '@/components/domains/settings/WebhookSettings';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
    const t = useTranslations('Settings.general');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="dark:bg-gray-900 border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
                <CardHeader
                    className="rounded-t-xl border-b border-gray-100 dark:border-white/10 py-4 bg-white dark:bg-gray-900"
                >
                    <div className="flex flex-row items-center gap-4">
                        <div
                            className="rounded-xl border p-2 flex items-center justify-center relative shadow-sm"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--color-primary-brand) 10%, transparent)',
                                borderColor: 'color-mix(in srgb, var(--color-primary-brand) 20%, transparent)',
                                boxShadow: '0 0 20px -5px color-mix(in srgb, var(--color-primary-brand) 40%, transparent)'
                            }}
                        >
                            <SettingsIcon className="h-5 w-5 relative z-10" style={{ color: 'var(--color-primary-brand)' }} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <CardTitle className="dark:text-white text-lg font-bold">{t('title')}</CardTitle>
                            <CardDescription className="dark:text-gray-400 text-sm">{t('description')}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                            <label htmlFor="workspaceName" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('workspaceName')}</label>
                            <input
                                id="workspaceName"
                                type="text"
                                defaultValue="My Organization"
                                className="flex w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-800 dark:text-white px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-brand dark:focus:ring-primary-brand transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('contactEmail')}</label>
                            <input
                                id="contactEmail"
                                type="email"
                                defaultValue="admin@example.com"
                                className="flex w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-800 dark:text-white px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-brand dark:focus:ring-primary-brand transition-all"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <WebhookSettings />
        </div>
    );
}
