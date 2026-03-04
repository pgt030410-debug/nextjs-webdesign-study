import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import WebhookSettings from '@/components/domains/settings/WebhookSettings';

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="dark:bg-gray-900 border-gray-200 dark:border-white/10 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-gray-100 dark:border-white/10 pb-6 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                        <SettingsIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                        <CardTitle className="dark:text-white text-lg">General Configurations</CardTitle>
                        <CardDescription className="dark:text-gray-400">Update your workspace details and notification settings.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                            <label htmlFor="workspaceName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Workspace Name</label>
                            <input
                                id="workspaceName"
                                type="text"
                                defaultValue="My Organization"
                                className="flex w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-800 dark:text-white px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-brand dark:focus:ring-primary-brand transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                            <input
                                id="contactEmail"
                                type="email"
                                defaultValue="admin@example.com"
                                className="flex w-full rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-800 dark:text-white px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-brand dark:focus:ring-primary-brand transition-all"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <WebhookSettings />
        </div>
    );
}
