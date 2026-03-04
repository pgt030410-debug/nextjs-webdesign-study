'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users as UsersIcon } from 'lucide-react';
import { UserTable } from '@/components/domains/users/UserTable';
import { InviteUserModal } from '@/components/domains/users/InviteUserModal';

export default function UsersPage() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Users</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage your team members and their roles.</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity shrink-0"
                    style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
                >
                    Invite User
                </button>
            </div>

            <Card className="dark:bg-gray-900 border-gray-200 dark:border-white/10 overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-gray-200 dark:border-white/10 pb-6">
                    <div
                        className="rounded-full p-3 flex items-center justify-center"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 15%, transparent)', color: 'var(--color-primary-brand, #3b82f6)' }}
                    >
                        <UsersIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="dark:text-white">Team Directory</CardTitle>
                        <CardDescription className="dark:text-gray-400">View and edit all users registered within this organization.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <UserTable />
                </CardContent>
            </Card>

            <InviteUserModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={() => {
                    // Triggered after invite simulation completes
                    console.log('Invite Sent successfully.');
                }}
            />
        </div>
    );
}
