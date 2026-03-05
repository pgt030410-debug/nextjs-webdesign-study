'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
    const t = useTranslations('Auth.registerForm');
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgId, setOrgId] = useState('12');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://nextjs-webdesign-study.onrender.com';

            const res = await fetch(`${apiUrl}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    organization_id: parseInt(orgId, 10),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || t('error'));
            }

            // Automatically redirect to login page
            router.push('/login');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(t('error'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-t-green-600">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">{t('title')}</CardTitle>
                    <CardDescription className="text-center text-gray-500 dark:text-gray-400">
                        {t('subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="orgId">{t('orgId')}</label>
                            <input
                                id="orgId"
                                type="number"
                                required
                                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                placeholder="12"
                                value={orgId}
                                onChange={(e) => setOrgId(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('orgHelp')}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">{t('email')}</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">{t('password')}</label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-green-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50 transition-all"
                        >
                            {loading ? t('submitting') : t('submitBtn')}
                        </button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t p-4">
                    <p className="text-sm text-gray-600">
                        {t('hasAccount')}{' '}
                        <Link href="/login" className="font-semibold text-green-600 hover:text-green-500 hover:underline transition-all">
                            {t('loginLink')}
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
