import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Wallet, 
  Menu
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenMenu: () => void;
  overdueCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMenu,
  overdueCount
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'batches', label: 'Batches', icon: GraduationCap },
    { id: 'finance', label: 'Finance', icon: Wallet, alert: overdueCount > 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 lg:hidden shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as ActiveTab)}
              className={`
                relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all
                ${isActive ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'}
              `}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-brand-600' : 'text-slate-500'}`} />
                {tab.alert && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-brand-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-500 hover:text-slate-800 transition-all"
        >
          <Menu className="w-5 h-5 text-slate-500" />
          <span className="text-[10px] mt-1 font-medium">All Modules</span>
        </button>
      </div>
    </nav>
  );
};
