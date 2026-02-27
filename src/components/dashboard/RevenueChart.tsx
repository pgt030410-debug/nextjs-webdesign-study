'use client';

import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

/**
 * 6개월간의 매출 데이터를 시각화하는 B2B 대시보드 전용 막대 그래프 컴포넌트
 */

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

const mockData: MonthlyRevenue[] = [
  { month: 'Jan', revenue: 4500 },
  { month: 'Feb', revenue: 5200 },
  { month: 'Mar', revenue: 4800 },
  { month: 'Apr', revenue: 6100 },
  { month: 'May', revenue: 5900 },
  { month: 'Jun', revenue: 7200 },
];

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--primary))', // shadcn primary (blue)
  },
};

const RevenueChart: React.FC = () => {
  return (
    // 💡 ResponsiveContainer를 제거하고 겉옷(div)과 ChartContainer에 명확한 크기를 줍니다.
    <div className="h-[300px] w-full pt-4">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart accessibilityLayer data={mockData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: '#f9fafb' }}
          />
          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export { RevenueChart };