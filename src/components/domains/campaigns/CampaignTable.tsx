/**
 * Campaigns Domain: 외부에서 주입받은 캠페인 데이터를 테이블 형태로 렌더링
 */

import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { formatKRW } from '@/lib/utils/currency';

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
  onDelete?: (id: number) => void;
}

const CampaignTable: React.FC<CampaignTableProps> = ({ data, onDelete }) => {
  if (data.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-white/20 bg-white dark:bg-gray-900 p-8">
        <p className="text-gray-500 dark:text-gray-400">등록된 캠페인이 없습니다.</p>
      </div>
    );
  }

  const handleDelete = (id: number, name: string) => {
    if (confirm(`'${name}' 캠페인을 삭제하시겠습니까?`)) {
      onDelete?.(id);
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
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm">
      <table className="w-full min-w-[600px] border-collapse text-left text-sm text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-50 dark:bg-gray-800/50 font-medium text-gray-500 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4">Campaign Name</th>
            <th className="px-6 py-4">Advertiser</th>
            <th className="px-6 py-4 text-right">Budget (KRW)</th>
            <th className="px-6 py-4 text-center">ROAS</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
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
              <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-gray-300">{formatKRW(campaign.budget)}</td>
              <td className="px-6 py-4 text-center font-bold text-blue-600 dark:text-blue-400">{campaign.roas}x</td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${campaign.status === 'active' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(campaign.id, campaign.name)}
                  className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                  aria-label="Delete campaign"
                >
                  <Trash2 size={16} />
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};

export default CampaignTable;
