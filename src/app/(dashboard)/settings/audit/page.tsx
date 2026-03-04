'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getAuthUser } from '@/app/actions/auth';

interface AuditLog {
    id: number;
    organization_id: number;
    user_id: string; // Or Int depending on schema
    action: string;
    resource: string;
    ip_address: string | null;
    created_at: string;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const user = await getAuthUser();
                if (!user) return;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543'}/audit/logs?organization_id=${user.organization_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                }
            } catch (error) {
                console.error("Failed to fetch audit logs", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'CREATE':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">CREATE</span>;
            case 'DELETE':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">DELETE</span>;
            case 'UPDATE':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">UPDATE</span>;
            default:
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">{action}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-medium">Immutable Audit Logs</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        A persistent, tamper-evident record of all major system events in your organization.
                    </p>
                </div>
            </div>

            <Card className="border-gray-200 dark:border-white/10 shadow-sm overflow-hidden bg-white dark:bg-gray-900">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                            placeholder="Search resource or action..."
                            className="pl-9 h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>
                    <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto justify-center">
                        <Filter className="w-4 h-4" />
                        Filter Log
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                            <p>No audit logs found for this organization.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actor ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource / Context</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-white/5">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-mono">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            User #{log.user_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 max-w-[300px] truncate" title={log.resource}>
                                            {log.resource}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                                            {log.ip_address || '127.0.0.1'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
}
