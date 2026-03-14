import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-gray-900 antialiased">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-300 ease-in-out bg-white border-r border-[#f0f0f0] lg:translate-x-0 lg:static lg:inset-auto 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </aside>

      <div className="flex-grow h-screen overflow-y-auto bg-white flex flex-col">
        {/* Mobile Header Toggle */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0] bg-white sticky top-0 z-30">
          <span className="font-bold text-xl text-gray-900">PharmaManager</span>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -mr-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
