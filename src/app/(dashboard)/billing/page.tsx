'use client';

import React, { useState } from 'react';
import { Check, X, Zap, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function BillingPage() {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpgrade = (planName: string) => {
        setIsProcessing(true);
        const loadingToast = toast.loading(`${planName} 결제를 셋업하는 중입니다...`);

        // 모의 결제 딜레이
        setTimeout(() => {
            setIsProcessing(false);
            toast.error('결제 연동이 준비중입니다.', { id: loadingToast });
        }, 1500);
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Billing & Subscriptions</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your workspace plans, billing history, and team usage.</p>
            </div>

            <div
                className="mb-8 rounded-xl border p-6 shadow-sm dark:bg-gray-900/10"
                style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 10%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 30%, transparent)'
                }}
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Current Plan: Starter (Free)</h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-primary-brand, #3b82f6)' }}>
                            You are currently using 2 of 3 available campaigns on this free tier.
                        </p>
                    </div>
                    <button
                        disabled
                        className="rounded-lg px-4 py-2 text-sm font-semibold cursor-not-allowed"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 20%, transparent)',
                            color: 'var(--color-primary-brand, #3b82f6)'
                        }}
                    >
                        Current Plan
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Starter Plan */}
                <motion.div whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Starter</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Perfect for individuals and side projects.</p>
                    <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">₩0</span>
                        <span className="text-gray-500 dark:text-gray-400">/mo</span>
                    </div>
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> 1 User Seat</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> Up to 3 Campaigns</li>
                        <li className="flex items-center gap-2 text-gray-400 dark:text-gray-600"><X size={16} /> AI Budget Optimizer</li>
                        <li className="flex items-center gap-2 text-gray-400 dark:text-gray-600"><X size={16} /> Custom Analytics</li>
                    </ul>
                    <button disabled className="mt-8 w-full rounded-lg bg-gray-100 dark:bg-gray-800 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Current Plan
                    </button>
                </motion.div>

                {/* Pro Plan */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="relative rounded-2xl border-2 bg-white dark:bg-gray-900 p-8 shadow-md"
                    style={{ borderColor: 'var(--color-primary-brand, #3b82f6)' }}
                >
                    <div
                        className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
                    >
                        Most Popular
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Pro <Zap className="text-amber-500" size={18} />
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">For small teams and growing agencies.</p>
                    <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">₩29,000</span>
                        <span className="text-gray-500 dark:text-gray-400">/mo</span>
                    </div>
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> Up to 5 User Seats</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> Unlimited Campaigns</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> AI Budget Optimizer</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> Slack Notifications</li>
                    </ul>
                    <button
                        onClick={() => handleUpgrade('Pro')}
                        disabled={isProcessing}
                        className="mt-8 w-full rounded-lg py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
                        style={{ backgroundColor: 'var(--color-primary-brand, #3b82f6)' }}
                    >
                        Upgrade to Pro
                    </button>
                </motion.div>

                {/* Enterprise Plan */}
                <motion.div whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Enterprise <ShieldCheck className="text-purple-500" size={18} />
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">For large scale operations and custom needs.</p>
                    <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Custom</span>
                    </div>
                    <ul className="mt-8 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> Unlimited User Seats</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> Unlimited Campaigns</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> Dedicated Account Manager</li>
                        <li className="flex items-center gap-2"><Check style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={16} /> SSO & Advanced Security</li>
                    </ul>
                    <button
                        onClick={() => handleUpgrade('Enterprise')}
                        disabled={isProcessing}
                        className="mt-8 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        Contact Sales
                    </button>
                </motion.div>
            </div>

            <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-8 flex items-center gap-4">
                <div
                    className="flex p-3 rounded-full"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 15%, transparent)' }}
                >
                    <CreditCard style={{ color: 'var(--color-primary-brand, #3b82f6)' }} size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Payment Methods</h4>
                    <p
                        className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
                        style={{ color: 'color-mix(in srgb, var(--color-primary-brand, #3b82f6) 80%, black)' }}
                    >Add a primary payment method</p>
                </div>
            </div>
        </div>
    );
}
