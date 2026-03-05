/**
 * Campaigns Domain: 외부에서 주입받은 캠페인 데이터를 테이블 형태로 렌더링
 */

import React from 'react';
import { Trash2, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/currency';
import { SwipeableCampaignCard } from './SwipeableCampaignCard';
import { useTranslations } from 'next-intl';

export interface Campaign {
  id: number;
  name: string;
  advertiser: string;
  budget: number;
  roas: number;
  status: 'active' | 'paused' | 'ended';
}

interface CampaignTableProps {
  data: Campaign[];
  userRole?: string;
  onDelete?: (id: number) => void;
  onOptimize?: (id: number) => void;
  currencyCode?: string;
  exchangeRate?: number;
}

const CampaignTable: React.FC<CampaignTableProps> = ({ data, userRole = 'viewer', onDelete, onOptimize, currencyCode = 'KRW', exchangeRate = 1 }) => {
  const t = useTranslations('CampaignTable');

  if (data.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-white/20 bg-white dark:bg-gray-900 p-8">
        <p className="text-gray-500 dark:text-gray-400">{t('empty')}</p>
      </div>
    );
  }

  const handleDelete = (id: number, name: string) => {
    if (confirm(t('confirmDelete', { name }))) {
      onDelete?.(id);
    }
  };

  const handleOptimize = (id: number, name: string) => {
    if (confirm(t('confirmOptimize', { name }))) {
      onOptimize?.(id);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: 'tween', ease: 'easeOut', duration: 0.3 } },
  };

  return (
    <div className="w-full">
      {/* Mobile View (Swipeable Cards) */}
      <div className="block sm:hidden w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2"
        >
          {data.map((campaign) => (
            <motion.div key={campaign.id} variants={itemVariants}>
              <SwipeableCampaignCard
                campaign={campaign}
                userRole={userRole}
                onDelete={handleDelete}
                onOptimize={handleOptimize}
                currencyCode={currencyCode}
                exchangeRate={exchangeRate}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden sm:block w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-800/50 font-medium text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4">{t('columns.name')}</th>
              <th className="px-6 py-4">{t('columns.advertiser')}</th>
              <th className="px-6 py-4 text-right">{t('columns.budget')}</th>
              <th className="px-6 py-4 text-center">{t('columns.roas')}</th>
              <th className="px-6 py-4 text-center">{t('columns.status')}</th>
              <th className="px-6 py-4 text-right">{t('columns.actions')}</th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-gray-100 dark:divide-white/5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {data.map((campaign) => (
              <motion.tr
                key={campaign.id}
                variants={itemVariants}
                style={{ willChange: 'transform, opacity' }}
                className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
              >
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{campaign.name}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{campaign.advertiser}</td>
                <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-gray-300">{formatCurrency(campaign.budget, currencyCode, exchangeRate)}</td>
                <td className="px-6 py-4 text-center font-bold" style={{ color: 'var(--color-primary-brand, #3b82f6)' }}>{campaign.roas}x</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${campaign.status === 'active' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                    style={campaign.status === 'active' ? { backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 15%, transparent)', color: 'var(--color-primary-brand, #3b82f6)' } : {}}
                  >
                    {{
                      'active': t('statusMap.active'),
                      'paused': t('statusMap.paused'),
                      'ended': t('statusMap.ended'),
                      'draft': t('statusMap.draft'),
                      'pending_approval': t('statusMap.pending_approval'),
                      'rejected': t('statusMap.rejected')
                    }[campaign.status as string] || campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {userRole !== 'viewer' ? (
                    <div className="flex justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleOptimize(campaign.id, campaign.name)}
                        className="rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        style={{ color: 'var(--color-primary-brand, #3b82f6)' }}
                        aria-label="AI Optimize campaign"
                        title="AI Optimize"
                      >
                        <Bot size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(campaign.id, campaign.name)}
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                        aria-label="Delete campaign"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium px-2">{t('viewOnly')}</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignTable;
