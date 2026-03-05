import React from 'react';
import { UserCircle, LogOut } from 'lucide-react';
import { getAuthUser, logout } from '@/app/actions/auth';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySwitcher } from '@/components/domains/settings/CurrencySwitcher';

const Header = async () => {
  const user = await getAuthUser();
  const tNav = await getTranslations('Navigation');
  const tAuth = await getTranslations('Auth');

  return (
    <header className="fixed right-0 top-0 z-10 flex h-16 w-full md:w-[calc(100%-16rem)] items-center justify-between border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 px-4 md:px-8 pl-14 md:pl-8 transition-all">
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden sm:block">{tNav('overview')}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <CurrencySwitcher />
        <LanguageSwitcher />
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user.email}</span>
            <span
              className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
            >
              소속: {user.organization_id}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 px-2 py-1 rounded-md transition-colors"
              >
                <LogOut size={16} />
                {tAuth('logout')}
              </button>
            </form>
          </div>
        ) : (
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/10 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <UserCircle size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
