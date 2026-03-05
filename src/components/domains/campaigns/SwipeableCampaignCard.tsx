import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Trash2, Bot } from 'lucide-react';
import type { Campaign } from './CampaignTable';
import { formatCurrency } from '@/lib/utils/currency';

interface SwipeableCampaignCardProps {
    campaign: Campaign;
    userRole?: string;
    onDelete?: (id: number, name: string) => void;
    onOptimize?: (id: number, name: string) => void;
    currencyCode?: string;
    exchangeRate?: number;
}

const SWIPE_THRESHOLD = -80; // Distance to reveal actions

export const SwipeableCampaignCard: React.FC<SwipeableCampaignCardProps> = ({
    campaign,
    userRole = 'viewer',
    onDelete,
    onOptimize,
    currencyCode = 'KRW',
    exchangeRate = 1,
}) => {
    const x = useMotionValue(0);
    const [isRevealed, setIsRevealed] = useState(false);

    // Styling for the delete/optimize actions behind the card
    const buttonWidth = userRole === 'viewer' ? 0 : 120; // 60px per button * 2

    const handleDragEnd = (e: any, info: { offset: { x: number } }) => {
        if (userRole === 'viewer') return;

        if (info.offset.x < SWIPE_THRESHOLD) {
            setIsRevealed(true);
        } else {
            setIsRevealed(false);
        }
    };

    const handleOptimizeClick = () => {
        setIsRevealed(false);
        onOptimize?.(campaign.id, campaign.name);
    };

    const handleDeleteClick = () => {
        setIsRevealed(false);
        onDelete?.(campaign.id, campaign.name);
    };

    return (
        <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-white/10 w-full mb-3 shadow-sm">
            {/* Background Actions Layer (Behind the card) */}
            {userRole !== 'viewer' && (
                <div className="absolute inset-y-0 right-0 flex items-center justify-end px-4 gap-4 z-0 bg-red-50/50 dark:bg-red-900/10">
                    <button
                        onClick={handleOptimizeClick}
                        className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        aria-label="Optimize"
                    >
                        <Bot size={18} />
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        aria-label="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}

            {/* Foreground Draggable Card */}
            <motion.div
                drag={userRole !== 'viewer' ? 'x' : false}
                dragConstraints={{ left: -buttonWidth, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={{ x: isRevealed ? -buttonWidth : 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                className="relative z-10 flex flex-col gap-3 rounded-xl bg-white p-4 dark:bg-gray-900/95"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{campaign.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{campaign.advertiser}</p>
                    </div>
                    <span
                        className={`inline-flex min-w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${campaign.status === 'active'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                    >
                        {{
                            'active': '진행 중',
                            'paused': '일시정지',
                            'ended': '종료',
                            'draft': '기획',
                            'pending_approval': '결재 대기',
                            'rejected': '반려'
                        }[campaign.status as string] || campaign.status}
                    </span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">예산 (Budget)</span>
                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-200">
                            {formatCurrency(campaign.budget, currencyCode, exchangeRate)}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">ROAS</span>
                        <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                            {campaign.roas}x
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
