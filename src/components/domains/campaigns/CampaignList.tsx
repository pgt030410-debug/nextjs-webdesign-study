'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, AlertCircle, Plus } from 'lucide-react';
import CampaignModal from './CampaignModal';
import CampaignTable, { type Campaign } from './CampaignTable';
import { CampaignKanban } from './CampaignKanban';
import { deleteCampaign, optimizeCampaign } from '@/app/actions/campaigns';
import { getAuthUser } from '@/app/actions/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CampaignList({
    initialCampaigns,
    error,
    currencyCode = 'KRW',
    exchangeRate = 1
}: {
    initialCampaigns: Campaign[];
    error: string | null;
    currencyCode?: string;
    exchangeRate?: number;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>(initialCampaigns);
    const [userRole, setUserRole] = useState<string>('viewer');
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
    const router = useRouter();
    const t = useTranslations('CampaignList');

    useEffect(() => {
        getAuthUser().then(user => {
            if (user && user.role) {
                setUserRole(user.role);
            }
        });
    }, []);

    const handleSuccess = () => {
        // Refresh the server component data
        router.refresh();
    };

    const handleDeleteCampaign = async (id: number) => {
        try {
            await deleteCampaign(id);
            toast.success(t('deleteSuccess'));
        } catch (err) {
            toast.error(err instanceof Error ? err.message : t('deleteError'));
        }
    };

    const handleOptimizeCampaign = async (id: number) => {
        const loadingToast = toast.loading(t('optimizeLoading'));
        try {
            await optimizeCampaign(id);
            toast.success(t('optimizeSuccess'), { id: loadingToast });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : t('optimizeError'), { id: loadingToast });
        }
    };

    const handleDownloadCSV = () => {
        if (!initialCampaigns || initialCampaigns.length === 0) {
            toast.error(t('noDataDownload'));
            return;
        }

        const headers = ['ID', '캠페인명', '광고주', '예산(KRW)', 'ROAS', '상태'];
        const csvRows = [headers.join(',')];

        initialCampaigns.forEach((campaign) => {
            const row = [
                campaign.id,
                `"${campaign.name.replace(/"/g, '""')}"`, // Handle commas in names
                `"${campaign.advertiser.replace(/"/g, '""')}"`,
                campaign.budget,
                campaign.roas,
                campaign.status
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        // Add UTF-8 BOM for Excel compatibility with Korean characters
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Campaign_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success(t('downloadStart'));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
                <div className="flex items-center gap-3">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg flex text-sm">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                        >
                            {t('listView')}
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`px-3 py-1.5 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                        >
                            {t('boardView')}
                        </button>
                    </div>
                    <button
                        onClick={handleDownloadCSV}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title={t('downloadCsv')}
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">{t('downloadCsv')}</span>
                    </button>
                    {userRole !== 'viewer' && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
                            style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
                        >
                            <Plus size={16} />
                            {t('addCampaign')}
                        </motion.button>
                    )}
                </div>
            </div>

            {error ? (
                <div className="flex min-h-[200px] items-center gap-2 justify-center rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-6 text-red-600 dark:text-red-400">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            ) : viewMode === 'table' ? (
                <CampaignTable
                    data={initialCampaigns}
                    userRole={userRole}
                    onDelete={handleDeleteCampaign}
                    onOptimize={handleOptimizeCampaign}
                    currencyCode={currencyCode}
                    exchangeRate={exchangeRate}
                />
            ) : (
                <CampaignKanban
                    initialCampaigns={initialCampaigns}
                    currencyCode={currencyCode}
                    exchangeRate={exchangeRate}
                />
            )}

            <CampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
