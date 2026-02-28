'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PerformanceChart from '@/components/domains/analytics/PerformanceChart';
import MediaCompareChart from '@/components/domains/analytics/MediaCompareChart';
import InsightCard from '@/components/domains/insights/InsightCard';
import { DateRangePicker, DateRange, Preset } from '@/components/ui/date-range-picker';
import CampaignList from '@/components/domains/campaigns/CampaignList';
import { Campaign } from '@/components/domains/campaigns/CampaignTable';

import { Wallet, MousePointer2, Target, Activity } from 'lucide-react';

interface SummaryStat {
    title: string;
    value: string;
    subValue: string;
    iconName: string; // Changed to string to allow passing from Server Component
}

const iconMap: Record<string, React.ElementType> = {
    Wallet,
    MousePointer2,
    Target,
    Activity
};

export default function DashboardContent({
    campaigns,
    error,
    dynamicStats
}: {
    campaigns: Campaign[],
    error: string | null,
    dynamicStats: SummaryStat[]
}) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div
            className={`flex flex-col gap-8 transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* 0. Top Controls: Date Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Overview</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your ad campaigns and metrics</p>
                </div>
                <DateRangePicker onDateChange={(range, preset) => {
                    console.log('Filtered by date:', range, preset);
                    // In a real app we would refetch or filter campaigns array here
                }} />
            </div>

            {/* 1. Upper Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dynamicStats.map((stat) => {
                    const Icon = iconMap[stat.iconName] || Activity;
                    return (
                        <div key={stat.title}>
                            <Card className="border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-gray-900">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon size={18} className="text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">{stat.subValue}</p>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {/* 2. Middle Section: Analytics (7) & Insights (3) */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-10">
                <div className="lg:col-span-7">
                    <Card className="border-gray-200 dark:border-white/10 shadow-sm h-full bg-white dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Performance Trends
                            </CardTitle>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Clicks and conversions over the last 7 days</p>
                        </CardHeader>
                        <CardContent>
                            <PerformanceChart campaigns={campaigns} />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <InsightCard />
                </div>
            </div>

            {/* 3. Lower Analytics: Media Comparison (Bar Chart) */}
            <div>
                <Card className="border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Media Performance
                        </CardTitle>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Budget vs ROAS by Advertiser</p>
                    </CardHeader>
                    <CardContent>
                        <MediaCompareChart campaigns={campaigns} />
                    </CardContent>
                </Card>
            </div>

            {/* 4. Bottom Section: Campaign Table (Client Component) */}
            <div>
                <CampaignList initialCampaigns={campaigns} error={error} />
            </div>
        </div>
    );
}
