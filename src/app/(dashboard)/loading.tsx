import React from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
    return (
        <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-blue-600">
                <Loader2 size={36} className="animate-spin" />
                <p className="text-sm font-medium animate-pulse text-blue-600/80">데이터를 실시간으로 가져오는 중입니다...</p>
            </div>
        </div>
    );
}
