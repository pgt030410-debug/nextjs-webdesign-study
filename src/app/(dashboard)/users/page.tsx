import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users as UsersIcon } from 'lucide-react';

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Manage your organization's team members and permissions here.
                    </p>
                </div>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
                    Invite User
                </button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b pb-6">
                    <div className="rounded-full bg-blue-100 p-3">
                        <UsersIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle>Team Directory</CardTitle>
                        <CardDescription>View and edit all users registered within this organization.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-16">
                        <UsersIcon className="h-10 w-10 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by inviting a new team member.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
