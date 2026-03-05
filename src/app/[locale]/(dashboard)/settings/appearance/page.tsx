'use client';

import React from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { Check, Palette, Type, RotateCcw, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

const colorOptions = [
    { name: 'blue', hex: '#3b82f6', label: 'Tech Blue' },
    { name: 'indigo', hex: '#6366f1', label: 'Indigo' },
    { name: 'violet', hex: '#8b5cf6', label: 'Violet' },
    { name: 'emerald', hex: '#10b981', label: 'Emerald' },
    { name: 'rose', hex: '#f43f5e', label: 'Rose' },
    { name: 'amber', hex: '#f59e0b', label: 'Amber' },
    { name: 'slate', hex: '#64748b', label: 'Slate' },
];

export default function AppearancePage() {
    const { brandColor, brandName, isCustomColor, customHex, setBrandColor, setBrandName, setCustomHex, resetTheme } = useThemeStore();
    const t = useTranslations('Settings.appearance');

    // Local state for the input before saving
    const [tempBrandName, setTempBrandName] = React.useState(brandName);
    const [tempHex, setTempHex] = React.useState(customHex);

    const handleSaveBrandName = () => {
        if (!tempBrandName.trim()) {
            toast.error(t('nameEmptyToast'));
            return;
        }
        setBrandName(tempBrandName);
        toast.success(t('nameUpdatedToast'));
    };

    const handleSaveHex = () => {
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (!hexRegex.test(tempHex)) {
            toast.error(t('hexInvalidToast'));
            return;
        }
        setCustomHex(tempHex);
        toast.success(t('themeUpdatedToast', { hex: tempHex }));
    };

    const handleReset = () => {
        if (confirm(t('resetConfirm'))) {
            resetTheme();
            setTempBrandName('SaaS Admin'); // Sync local input
            setTempHex('#3b82f6');
            toast.success(t('resetToast'));
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-10 animate-in fade-in duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t('title')}</h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {t('description')}
                </p>
            </div>

            <div className="grid gap-8">
                {/* Brand Identity Section */}
                <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                            <Type className="text-gray-400 dark:text-gray-500" size={20} />
                            {t('brandIdentity')}
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="max-w-md">
                            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('companyName')}
                            </label>
                            <div className="flex gap-3">
                                <input
                                    id="brandName"
                                    type="text"
                                    value={tempBrandName}
                                    onChange={(e) => setTempBrandName(e.target.value)}
                                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                    placeholder={t('companyNamePlaceholder')}
                                />
                                <button
                                    onClick={handleSaveBrandName}
                                    className="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
                                >
                                    {t('save')}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                {t('companyNameHelp')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Brand Theme Color Section */}
                <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                            <Palette className="text-gray-400 dark:text-gray-500" size={20} />
                            {t('themeColor')}
                        </h2>
                    </div>
                    <div className="p-6">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            {t('primaryBrandColor')}
                        </p>
                        <div className="flex flex-wrap gap-4 mb-8">
                            {colorOptions.map((color) => {
                                const isSelected = brandColor === color.name && !isCustomColor;
                                return (
                                    <button
                                        key={color.name}
                                        onClick={() => {
                                            setBrandColor(color.name);
                                            toast.success(t('themeTranslatedToast', { label: color.label }));
                                        }}
                                        className={`group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl border-2 transition-all hover:scale-110 active:scale-95 ${isSelected ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.label}
                                    >
                                        <span className="sr-only">{color.label}</span>
                                        {isSelected && <Check className="text-white drop-shadow-md" size={24} strokeWidth={3} />}

                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                                            {color.label}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                {t('customHexColor')}
                            </p>
                            <div className="flex gap-3 max-w-sm">
                                <div className="relative flex-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Hash className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={tempHex}
                                        onChange={(e) => setTempHex(e.target.value)}
                                        placeholder="#FF5733"
                                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:border-gray-100 dark:focus:ring-gray-100 transition-colors uppercase"
                                    />
                                </div>
                                <div
                                    className="h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm shrink-0"
                                    style={{ backgroundColor: tempHex.length >= 4 ? tempHex : 'transparent' }}
                                />
                                <button
                                    onClick={handleSaveHex}
                                    className="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
                                >
                                    {t('apply')}
                                </button>
                            </div>
                        </div>

                        <div className={`mt-8 rounded-xl p-4 transition-colors ${isCustomColor ? 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800' : `bg-${brandColor}-50 dark:bg-${brandColor}-900/20 border border-${brandColor}-100 dark:border-${brandColor}-800/30`}`}>
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 rounded-full p-1 transition-colors ${isCustomColor ? 'bg-gray-200 dark:bg-gray-800' : `bg-${brandColor}-100 dark:bg-${brandColor}-900/50`}`}>
                                    <Palette className={isCustomColor ? 'text-gray-700 dark:text-gray-300' : `text-${brandColor}-600 dark:text-${brandColor}-400`} size={16} />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold transition-colors ${isCustomColor ? 'text-gray-900 dark:text-gray-100' : `text-${brandColor}-900 dark:text-${brandColor}-100`}`}>{t('colorPreview')}</h4>
                                    <p className={`mt-1 text-xs transition-colors ${isCustomColor ? 'text-gray-600 dark:text-gray-400' : `text-${brandColor}-700 dark:text-${brandColor}-300/80`}`}>
                                        {t('colorPreviewDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reset Actions */}
                <div className="flex justify-start">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors font-medium px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                    >
                        <RotateCcw size={16} />
                        {t('resetSettings')}
                    </button>
                </div>
            </div>
        </div>
    );
}
