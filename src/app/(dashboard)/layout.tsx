import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

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
            <div className="ml-64 flex flex-1 flex-col">
                {/* Top Header */}
                <Header />

                {/* Main Content Area */}
                <main className="mt-16 min-h-[calc(100vh-4rem)] p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
