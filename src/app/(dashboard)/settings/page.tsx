import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Configure your organization preferences and billing details.
                    </p>
                </div>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors shrink-0">
                    Save Changes
                </button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b pb-6">
                    <div className="rounded-full bg-gray-100 p-3">
                        <SettingsIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <CardTitle>General Configurations</CardTitle>
                        <CardDescription>Update your workspace details and notification settings.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4 max-w-lg">
                        <div className="space-y-2">
                            <label htmlFor="workspaceName" className="text-sm font-medium text-gray-700">Workspace Name</label>
                            <input
                                id="workspaceName"
                                type="text"
                                defaultValue="My Organization"
                                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">Contact Email</label>
                            <input
                                id="contactEmail"
                                type="email"
                                defaultValue="admin@example.com"
                                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
