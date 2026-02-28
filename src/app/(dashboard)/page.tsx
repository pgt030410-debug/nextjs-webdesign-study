import React from 'react';
import { Campaign } from '@/components/domains/campaigns/CampaignTable';
import DashboardContent from '@/components/domains/dashboard/DashboardContent';

export interface SummaryStat {
  title: string;
  value: string;
  subValue: string;
  iconName: string;
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
      iconName: 'Wallet',
    },
    {
      title: 'Avg. ROAS',
      value: `${avgRoas.toFixed(2)}x`,
      subValue: 'Average across campaigns',
      iconName: 'MousePointer2',
    },
    {
      title: 'Est. Conversions',
      value: estimatedConversions.toLocaleString(),
      subValue: 'Estimated from ad budget',
      iconName: 'Target',
    },
    {
      title: 'Active Campaigns',
      value: campaigns.length.toLocaleString(),
      subValue: 'Currently running',
      iconName: 'Activity',
    },
  ];

  return <DashboardContent campaigns={campaigns} error={error} dynamicStats={dynamicStats} />;
}
