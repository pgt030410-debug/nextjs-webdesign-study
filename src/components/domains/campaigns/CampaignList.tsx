'use client';

import React, { useState } from 'react';
import { AlertCircle, Plus } from 'lucide-react';
import CampaignTable, { Campaign } from './CampaignTable';
import CampaignModal from './CampaignModal';
import { useRouter } from 'next/navigation';
import { deleteCampaign } from '@/app/actions/campaigns';

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
        } catch (err) {
            alert(err instanceof Error ? err.message : '삭제 실패');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Active Campaigns</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                    <Plus size={16} />
                    캠페인 추가
                </button>
            </div>

            {error ? (
                <div className="flex min-h-[200px] items-gap-2 justify-center rounded-xl border border-red-100 bg-red-50 p-6 text-red-600">
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
