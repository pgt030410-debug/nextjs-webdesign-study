'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, Menu, X, CreditCard, FileText } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useTranslations } from 'next-intl';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { brandName, brandColor, isCustomColor } = useThemeStore();
  const t = useTranslations('Navigation');

  const navItems: NavItem[] = [
    { label: t('dashboard'), href: '/', icon: LayoutDashboard },
    { label: t('reports'), href: '/reports', icon: FileText },
    { label: t('users'), href: '/users', icon: Users },
    { label: t('settings'), href: '/settings', icon: Settings },
    { label: t('billing'), href: '/billing', icon: CreditCard },
  ];

  // Helper to remove locale prefix from pathname for exact matching
  const stripLocale = (path: string) => {
    return path.replace(/^\/(ko|en)/, '') || '/';
  };
  const activePath = stripLocale(pathname);

  // Mounted check for hydration mismatch prevention
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <button
        className="fixed top-3 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 shadow-sm md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 dark:bg-black/80 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-16 items-center border-b border-gray-200 dark:border-white/10 px-6 justify-between md:justify-start">
          <span
            className={`text-xl font-bold transition-colors ${!isCustomColor ? `bg-clip-text text-transparent bg-gradient-to-r from-${brandColor}-600 to-${brandColor}-400 dark:from-${brandColor}-400 dark:to-${brandColor}-300` : ''}`}
            style={isCustomColor ? { color: 'var(--color-primary-brand, #3b82f6)' } : {}}
          >
            {mounted ? brandName : 'SaaS Admin'}
          </span>
          {/* Close button inside sidebar on mobile */}
          <button className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = activePath === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close sidebar on mobile
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                  ? (!isCustomColor ? `bg-${brandColor}-50 text-${brandColor}-600 dark:bg-${brandColor}-900/40 dark:text-${brandColor}-400 font-semibold` : 'font-semibold')
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                  }`}
                style={isActive && isCustomColor ? { backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 15%, transparent)', color: 'var(--color-primary-brand, #3b82f6)' } : {}}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
