import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, MousePointer2, Target, Activity } from 'lucide-react';
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

import { getAuthUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

async function getCampaigns(orgId: number): Promise<{ data: Campaign[], error: string | null }> {
  try {
    // Cloudflare Edge 환경에서 자신의 API Route(/api/campaigns)를 부를 때 
    // 환경 변수가 누락될 경우를 대비하여 Fallback을 실제 배포된 Render 백엔드 주소로 지정합니다.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://nextjs-webdesign-study.onrender.com';

    // 백엔드 다이렉트 주소 연결 (주의: FastAPI 라우터는 끝에 슬래시(/)가 필요함)
    const res = await fetch(`${apiUrl}/campaigns/?organization_id=${orgId}`, {
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
  const user = await getAuthUser();
  if (!user) {
    redirect('/login');
  }

  const { data: campaigns, error } = await getCampaigns(user.organization_id);

  // 데이터 기반 동적 통계 위젯 계산
  const totalSpend = campaigns.reduce((acc, curr) => acc + curr.budget, 0);

  // 예시 연산: DB에 CTR이나 Conversion이 없으므로 임의로 예산과 ROAS 기반으로 추정값을 전시
  const avgRoas = campaigns.length > 0
    ? campaigns.reduce((acc, curr) => acc + curr.roas, 0) / campaigns.length
    : 0;

  const estimatedConversions = Math.floor(totalSpend / 50000); // 5만원당 1건 전환 가정

  const dynamicStats: SummaryStat[] = [
    {
      title: 'Total Ad Spend',
      value: `₩${totalSpend.toLocaleString()}`,
      subValue: 'Based on active campaigns',
      icon: Wallet,
    },
    {
      title: 'Avg. ROAS',
      value: `${avgRoas.toFixed(2)}x`,
      subValue: 'Average across campaigns',
      icon: MousePointer2,
    },
    {
      title: 'Est. Conversions',
      value: estimatedConversions.toLocaleString(),
      subValue: 'Estimated from ad budget',
      icon: Target,
    },
    {
      title: 'Active Campaigns',
      value: campaigns.length.toLocaleString(),
      subValue: 'Currently running',
      icon: Target, // Or another suitable icon like Activity if available
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Upper Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat) => {
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
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <Card className="border-gray-200 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Performance Trends
              </CardTitle>
              <p className="text-sm text-gray-400">Clicks and conversions over the last 7 days</p>
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

      {/* 3. Bottom Section: Campaign Table (Client Component) */}
      <CampaignList initialCampaigns={campaigns} error={error} />
    </div>
  );
}
