import React from 'react';
import { Campaign } from '@/components/domains/campaigns/CampaignTable';
import DashboardContent from '@/components/domains/dashboard/DashboardContent';

export interface SummaryStat {
  title: string;
  value: string;
  subValue: string;
  iconName: string;
}

import { redirect } from 'next/navigation';
import { formatCurrency } from '@/lib/utils/currency';
import { getTranslations } from 'next-intl/server';
import { getAuthUser, getAuthToken, logout } from '@/app/actions/auth';
import { getExchangeRate } from '@/app/actions/exchange';
import { cookies } from 'next/headers';

async function getCampaigns(orgId: number): Promise<{ data: Campaign[], error: string | null, unauthorized?: boolean }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://nextjs-webdesign-study.onrender.com';
    const token = await getAuthToken();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${apiUrl}/campaigns/?organization_id=${orgId}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 401) return { data: [], error: 'Unauthorized', unauthorized: true };
      throw new Error(`Failed to fetch backend: ${res.status}`);
    }
    const data = await res.json();
    return { data, error: null };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('getCampaigns timed out waiting for backend wake-up');
      return { data: [], error: '백엔드 서버 웜업 대기 중 시간 초과 발생 (약 50초 소요 가능). 잠시 후 새로고침 해주세요.' };
    }
    console.error('Fetch Campaigns Error:', error);
    return { data: [], error: error instanceof Error ? error.message : '서버 컴포넌트 데이터 로딩 중 에러가 발생했습니다.' };
  }
}

import { getAnalyticsTimeseries } from '@/app/actions/analytics';

async function getAnalyticsData() {
  try {
    const data = await getAnalyticsTimeseries(30);
    return { data, unauthorized: false };
  } catch (error: any) {
    if (error?.message === '401_UNAUTHORIZED') return { data: null, unauthorized: true };
    console.error('Fetch Analytics Error:', error);
    return { data: null, unauthorized: false };
  }
}

export default async function PerformancePlatformPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect('/logout');
  }
  const tDash = await getTranslations('Dashboard');

  const cookieStore = await cookies();
  const currencyCode = cookieStore.get('NEXT_CURRENCY')?.value || 'KRW';
  const exchangeRate = await getExchangeRate(currencyCode);

  const { data: campaigns, error, unauthorized } = await getCampaigns(user.organization_id);
  const { data: timeseriesData, unauthorized: tsUnauthorized } = await getAnalyticsData();

  if (unauthorized || tsUnauthorized) {
    redirect('/logout');
  }

  // 데이터 기반 동적 통계 위젯 계산
  const totalSpend = campaigns.reduce((acc, curr) => acc + curr.budget, 0);

  // 예시 연산: DB에 CTR이나 Conversion이 없으므로 임의로 예산과 ROAS 기반으로 추정값을 전시
  const avgRoas = campaigns.length > 0
    ? campaigns.reduce((acc, curr) => acc + curr.roas, 0) / campaigns.length
    : 0;

  const estimatedConversions = Math.floor(totalSpend / 50000); // 5만원당 1건 전환 가정

  // Calculate End-of-Month projected spend from the last prediction point
  const projectedSpend = timeseriesData && timeseriesData.predictions.spend.length > 0
    ? timeseriesData.predictions.spend[timeseriesData.predictions.spend.length - 1]
    : totalSpend;

  const dynamicStats: SummaryStat[] = [
    {
      title: tDash('totalSpend'),
      value: formatCurrency(totalSpend, currencyCode, exchangeRate),
      subValue: tDash('projectedEom', { amount: formatCurrency(projectedSpend, currencyCode, exchangeRate) }),
      iconName: 'Wallet',
    },
    {
      title: tDash('avgRoas'),
      value: `${avgRoas.toFixed(2)}x`,
      subValue: tDash('avgAcross'),
      iconName: 'MousePointer2',
    },
    {
      title: tDash('estConversions'),
      value: estimatedConversions.toLocaleString(),
      subValue: tDash('estFromBudget'),
      iconName: 'Target',
    },
    {
      title: tDash('activeCampaigns'),
      value: campaigns.length.toLocaleString(),
      subValue: tDash('currentlyRunning'),
      iconName: 'Activity',
    },
  ];

  return <DashboardContent
    campaigns={campaigns}
    error={error}
    dynamicStats={dynamicStats}
    timeseriesData={timeseriesData}
    currencyCode={currencyCode}
    exchangeRate={exchangeRate}
  />;
}
