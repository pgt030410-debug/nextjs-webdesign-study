'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function InviteUserModal({ isOpen, onClose, onSuccess }: InviteUserModalProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Viewer');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('이메일을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success(`${email} 주소로 초대 메일이 발송되었습니다.`);
            setEmail('');
            setRole('Viewer');
            onSuccess();
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0 backdrop-blur-sm">
            <div
                className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">팀원 초대</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        이메일 주소와 역할을 설정하여 조직에 새로운 팀원을 초대합니다.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                이메일 주소 <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="colleague@company.com"
                                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                역할 (Role) <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Admin">Admin (최고 관리자)</option>
                                <option value="Editor">Editor (캠페인 편집자)</option>
                                <option value="Viewer">Viewer (읽기 전용)</option>
                            </select>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        전송 중...
                                    </>
                                ) : (
                                    '초대 메일 발송'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
