'use client';

/**
 * Analytics Domain: 광고 클릭(Click) 및 전환(Conversion) 추이를 시각화하는 선형 차트
 */

import React, { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Campaign } from '../campaigns/CampaignTable';

interface PerformanceData {
  date: string;
  clicks: number;
  conversions: number;
}

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

interface PerformanceChartProps {
  campaigns: Campaign[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ campaigns }) => {
  const { theme } = useTheme();
  const [isReady, setIsReady] = React.useState(false);

  // Recharts's ResponsiveContainer involves heavy DOM resize observations and SVG calculations.
  // We explicitly delay its rendering until after Framer Motion's initial page transitions 
  // and staggers have finished playing to prevent massive thread blocking & stutter.
  React.useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  // Theme-aware colors
  const gridColor = theme === 'dark' ? '#334155' : '#f1f5f9';
  const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8';

  // 실제 DB에 날짜별 히스토리 레코드가 없으므로, 
  // '현재 활성화된 캠페인들의 총 예산'에 비례하여 7일간의 우상향 가상 트렌드를 동적으로 계산합니다.
  // 캠페인을 지우면 차트 전체가 내려가고, 추가하면 위로 솟구치게 되어 실시간 상호작용을 느낄 수 있습니다.
  const chartData = useMemo(() => {
    if (campaigns.length === 0) return [];

    const totalBudget = campaigns.reduce((sum, camp) => sum + camp.budget, 0);
    const avgRoas = campaigns.reduce((sum, camp) => sum + camp.roas, 0) / campaigns.length;

    // 예산 기준 오늘의 추정 클릭/전환
    const todayClicks = Math.floor(totalBudget / 800); // 800원당 1클릭 가정
    const todayConversions = Math.floor(todayClicks * (avgRoas / 100)); // ROAS 기반 전환율 추정

    const data: PerformanceData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;

      // 과거로 갈수록 수치가 10~30%씩 무작위로 작아지게 가공하여 트렌드 라인 형성
      const volatility = 1 - (i * 0.12) + (Math.random() * 0.05 - 0.02);

      data.push({
        date: dateStr,
        clicks: Math.max(0, Math.floor(todayClicks * volatility)),
        conversions: Math.max(0, Math.floor(todayConversions * volatility)),
      });
    }

    return data;
  }, [campaigns]);

  if (!isReady || chartData.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-sm text-gray-400">
        {!isReady ? (
          <div className="flex animate-pulse space-x-2">
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animation-delay-200"></div>
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animation-delay-400"></div>
          </div>
        ) : "차트를 그릴 활성 캠페인 데이터가 없습니다."}
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full overflow-hidden pt-4">
      <ChartContainer
        config={chartConfig}
        className="h-full w-full"
      >
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 5, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="date"
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
            tickFormatter={(value) => value.toLocaleString()}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={axisColor}
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
