'use client';

import React, { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';

export type DateRange = {
    from: string; // YYYY-MM-DD
    to: string;
};

export type Preset = 'today' | 'yesterday' | 'last7' | 'thisMonth' | 'custom';

interface DateRangePickerProps {
    onDateChange: (range: DateRange, preset: Preset) => void;
}

// 🇰🇷 KST Timezone Helper
const getKstDate = (offsetDays = 0) => {
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + kstOffset);
    kstTime.setDate(kstTime.getDate() + offsetDays);
    return kstTime.toISOString().split('T')[0];
};

const getFirstDayOfMonthKst = () => {
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + kstOffset);
    kstTime.setDate(1);
    return kstTime.toISOString().split('T')[0];
};

export function DateRangePicker({ onDateChange }: DateRangePickerProps) {
    const [activePreset, setActivePreset] = useState<Preset>('last7');
    const [customRange, setCustomRange] = useState<DateRange>({
        from: getKstDate(-7),
        to: getKstDate(0),
    });

    const handlePresetClick = (preset: Preset) => {
        setActivePreset(preset);
        let range: DateRange;

        switch (preset) {
            case 'today':
                range = { from: getKstDate(0), to: getKstDate(0) };
                break;
            case 'yesterday':
                range = { from: getKstDate(-1), to: getKstDate(-1) };
                break;
            case 'last7':
                range = { from: getKstDate(-7), to: getKstDate(0) };
                break;
            case 'thisMonth':
                range = { from: getFirstDayOfMonthKst(), to: getKstDate(0) };
                break;
            case 'custom':
            default:
                range = customRange;
                break;
        }

        if (preset !== 'custom') {
            setCustomRange(range);
        }
        onDateChange(range, preset);
    };

    const handleCustomDateChange = (type: 'from' | 'to', value: string) => {
        setActivePreset('custom');
        const newRange = { ...customRange, [type]: value };
        setCustomRange(newRange);
        onDateChange(newRange, 'custom');
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Preset Buttons */}
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-md p-1">
                {[
                    { id: 'today', label: '오늘' },
                    { id: 'yesterday', label: '어제' },
                    { id: 'last7', label: '최근 7일' },
                    { id: 'thisMonth', label: '이번 달' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handlePresetClick(item.id as Preset)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${activePreset === item.id
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700"></div>

            {/* Custom Date Inputs */}
            <div className="flex items-center gap-2 px-2 text-sm text-gray-600 dark:text-gray-300">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <input
                    type="date"
                    value={customRange.from}
                    onChange={(e) => handleCustomDateChange('from', e.target.value)}
                    className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-xs sm:text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                    type="date"
                    value={customRange.to}
                    onChange={(e) => handleCustomDateChange('to', e.target.value)}
                    className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-xs sm:text-sm"
                />
            </div>
        </div>
    );
}
