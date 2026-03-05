import React from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
    return (
        <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4" style={{ color: 'var(--color-primary-brand, #3b82f6)' }}>
                <Loader2 size={36} className="animate-spin" />
                <p className="text-sm font-medium animate-pulse opacity-80">데이터를 실시간으로 가져오는 중입니다...</p>
            </div>
        </div>
    );
}
