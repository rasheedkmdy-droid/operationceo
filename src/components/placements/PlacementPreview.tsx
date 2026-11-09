import React from 'react';
import { Briefcase, Award, Building2, MapPin, ExternalLink, Users, Calendar } from 'lucide-react';
import { mockStudents } from '../../data/mockData';

export const PlacementPreview: React.FC = () => {
  const placedStudents = mockStudents.filter(s => s.status === 'placed');

  const upcomingDrives = [
    {
      company: "Tata Consultancy Services (TCS)",
      role: "Associate Software Engineer",
      package: "₹4.8 - ₹5.5 LPA",
      date: "Nov 14, 2026",
      eligibleBatch: "MERN-B07 & MERN-B08",
      location: "Kochi Infopark / Virtual"
    },
    {
      company: "Cognizant Technology Solutions",
      role: "GenAI Developer Trainee",
      package: "₹5.0 - ₹6.0 LPA",
      date: "Nov 22, 2026",
      eligibleBatch: "AI-B04",
      location: "Calicut Cyberpark Drive"
    },
    {
      company: "PixelCraft Digital Agency (Kozhikode)",
      role: "UI/UX Designer",
      package: "₹4.2 LPA",
      date: "Nov 28, 2026",
      eligibleBatch: "UIUX-B05 & UIUX-B06",
      location: "On-Campus Interview"
    }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Placement Cell & Hiring Drives
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
              92.4% Placement Rate
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Corporate recruiters, student eligibility shortlisting, and hiring drives in Calicut and Kerala tech hubs.
          </p>
        </div>
      </div>

      {/* Placed Students Hall of Fame */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          Recent Alumni Placements (Hall of Fame)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {placedStudents.map(s => (
            <div key={s.id} className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 flex items-center gap-4">
              <img 
                src={s.avatarUrl} 
                alt={s.fullName}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-300"
              />
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm">{s.fullName}</div>
                <div className="text-xs text-purple-800 font-semibold">{s.companyPlaced}</div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Package: {s.salaryPackage}</span>
                  <span>{s.courseName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Hiring Drives */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-600" />
          Scheduled Campus Recruitment Drives
        </h2>

        <div className="space-y-3">
          {upcomingDrives.map((drive, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{drive.company}</h3>
                  <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px] font-bold">
                    {drive.package}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">Role: <strong className="text-slate-800">{drive.role}</strong></div>
                <div className="text-[11px] text-slate-400 mt-0.5">Eligible: {drive.eligibleBatch} • Location: {drive.location}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">Interview Date</span>
                  <span className="font-bold text-slate-800">{drive.date}</span>
                </div>
                <button className="px-3.5 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-xs transition-colors">
                  View Shortlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
