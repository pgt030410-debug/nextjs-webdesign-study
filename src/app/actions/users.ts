'use server';

import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchUsers() {
    const token = await getAuthToken();
    if (!token) return [];

    try {
        const res = await fetch(`${API_URL}/users/`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error('Failed to fetch users:', await res.text());
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}
