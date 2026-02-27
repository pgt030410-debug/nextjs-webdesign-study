import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'B2B SaaS Dashboard',
  description: 'Next.js 14 Dashboard Layout',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900`}>
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
      </body>
    </html>
  );
}
