import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// FastAPI router prefix가 /campaigns이고 @router.post("/") 이므로 /campaigns/ 가 정확한 엔드포인트입니다.
const BACKEND_URL = 'https://nextjs-webdesign-study.onrender.com/campaigns/';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organization_id');

  if (!organizationId) {
    return NextResponse.json({ error: 'organization_id is required' }, { status: 400 });
  }

  try {
    const backendUrl = `${BACKEND_URL}?organization_id=${organizationId}`;
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
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organization_id') || '12';

  try {
    const body = await request.json();
    const backendUrl = `${BACKEND_URL}?organization_id=${organizationId}`;
    
    console.log(`Forwarding POST to: ${backendUrl}`);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
