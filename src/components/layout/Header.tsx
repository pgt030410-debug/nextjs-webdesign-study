import React from 'react';
import { UserCircle, LogOut } from 'lucide-react';
import { getAuthUser, logout } from '@/app/actions/auth';

const Header = async () => {
  const user = await getAuthUser();

  return (
    <header className="fixed right-0 top-0 z-10 flex h-16 w-[calc(100%-16rem)] items-center justify-between border-b border-gray-200 bg-white px-8">
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Overview</h1>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">{user.email}</span>
            <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">
              Org: {user.organization_id}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </form>
          </div>
        ) : (
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-50">
            <UserCircle size={24} className="text-gray-600" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
