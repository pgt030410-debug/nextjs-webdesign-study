'use server';

import { revalidatePath } from 'next/cache';
import { getAuthUser } from './auth';

const BACKEND_URL = 'https://nextjs-webdesign-study.onrender.com/campaigns/';

export async function createCampaign(formData: FormData) {
    const user = await getAuthUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const payload = {
        name: formData.get('name') as string,
        advertiser: formData.get('advertiser') as string,
        budget: parseFloat(formData.get('budget') as string),
        roas: parseFloat(formData.get('roas') as string),
        status: 'active',
        organization_id: user.organization_id,
    };

    const response = await fetch(`${BACKEND_URL}?organization_id=${user.organization_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create campaign: ${errorText}`);
    }

    // Next.js 캐시 무효화 -> 즉시 서버 컴포넌트 데이터 리페치
    revalidatePath('/');
    return { success: true };
}

export async function deleteCampaign(id: number) {
    const user = await getAuthUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(`${BACKEND_URL}${id}?organization_id=${user.organization_id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete campaign: ${errorText}`);
    }

    // 삭제 후 대시보드 새로고침
    revalidatePath('/');
    return { success: true };
}

export async function optimizeCampaign(id: number) {
    const user = await getAuthUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || BACKEND_URL.replace(/\/$/, "");

    const response = await fetch(`${API_BASE}/${id}/optimize?organization_id=${user.organization_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to optimize campaign: ${errorText}`);
    }

    revalidatePath('/');
    return { success: true };
}
