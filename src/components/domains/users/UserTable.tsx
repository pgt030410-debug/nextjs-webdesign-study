'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { fetchUsers } from '@/app/actions/users';
import { useTranslations } from 'next-intl';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Pending';
    lastActive: string;
}

export function UserTable() {
    const t = useTranslations('Users.table');
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            const data = await fetchUsers();
            const mappedUsers = data.map((u: { id: number, email: string, role: string, organization_id: number, subscription_tier?: string }) => ({
                id: u.id.toString(),
                name: u.email.split('@')[0],
                email: u.email,
                role: u.role === 'admin' ? t('admin') : u.role === 'editor' ? t('editor') : t('viewer'),
                status: t('active'),
                lastActive: t('recently')
            }));
            setUsers(mappedUsers);
            setIsLoading(false);
        };
        loadUsers();
    }, [t]);

    const getRoleBadgeColor = (role: string) => {
        if (role === t('admin')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
        if (role === t('editor')) return '';
        if (role === t('viewer')) return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        return 'bg-gray-100 text-gray-700';
    };

    const getStatusDot = (status: string) => {
        return status === t('active') ? 'bg-green-500' : 'bg-yellow-500';
    };

    const handleDeleteUser = (id: string, name: string) => {
        if (confirm(t('confirmRemove', { name }))) {
            setUsers(users.filter(u => u.id !== id));
            toast.success(t('removeSuccess', { name }));
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">{t('loading')}</div>;
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="px-4 py-3 font-medium">{t('member')}</th>
                        <th className="px-4 py-3 font-medium">{t('role')}</th>
                        <th className="px-4 py-3 font-medium">{t('status')}</th>
                        <th className="px-4 py-3 font-medium">{t('lastActive')}</th>
                        <th className="px-4 py-3 font-medium text-right">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-8 w-8 rounded-full flex items-center justify-center font-bold"
                                        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 15%, transparent)', color: 'var(--color-primary-brand, #3b82f6)' }}
                                    >
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                                    style={user.role === t('editor') ? { backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 15%, transparent)', color: 'var(--color-primary-brand, #3b82f6)' } : {}}
                                >
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    <div className={`h-2 w-2 rounded-full ${getStatusDot(user.status)}`}></div>
                                    <span className="text-gray-600 dark:text-gray-300">{user.status}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                {user.lastActive}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button
                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    aria-label="Remove User"
                                >
                                    <span className="text-xs border border-gray-200 dark:border-gray-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800">
                                        {t('remove')}
                                    </span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                                {t('empty')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
