export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, MousePointer2, Target } from 'lucide-react';
import PerformanceChart from '@/components/domains/analytics/PerformanceChart';
import InsightCard from '@/components/domains/insights/InsightCard';
import CampaignList from '@/components/domains/campaigns/CampaignList';
import { Campaign } from '@/components/domains/campaigns/CampaignTable';

interface SummaryStat {
  title: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
}

const summaryStats: SummaryStat[] = [
  {
    title: 'Total Ad Spend',
    value: '₩28,500,000',
    subValue: '+12.5% from last month',
    icon: Wallet,
  },
  {
    title: 'Avg. CTR',
    value: '3.42%',
    subValue: '+0.8% from last month',
    icon: MousePointer2,
  },
  {
    title: 'Total Conversions',
    value: '1,284',
    subValue: '+24.1% from last month',
    icon: Target,
  },
];

async function getCampaigns(): Promise<{ data: Campaign[], error: string | null }> {
  try {
    // Cloudflare Edge 환경에서 자신의 API Route(/api/campaigns)를 부를 때 
    // 절대경로 문제나 봇 인증(403) 문제가 발생할 수 있습니다.
    // 서버 컴포넌트(SSR) 단계이므로 프록시를 안 거치고 백엔드(Render)로 다이렉트 호출합니다.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    // 백엔드 다이렉트 주소 연결 (주의: FastAPI 라우터는 끝에 슬래시(/)가 필요함)
    const res = await fetch(`${apiUrl}/campaigns/?organization_id=12`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch backend: ${res.status}`);
    }
    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    console.error('Fetch Campaigns Error:', error);
    return { data: [], error: error instanceof Error ? error.message : '서버 컴포넌트 데이터 로딩 중 에러가 발생했습니다.' };
  }
}

export default async function PerformancePlatformPage() {
  const { data: campaigns, error } = await getCampaigns();

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Upper Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-tight">
                  {stat.title}
                </CardTitle>
                <Icon size={18} className="text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-blue-600 font-medium mt-1">{stat.subValue}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 2. Middle Section: Analytics (7) & Insights (3) */}
      <div className="grid gap-8 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <Card className="border-gray-200 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Performance Trends
              </CardTitle>
              <p className="text-sm text-gray-400">Clicks and conversions over the last 7 days</p>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <InsightCard />
        </div>
      </div>

      {/* 3. Bottom Section: Campaign Table (Client Component) */}
      <CampaignList initialCampaigns={campaigns} error={error} />
    </div>
  );
}
