'use client';

import React, { useState, useEffect } from 'react';
import { MoreHorizontal, ShieldAlert, ShieldCheck, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { fetchUsers } from '@/app/actions/users';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Pending';
    lastActive: string;
}

export function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            const data = await fetchUsers();
            const mappedUsers = data.map((u: any) => ({
                id: u.id.toString(),
                name: u.email.split('@')[0],
                email: u.email,
                role: u.role === 'admin' ? 'Admin' : u.role === 'editor' ? 'Editor' : 'Viewer',
                status: 'Active',
                lastActive: 'Recently'
            }));
            setUsers(mappedUsers);
            setIsLoading(false);
        };
        loadUsers();
    }, []);

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'Editor': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Viewer': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusDot = (status: string) => {
        return status === 'Active' ? 'bg-green-500' : 'bg-yellow-500';
    };

    const handleDeleteUser = (id: string, name: string) => {
        if (confirm(`정말 ${name}님을 조직에서 내보내시겠습니까?`)) {
            setUsers(users.filter(u => u.id !== id));
            toast.success(`${name}님이 내보내졌습니다.`);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading users...</div>;
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="px-4 py-3 font-medium">Member</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Last Active</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
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
                                        Remove
                                    </span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                                조직에 등록된 멤버가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
