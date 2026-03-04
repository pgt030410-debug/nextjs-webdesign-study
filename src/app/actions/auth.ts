'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const TOKEN_NAME = 'auth_token';

// JWT 구조 디코딩 (간단한 파싱)
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();

    // 보통 JWT 만료 시간에 맞추지만, 브라우저 세션이나 여유롭게 설정
    cookieStore.set(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_NAME)?.value || null;
}

export async function getAuthUser() {
    const token = await getAuthToken();
    if (!token) return null;

    const payload = parseJwt(token);
    if (!payload || !payload.sub || !payload.org_id) return null;

    return {
        email: payload.sub,
        organization_id: payload.org_id,
        role: payload.role || 'viewer',
    };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_NAME);
    redirect('/login');
}
