'use server';

import { revalidatePath } from 'next/cache';
import { getAuthUser, getAuthToken } from './auth';

const getApiBase = () => {
    return process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/campaigns`
        : 'https://nextjs-webdesign-study.onrender.com/campaigns';
};

export async function createCampaign(formData: FormData) {
    const user = await getAuthUser();
    const token = await getAuthToken();
    if (!user || !token) {
        throw new Error('Unauthorized');
    }

    const payload = {
        name: formData.get('name') as string,
        advertiser: formData.get('advertiser') as string,
        budget: parseFloat(formData.get('budget') as string),
        roas: parseFloat(formData.get('roas') as string),
        status: (formData.get('status') as string) || 'draft',
        organization_id: user.organization_id,
    };

    const response = await fetch(`${getApiBase()}?organization_id=${user.organization_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        let errorMessage = `Failed to create campaign: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) errorMessage = errorData.detail;
        } catch {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
    }

    // Next.js 캐시 무효화 -> 즉시 서버 컴포넌트 데이터 리페치
    revalidatePath('/');
    return { success: true };
}

export async function deleteCampaign(id: number) {
    const user = await getAuthUser();
    const token = await getAuthToken();
    if (!user || !token) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(`${getApiBase()}/${id}?organization_id=${user.organization_id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
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
    const token = await getAuthToken();
    if (!user || !token) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(`${getApiBase()}/${id}/optimize?organization_id=${user.organization_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to optimize campaign: ${errorText}`);
    }

    revalidatePath('/');
    return { success: true };
}

export async function updateCampaignStatus(id: number, status: string) {
    const user = await getAuthUser();
    const token = await getAuthToken();
    if (!user || !token) throw new Error('Unauthorized');

    const response = await fetch(`${getApiBase()}/${id}/status?organization_id=${user.organization_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status })
    });

    if (!response.ok) {
        let errorMessage = `Failed to update status: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) errorMessage = errorData.detail;
        } catch {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
    }

    revalidatePath('/');
    return { success: true };
}

export async function getCampaignComments(id: number) {
    const user = await getAuthUser();
    const token = await getAuthToken();
    if (!user || !token) return [];

    const response = await fetch(`${getApiBase()}/${id}/comments`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        console.error("Failed to fetch comments");
        return [];
    }

    return response.json();
}

export async function createCampaignComment(id: number, content: string) {
    const user = await getAuthUser();
    const token = await getAuthToken();
    if (!user || !token) throw new Error('Unauthorized');

    const response = await fetch(`${getApiBase()}/${id}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content })
    });

    if (!response.ok) {
        throw new Error("Failed to post comment");
    }

    revalidatePath('/');
    return response.json();
}
