'use client';

import React, { useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { FileText, Download, Calendar, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
    const { brandName } = useThemeStore();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateReport = (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        // Simulate API call to generate report
        setTimeout(() => {
            setIsGenerating(false);
            toast.success('Report successfully generated and queued for delivery!');
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Custom Reports</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Generate and schedule branded white-label reports for your clients.
                    </p>
                </div>
                <button
                    className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2"
                    style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
                >
                    <Plus size={16} />
                    New Template
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Report Builder Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleGenerateReport} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                        <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                <FileText className="text-gray-400 dark:text-gray-500" size={20} />
                                Report Builder
                            </h2>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="reportName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Report Title</label>
                                <input
                                    id="reportName"
                                    type="text"
                                    required
                                    defaultValue={`Monthly Performance - ${brandName}`}
                                    className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Metrics to Include</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {['Total Spend', 'Impressions', 'Clicks', 'Conversions', 'ROAS', 'Cost Per Click (CPC)'].map((metric) => (
                                        <label key={metric} className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{metric}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
                                    <select className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600">
                                        <option>Last 30 Days</option>
                                        <option>This Month</option>
                                        <option>Last Quarter</option>
                                        <option>Year to Date</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Method</label>
                                    <select className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600">
                                        <option>Email & PDF Attachment</option>
                                        <option>Dashboard Link Only</option>
                                        <option>Download PDF</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="recipient" className="text-sm font-medium text-gray-700 dark:text-gray-300">Recipient Email</label>
                                <input
                                    id="recipient"
                                    type="email"
                                    placeholder="client@clientcompany.com"
                                    className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4 flex justify-end gap-3">
                            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                                Preview
                            </button>
                            <button
                                type="submit"
                                disabled={isGenerating}
                                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                                style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Generating...
                                    </span>
                                ) : (
                                    <>
                                        <Download size={16} />
                                        Generate & Send
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview / Assets Box */}
                <div className="space-y-6">
                    {/* Branding Preview */}
                    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                        <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">White-label Preview</h3>
                        </div>
                        <div className="p-6">
                            <div className={`aspect-[4/3] rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-6 text-center shadow-inner`}>
                                <div
                                    className="h-12 w-12 rounded-lg mb-4 shadow-lg flex items-center justify-center text-white"
                                    style={{ background: 'linear-gradient(to bottom right, color-mix(in srgb, var(--color-primary-brand) 70%, white), var(--color-primary-brand, #3b82f6))' }}
                                >
                                    <FileText size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{brandName}</h4>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Marketing Intelligence Report</p>

                                <div className="mt-6 w-full space-y-2">
                                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
                                    <div className="h-2 w-3/4 rounded-full bg-gray-200 dark:bg-gray-800" />
                                    <div
                                        className="h-2 w-1/2 rounded-full"
                                        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 50%, transparent)' }}
                                    />
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                                Reports will be generated with your custom logo and primary color scheme.
                            </p>
                        </div>
                    </div>

                    {/* Scheduled Reports */}
                    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                        <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                Scheduled Reports
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {[
                                { title: 'Weekly Executive Summary', schedule: 'Every Monday 09:00', status: 'Active' },
                                { title: 'Client Cohort Roas', schedule: '1st of Month', status: 'Active' }
                            ].map((job, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{job.schedule}</p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20">
                                        {job.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
