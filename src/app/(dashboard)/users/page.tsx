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
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Manage your organization's team members and permissions here.
                    </p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors shrink-0"
                >
                    Invite User
                </button>
            </div>

            <Card className="dark:bg-gray-900 border-gray-200 dark:border-white/10 overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-gray-200 dark:border-white/10 pb-6">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                        <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
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
