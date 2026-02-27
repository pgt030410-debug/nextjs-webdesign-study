import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/actions/auth';

export const runtime = 'edge';

const BACKEND_URL = 'https://nextjs-webdesign-study.onrender.com/campaigns';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    // FastAPI는 /campaigns/{id}/ 형태를 선호하거나, 리다이렉트를 발생시킬 수 있습니다.
    const backendUrl = `${BACKEND_URL}/${id}/?organization_id=${user.organization_id}`;

    console.log(`Forwarding DELETE to: ${backendUrl}`);

    const response = await fetch(backendUrl, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // 백엔드에서 보내는 에러 상세 내용을 텍스트로 읽어옵니다.
      const errorDetail = await response.text();
      console.error(`Backend DELETE error (${response.status}):`, errorDetail);

      return NextResponse.json({
        error: 'Backend error',
        status: response.status,
        detail: errorDetail
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete from backend' }, { status: 500 });
  }
}
