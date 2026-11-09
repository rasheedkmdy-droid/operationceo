import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck2, 
  Wallet, 
  Briefcase, 
  UserCheck, 
  BookOpenCheck, 
  ServerCog, 
  BarChart3, 
  Sparkles,
  ChevronRight,
  LogOut,
  HelpCircle,
  X
} from 'lucide-react';
import { academyInfo } from '../../data/mockData';

export type ActiveTab = 
  | 'dashboard' 
  | 'students' 
  | 'batches' 
  | 'finance' 
  | 'attendance' 
  | 'academics' 
  | 'placements' 
  | 'hr' 
  | 'operations' 
  | 'reports';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  studentsCount: number;
  batchesCount: number;
  overdueCount: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  count?: number;
  alertCount?: number;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  studentsCount,
  batchesCount,
  overdueCount
}) => {

  const navItems: NavGroup[] = [
    {
      group: "Executive Core",
      items: [
        { id: 'dashboard', label: 'CEO Dashboard', icon: LayoutDashboard, badge: 'Live' },
      ]
    },
    {
      group: "Academy Operations",
      items: [
        { id: 'students', label: 'Student Management', icon: Users, count: studentsCount },
        { id: 'batches', label: 'Batch Management', icon: GraduationCap, count: batchesCount },
        { id: 'attendance', label: 'Attendance Tracking', icon: CalendarCheck2, badge: 'Phase 2' },
        { id: 'academics', label: 'Academic & Syllabus', icon: BookOpenCheck, badge: 'Phase 2' },
      ]
    },
    {
      group: "Financials & HR",
      items: [
        { id: 'finance', label: 'Finance & Fee Collection', icon: Wallet, alertCount: overdueCount },
        { id: 'hr', label: 'HR & Payroll', icon: UserCheck, badge: 'Phase 3' },
      ]
    },
    {
      group: "Career & Center",
      items: [
        { id: 'placements', label: 'Placement Cell', icon: Briefcase, badge: '92% Placed' },
        { id: 'operations', label: 'Operations & Assets', icon: ServerCog, badge: 'Calicut' },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      ]
    }
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id as ActiveTab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-10
        ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-sm">
              M
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 tracking-tight">Mastered Academy</div>
              <div className="text-[11px] text-slate-500">ERP Control Center</div>
            </div>
          </div>
          <button 
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </div>
              <div className="space-y-1 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group text-left
                        ${isActive 
                          ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30' 
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-600'}`} />
                        <span>{item.label}</span>
                      </div>

                      {/* Badges / Counters */}
                      <div className="flex items-center gap-1.5">
                        {item.count !== undefined && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}>
                            {item.count}
                          </span>
                        )}
                        {item.alertCount !== undefined && item.alertCount > 0 && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            isActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {item.alertCount} Dues
                          </span>
                        )}
                        {item.badge && (
                          <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Academy Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-3 bg-gradient-to-br from-brand-900 via-indigo-900 to-slate-900 rounded-xl text-white shadow-md">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">Calicut Campus</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Mavoor Road Cyber Tower • 6 Active Labs & Classrooms
            </p>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <span>ERP Status: Online</span>
              <span className="text-emerald-400 font-semibold">● 100% Operational</span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
