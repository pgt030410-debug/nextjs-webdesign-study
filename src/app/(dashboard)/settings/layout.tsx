'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Configure your organization preferences and billing details.
                    </p>
                </div>
                {pathname !== '/settings/appearance' && (
                    <button
                        className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity shrink-0"
                        style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
                    >
                        Save Changes
                    </button>
                )}
            </div>

            {/* Settings Navigation Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 dark:border-white/10 mb-6 gap-y-2">
                <Link
                    href="/settings"
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${pathname === '/settings' ? 'border-primary-brand text-primary-brand dark:border-primary-brand dark:text-primary-brand' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    General
                </Link>
                <Link
                    href="/settings/appearance"
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${pathname === '/settings/appearance' ? 'border-primary-brand text-primary-brand dark:border-primary-brand dark:text-primary-brand' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    Appearance
                </Link>
                <Link
                    href="/settings/security"
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${pathname === '/settings/security' ? 'border-primary-brand text-primary-brand dark:border-primary-brand dark:text-primary-brand' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    Enterprise Security
                </Link>
                <Link
                    href="/settings/audit"
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${pathname === '/settings/audit' ? 'border-primary-brand text-primary-brand dark:border-primary-brand dark:text-primary-brand' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    Audit Logs
                </Link>
            </div>

            {/* Sub-page Content renders here */}
            {children}
        </div>
    );
}
