'use server';

import { getAuthUser, getAuthToken } from './auth';

const BACKEND_URL = 'https://nextjs-webdesign-study.onrender.com/settings/webhooks';

export async function getWebhookSettings() {
    const user = await getAuthUser();
    const token = await getAuthToken();
    if (!user || !token) {
        return { slack_webhook_url: '', kakao_host_key: '' };
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/settings` : BACKEND_URL.replace(/\/webhooks$/, "");

    try {
        const response = await fetch(`${API_BASE}/webhooks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return { slack_webhook_url: '', kakao_host_key: '' };
        }

        const data = await response.json();
        return {
            slack_webhook_url: data.slack_webhook_url || '',
            kakao_host_key: data.kakao_host_key || ''
        };
    } catch {
        return { slack_webhook_url: '', kakao_host_key: '' };
    }
}

export async function saveWebhookSettings(slackUrl: string, kakaoKey: string) {
    const user = await getAuthUser();
    const token = await getAuthToken();
    if (!user || !token) {
        throw new Error('Unauthorized');
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/settings` : BACKEND_URL.replace(/\/webhooks$/, "");

    const payload = {
        slack_webhook_url: slackUrl,
        kakao_host_key: kakaoKey
    };

    const response = await fetch(`${API_BASE}/webhooks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        let errorMessage = `Failed to save webhook settings: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) errorMessage = errorData.detail;
        } catch {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
        }
        throw new Error(errorMessage);
    }

    return { success: true };
}
