'use client';

/**
 * Analytics Domain: 광고주(매체)별 예산 소진 및 ROAS 비교 차트 (Bar Chart)
 */

import React, { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Campaign } from '../campaigns/CampaignTable';
import { formatKRW } from '@/lib/utils/currency';
import { useTranslations } from 'next-intl';

interface MediaCompareData {
    advertiser: string;
    totalBudget: number;
    avgRoas: number;
}

interface MediaCompareChartProps {
    campaigns: Campaign[];
}

const MediaCompareChart: React.FC<MediaCompareChartProps> = ({ campaigns }) => {
    const { theme } = useTheme();
    const t = useTranslations('Dashboard.mediaChart');
    const [isReady, setIsReady] = React.useState(false);

    const chartConfig = useMemo(() => ({
        totalBudget: {
            label: t('totalBudget'),
            color: 'var(--color-primary-brand, #3b82f6)',
        },
        avgRoas: {
            label: t('avgRoas'),
            color: '#f59e0b',
        },
    }), [t]);

    // Recharts rendering delay to prevent main-thread block during Framer Motion transitions
    React.useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 900);
        return () => clearTimeout(timer);
    }, []);

    const gridColor = theme === 'dark' ? '#334155' : '#f1f5f9';
    const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8';

    const chartData = useMemo(() => {
        if (campaigns.length === 0) return [];

        // Group campaigns by advertiser
        const grouped = campaigns.reduce((acc, current) => {
            if (!acc[current.advertiser]) {
                acc[current.advertiser] = { budgetSum: 0, roasSum: 0, count: 0 };
            }
            acc[current.advertiser].budgetSum += current.budget;
            acc[current.advertiser].roasSum += current.roas;
            acc[current.advertiser].count += 1;
            return acc;
        }, {} as Record<string, { budgetSum: number; roasSum: number; count: number }>);

        const data: MediaCompareData[] = Object.keys(grouped).map((adv) => ({
            advertiser: adv,
            totalBudget: grouped[adv].budgetSum,
            avgRoas: parseFloat((grouped[adv].roasSum / grouped[adv].count).toFixed(2)),
        }));

        // Sort by budget descending
        return data.sort((a, b) => b.totalBudget - a.totalBudget);
    }, [campaigns]);

    if (chartData.length === 0) {
        return (
            <div className="flex h-[300px] w-full items-center justify-center text-sm text-gray-400">
                {t('empty')}
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full overflow-hidden pt-4">
            <ChartContainer
                config={chartConfig}
                className="h-full w-full"
            >
                <BarChart
                    accessibilityLayer
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis
                        dataKey="advertiser"
                        stroke={axisColor}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke={axisColor}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => formatKRW(value, false)}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={axisColor}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}x`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar
                        yAxisId="left"
                        dataKey="totalBudget"
                        fill="var(--color-primary-brand, #3b82f6)"
                        radius={[4, 4, 0, 0]}
                        name={t('totalBudget')}
                    />
                    <Bar
                        yAxisId="right"
                        dataKey="avgRoas"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        name={t('avgRoas')}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
};

export default MediaCompareChart;
