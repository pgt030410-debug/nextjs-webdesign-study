'use client';

/**
 * Analytics Domain: 광고 클릭(Click) 및 전환(Conversion) 추이를 시각화하는 선형 차트
 */

import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface PerformanceData {
  date: string;
  clicks: number;
  conversions: number;
}

const mockData: PerformanceData[] = [
  { date: '02/18', clicks: 1200, conversions: 45 },
  { date: '02/19', clicks: 1450, conversions: 52 },
  { date: '02/20', clicks: 1100, conversions: 48 },
  { date: '02/21', clicks: 1700, conversions: 72 },
  { date: '02/22', clicks: 1900, conversions: 85 },
  { date: '02/23', clicks: 1600, conversions: 68 },
  { date: '02/24', clicks: 2100, conversions: 92 },
];

const chartConfig = {
  clicks: {
    label: 'Clicks',
    color: '#3b82f6',
  },
  conversions: {
    label: 'Conversions',
    color: '#94a3b8',
  },
};

const PerformanceChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full overflow-hidden pt-4">
      <ChartContainer
        config={chartConfig}
        className="h-full w-full"
      >
        <LineChart
          accessibilityLayer
          data={mockData}
          margin={{ top: 5, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            yAxisId="left"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="clicks"
            stroke="var(--color-clicks)"
            strokeWidth={2}
            dot={{ r: 4, fill: '#3b82f6' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="conversions"
            stroke="var(--color-conversions)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: '#94a3b8' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default PerformanceChart;
