'use client';

import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ReferenceArea
} from 'recharts';

interface PredictiveChartProps {
    data: {
        historical: { dates: string[], spend: number[], conversions: number[] };
        predictions: { dates: string[], spend: number[], conversions: number[] };
        anomalies: any[];
    } | null;
}

export default function PredictiveChart({ data }: PredictiveChartProps) {
    const chartData = useMemo(() => {
        if (!data) return [];

        // Combine historical and predictive data
        const combined = [];
        const hDates = data.historical.dates;

        for (let i = 0; i < hDates.length; i++) {
            combined.push({
                date: hDates[i],
                spend: data.historical.spend[i],
                conversions: data.historical.conversions[i],
                isPrediction: false
            });
        }

        const pDates = data.predictions.dates;
        for (let i = 0; i < pDates.length; i++) {
            combined.push({
                date: pDates[i],
                spendPred: data.predictions.spend[i],
                convPred: data.predictions.conversions[i],
                isPrediction: true
            });
        }

        // To connect the line smoothly
        if (combined.length > hDates.length) {
            combined[hDates.length - 1].spendPred = combined[hDates.length - 1].spend;
            combined[hDates.length - 1].convPred = combined[hDates.length - 1].conversions;
        }

        return combined;
    }, [data]);

    if (!data) {
        return (
            <div className="flex w-full h-[400px] items-center justify-center bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const firstPredictionDate = data.predictions.dates[0];

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary-brand)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-primary-brand)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSpendPred" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={(str) => {
                            const parts = str.split('-');
                            if (parts.length === 3) return `${parts[1]}/${parts[2]}`;
                            return str;
                        }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={(val) => `₩${(val / 1000).toFixed(0)}k`}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#e2e8f0' }}
                    />

                    <Area
                        type="monotone"
                        dataKey="spend"
                        stroke="var(--color-primary-brand)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSpend)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-primary-brand)" }}
                    />

                    {/* Predictive Area (Dashed and Gray) */}
                    <Area
                        type="monotone"
                        dataKey="spendPred"
                        stroke="#94a3b8"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        fillOpacity={1}
                        fill="url(#colorSpendPred)"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />

                    <ReferenceLine x={firstPredictionDate} stroke="#cbd5e1" strokeDasharray="3 3" />

                    {/* Render Anomaly Regions visually */}
                    {data.anomalies.map((anomaly, idx) => (
                        <ReferenceArea
                            key={idx}
                            x1={anomaly.date}
                            x2={anomaly.date}
                            fill="#ef4444"
                            fillOpacity={0.2}
                            strokeOpacity={1}
                        />
                    ))}

                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
