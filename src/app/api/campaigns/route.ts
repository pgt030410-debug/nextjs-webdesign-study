import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/actions/auth';

export const runtime = 'edge';

// FastAPI router prefix가 /campaigns이고 @router.post("/") 이므로 /campaigns/ 가 정확한 엔드포인트입니다.
const BACKEND_URL = 'https://nextjs-webdesign-study.onrender.com/campaigns/';

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const backendUrl = `${BACKEND_URL}?organization_id=${user.organization_id}`;
    const response = await fetch(backendUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error(`Backend GET error (${response.status}):`, errorDetail);
      return NextResponse.json({
        error: 'Backend error',
        status: response.status,
        detail: errorDetail
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch from backend' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // 덮어쓰기 방어를 위해 body 내부의 organization_id를 무시하고 서버의 user.organization_id로 강제 세팅
    const payload = { ...body, organization_id: user.organization_id };
    const backendUrl = `${BACKEND_URL}?organization_id=${user.organization_id}`;

    console.log(`Forwarding POST to: ${backendUrl}`);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend POST error (${response.status}):`, errorText);
      return NextResponse.json({
        error: 'Backend error',
        status: response.status,
        detail: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json({ error: 'Failed to post to backend' }, { status: 500 });
  }
}
