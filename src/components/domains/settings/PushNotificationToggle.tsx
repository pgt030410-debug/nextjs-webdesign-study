'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export const PushNotificationToggle = () => {
    const t = useTranslations('Settings.security.push');
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (!('Notification' in window)) {
            setIsSupported(false);
            return;
        }
        setPermission(Notification.permission);
    }, []);

    const handleToggle = async () => {
        if (!isSupported) {
            toast.error(t('unsupported'));
            return;
        }

        if (permission === 'granted') {
            toast.error(t('alreadyGranted'));
            return;
        }

        try {
            const newPermission = await Notification.requestPermission();
            setPermission(newPermission);

            if (newPermission === 'granted') {
                const title = t('successTitle');
                const options = {
                    body: t('successBody'),
                    icon: '/icons/icon.svg',
                    badge: '/icons/icon.svg',
                    tag: 'b2b-saas-notification-test',
                };

                // Service Worker registration check and push
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.ready.then((registration) => {
                        registration.showNotification(title, options);
                    }).catch(() => {
                        new Notification(title, options);
                    });
                } else {
                    new Notification(title, options);
                }

                toast.success(t('success'));
            } else if (newPermission === 'denied') {
                toast.error(t('denied'));
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            toast.error(t('error'));
        }
    };

    const isActive = permission === 'granted';

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-gray-800/50">
            <div className="flex gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                    {isActive ? <Bell size={20} /> : <BellOff size={20} />}
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t('title')}</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                        {t('description')}
                    </p>
                    {permission === 'denied' && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500">
                            <Info size={14} />
                            <span>{t('blocked')}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 sm:mt-0 ml-[56px] sm:ml-0 self-start sm:self-center">
                <button
                    onClick={handleToggle}
                    disabled={!isSupported || permission === 'denied'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${isActive ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        } ${(!isSupported || permission === 'denied') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    role="switch"
                    aria-checked={isActive}
                >
                    <span className="sr-only">Enable notifications</span>
                    <span
                        className={`${isActive ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white dark:bg-gray-300'
                            } inline-block h-4 w-4 transform rounded-full transition-transform`}
                    />
                </button>
            </div>
        </div>
    );
};
