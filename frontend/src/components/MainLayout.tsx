import React from 'react';
import Sidebar, { TabId } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange, title }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-8 py-6 sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
            {title}
          </h2>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;