'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Server, Key, AlertCircle } from 'lucide-react';
import { PushNotificationToggle } from '@/components/domains/settings/PushNotificationToggle';
import { useTranslations } from 'next-intl';

export default function SecurityPage() {
    const [isSaving, setIsSaving] = useState(false);
    const t = useTranslations('Settings.security');

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            // In a real app, toast notification here
            alert(t('successToast'));
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h3 className="text-lg font-medium">{t('title')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('description')}
                </p>
            </div>

            <PushNotificationToggle />

            <Card className="border border-gray-200 dark:border-white/10 shadow-sm">
                <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <CardTitle className="text-base text-gray-800 dark:text-gray-200">{t('samlTitle')}</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-gray-500">
                        {t('samlDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 bg-white dark:bg-gray-900">

                    <div className="space-y-2">
                        <label htmlFor="idp-entity-id" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('idpLabel')}</label>
                        <Input id="idp-entity-id" placeholder="https://idp.example.com/metadata" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="sso-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('ssoLabel')}</label>
                        <Input id="sso-url" placeholder="https://idp.example.com/sso" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="cert" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('certLabel')}</label>
                        <textarea
                            id="cert"
                            className="w-full flex min-h-[120px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-brand dark:text-gray-100 font-mono text-xs"
                            placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                        <Button
                            style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
                            className="text-white hover:opacity-90"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? t('savingSso') : t('saveSso')}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Helper alert */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800/50">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">{t('helpTitle')}</h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                            <p>{t('helpDesc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
