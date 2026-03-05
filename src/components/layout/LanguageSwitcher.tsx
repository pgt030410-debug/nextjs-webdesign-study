'use client';

import React, { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export const LanguageSwitcher = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/');

            // If the URL already has a locale prefix, replace it
            if (pathParts.length > 1 && ['ko', 'en'].includes(pathParts[1])) {
                pathParts[1] = nextLocale;
                window.location.href = pathParts.join('/') + window.location.search;
            } else {
                // Otherwise prepend the locale
                window.location.href = `/${nextLocale}${currentPath === '/' ? '' : currentPath}` + window.location.search;
            }
        });
    };

    return (
        <div className="relative inline-block text-left mr-4">
            <select
                value={locale}
                onChange={handleLocaleChange}
                disabled={isPending}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-brand sm:text-sm sm:leading-6 cursor-pointer bg-white"
            >
                <option value="ko">🇰🇷 한국어</option>
                <option value="en">🇺🇸 English</option>
            </select>
        </div>
    );
};
