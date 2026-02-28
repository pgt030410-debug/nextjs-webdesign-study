'use client';

import React, { useState } from 'react';
import { AlertCircle, Plus } from 'lucide-react';
import CampaignTable, { Campaign } from './CampaignTable';
import CampaignModal from './CampaignModal';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { deleteCampaign } from '@/app/actions/campaigns';
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

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Campaigns</h2>
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

            {error ? (
                <div className="flex min-h-[200px] items-gap-2 justify-center rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-6 text-red-600 dark:text-red-400">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            ) : (
                <CampaignTable data={initialCampaigns} onDelete={handleDeleteCampaign} />
            )}

            <CampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
