'use client';

/**
 * Insights Domain: AI 기반 마케팅 데이터 분석 결과 및 최적화 제안
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowUpRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Insight {
  id: string;
  title: string;
  content: string;
  type: 'positive' | 'warning' | 'info';
}

const InsightCard: React.FC = () => {
  const t = useTranslations('Dashboard.insights');

  const mockInsights: Insight[] = [
    {
      id: '1',
      title: t('mock1Title'),
      content: t('mock1Desc'),
      type: 'positive',
    },
    {
      id: '2',
      title: t('mock2Title'),
      content: t('mock2Desc'),
      type: 'warning',
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={18} style={{ color: 'var(--color-primary-brand, #3b82f6)' }} />
        <h3 className="font-bold text-gray-900 dark:text-white">{t('title')}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {mockInsights.map((insight) => (
          <motion.div key={insight.id} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
            <Card className="border-gray-200 dark:border-white/10 shadow-none bg-white dark:bg-gray-900 h-full">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold flex items-center justify-between dark:text-gray-200">
                  {insight.title}
                  {insight.type === 'positive' ? (
                    <ArrowUpRight size={16} style={{ color: 'var(--color-primary-brand, #3b82f6)' }} />
                  ) : (
                    <AlertCircle size={16} className="text-gray-400 dark:text-gray-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {insight.content}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InsightCard;
