import { NextResponse } from 'next/server'
import { getAuthUser } from '@/app/actions/auth'

//
// [Phase 8] Optimize Campaign Proxy
// Next.js 클라이언트 요청을 받아 로컬 백엔드(FastAPI)의 `/campaigns/{id}/optimize` 로 요청을 라우팅
//

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:10000'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Route handler Promise unwrapping required in next 15+
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params
        const organization_id = user.organization_id

        const response = await fetch(`${BACKEND_URL}/campaigns/${id}/optimize?organization_id=${organization_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            const err = await response.text()
            console.error("Optimization failed:", err)
            return NextResponse.json({ error: 'Failed to optimize campaign' }, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Optimization API route error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
