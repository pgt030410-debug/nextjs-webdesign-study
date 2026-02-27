import React from 'react';
import { UserCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed right-0 top-0 z-10 flex h-16 w-[calc(100%-16rem)] items-center justify-between border-b border-gray-200 bg-white px-8">
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Overview</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-50">
          <UserCircle size={24} className="text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
