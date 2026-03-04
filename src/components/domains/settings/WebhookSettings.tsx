'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, BellRing, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { getWebhookSettings, saveWebhookSettings } from '@/app/actions/settings';

export default function WebhookSettings() {
    const [slackUrl, setSlackUrl] = useState('');
    const [kakaoKey, setKakaoKey] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getWebhookSettings();
                setSlackUrl(settings.slack_webhook_url || '');
                setKakaoKey(settings.kakao_host_key || '');
            } catch (error) {
                console.error('Failed to load webhook settings', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveWebhookSettings(slackUrl, kakaoKey);
            toast.success('알림 연동 설정이 저장되었습니다.');
        } catch (error: any) {
            toast.error(error.message || '설정 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-gray-900 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BellRing size={20} style={{ color: 'var(--color-primary-brand, #3b82f6)' }} />
                    Integration (알림 연동)
                </CardTitle>
                <CardDescription>
                    AI Insight가 감지한 위험 신호나 보고서를 외부 메신저로 받아볼 수 있도록 연동합니다.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Slack Integration */}
                <div className="space-y-3">
                    <label htmlFor="slack-webhook" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <MessageSquare size={16} className="text-gray-500" />
                        Slack Incoming Webhook
                    </label>
                    <div className="flex gap-3">
                        <input
                            id="slack-webhook"
                            placeholder="Slack Webhook URL을 입력하세요"
                            value={slackUrl}
                            onChange={(e) => setSlackUrl(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:ring-blue-500"
                        />
                    </div>
                    <p className="text-xs text-gray-500">슬랙 앱 설정에서 발급받은 Incoming Webhook URL을 입력하세요.</p>
                </div>

                {/* Kakao Integration */}
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <label htmlFor="kakao-key" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex h-4 w-4 items-center justify-center rounded bg-[#FEE500] text-black font-bold text-[10px]">K</div>
                        카카오 알림톡 호스트 키
                    </label>
                    <div className="flex gap-3">
                        <input
                            id="kakao-key"
                            placeholder="비즈메시지 발급 API Key 입력"
                            value={kakaoKey}
                            onChange={(e) => setKakaoKey(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:ring-blue-500"
                        />
                    </div>
                    <p className="text-xs text-gray-500">비즈니스 인증이 완료된 공식 알림톡 딜리버리 API 키가 필요합니다.</p>
                </div>

                <div className="pt-6">
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="inline-block">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 shadow-sm"
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    저장 중...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save size={16} />
                                    설정 저장
                                </span>
                            )}
                        </button>
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
}
