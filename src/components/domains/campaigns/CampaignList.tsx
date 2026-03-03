'use client';

import React, { useState } from 'react';
import { AlertCircle, Plus, Download } from 'lucide-react';
import CampaignTable, { Campaign } from './CampaignTable';
import CampaignModal from './CampaignModal';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { deleteCampaign, optimizeCampaign } from '@/app/actions/campaigns';
import toast from 'react-hot-toast';

interface CampaignListProps {
    initialCampaigns: Campaign[];
    error: string | null;
}

export default function CampaignList({ initialCampaigns, error }: CampaignListProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();

    const handleSuccess = () => {
        // Refresh the server component data
        router.refresh();
    };

    const handleDeleteCampaign = async (id: number) => {
        try {
            await deleteCampaign(id);
            toast.success('캠페인이 성공적으로 삭제되었습니다.');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : '캠페인 삭제에 실패했습니다.');
        }
    };

    const handleOptimizeCampaign = async (id: number) => {
        const loadingToast = toast.loading('AI가 데이터를 분석하여 최적화 중입니다...');
        try {
            await optimizeCampaign(id);
            toast.success('AI 예산 최적화가 완료되었습니다!', { id: loadingToast });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'AI 최적화에 실패했습니다.', { id: loadingToast });
        }
    };

    const handleDownloadCSV = () => {
        if (!initialCampaigns || initialCampaigns.length === 0) {
            toast.error('다운로드할 데이터가 없습니다.');
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

        toast.success('CSV 파일 다운로드가 시작되었습니다.');
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Campaigns</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownloadCSV}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title="CSV 형식으로 다운로드"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">CSV 다운로드</span>
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
                    >
                        <Plus size={16} />
                        캠페인 추가
                    </motion.button>
                </div>
            </div>

            {error ? (
                <div className="flex min-h-[200px] items-center gap-2 justify-center rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-6 text-red-600 dark:text-red-400">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            ) : (
                <CampaignTable data={initialCampaigns} onDelete={handleDeleteCampaign} onOptimize={handleOptimizeCampaign} />
            )}

            <CampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
