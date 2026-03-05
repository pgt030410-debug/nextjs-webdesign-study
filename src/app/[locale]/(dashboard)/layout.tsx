import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { MarketingChatbot } from '@/components/chat/MarketingChatbot';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Right Area */}
            <div className="flex flex-1 flex-col md:ml-64 w-full">
                {/* Top Header */}
                <Header />

                {/* Main Content Area */}
                <main className="mt-16 min-h-[calc(100vh-4rem)] p-4 md:p-8 overflow-hidden relative">
                    {children}
                </main>
            </div>
            {/* Global Floating Chatbot for Dashboard */}
            <MarketingChatbot />
        </div>
    );
}
