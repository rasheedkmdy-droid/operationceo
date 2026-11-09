import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { ActiveTab } from '../layout/Sidebar';

interface ModulePlaceholderProps {
  moduleName: string;
  phaseNumber: number;
  description: string;
  features: string[];
  onBackToDashboard: () => void;
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({
  moduleName,
  phaseNumber,
  description,
  features,
  onBackToDashboard
}) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm ring-4 ring-brand-500/10">
        <Clock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800">
          Scheduled for Phase {phaseNumber}
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{moduleName}</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-left space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Planned Architectural Features
        </h3>
        <ul className="space-y-2.5">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
              <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onBackToDashboard}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
      >
        Return to CEO Dashboard
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
