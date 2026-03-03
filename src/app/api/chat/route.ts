import { NextResponse } from 'next/server'

//
// [Phase 8] Chat API Proxy
// Next.js 클라이언트 요청을 받아 백엔드(FastAPI)의 /chat/ask 엔드포인트로 프록시
//

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:10000'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { message, organization_id = 12 } = body

        const response = await fetch(`${BACKEND_URL}/chat/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                organization_id,
            }),
        })

        if (!response.ok) {
            const errorData = await response.text()
            console.error("Backend Error in Chat:", errorData)
            return NextResponse.json({ error: 'Backend failed resolving chat request.', details: errorData }, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Chat API Proxy Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
