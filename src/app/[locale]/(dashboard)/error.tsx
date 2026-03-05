'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Dashboard Error boundaries caught:', error);
    }, [error]);

    return (
        <div className="flex h-[calc(100vh-10rem)] w-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-6">
                <AlertTriangle size={36} className="text-red-500" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">시스템 오류가 발생했습니다</h2>
            <p className="mb-8 max-w-md text-gray-500">
                오류가 발생하여 페이지를 불러올 수 없습니다. 네트워크 연결을 확인하시거나 다시 시도해 주세요.
            </p>
            <button
                onClick={() => reset()}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm"
            >
                <RefreshCcw size={18} />
                다시 로드하기
            </button>
        </div>
    );
}
