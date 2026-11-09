import React from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  MapPin, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck,
  Menu
} from 'lucide-react';
import { UserRole } from '../../types';
import { academyInfo } from '../../data/mockData';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenMobileMenu: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onOpenMobileMenu,
  searchTerm,
  onSearchChange
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Academy Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  MASTERED
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 rounded-md border border-brand-200/60">
                  ERP v1.0
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[160px] sm:max-w-none">Calicut Campus • Mavoor Road</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search students, batches, receipts (e.g. Faheem, MERN)..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right: Role Switcher & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Executive Role Switcher Badge */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs">
            <span className="hidden lg:flex items-center gap-1 pl-2 pr-1 font-semibold text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              Role:
            </span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-white border-0 text-slate-800 font-semibold py-1 px-2.5 rounded-lg shadow-2xs focus:ring-1 focus:ring-brand-500 cursor-pointer text-xs"
            >
              <option value="ceo">CEO / Director View</option>
              <option value="finance">Accounts & Finance</option>
              <option value="admin">Operations & Admissions</option>
              <option value="trainer">Faculty / Trainer</option>
            </select>
          </div>

          {/* Quick Notification Bell */}
          <button 
            title="Notifications"
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Avatar & Status */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-brand-500/30">
              MD
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">Managing Director</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Calicut Online
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
