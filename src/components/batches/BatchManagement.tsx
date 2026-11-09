import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Users, 
  Building, 
  Plus, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { Batch } from '../../types';
import { mockBatches, mockCourses } from '../../data/mockData';

interface BatchManagementProps {
  onOpenNewBatch: () => void;
}

export const BatchManagement: React.FC<BatchManagementProps> = ({
  onOpenNewBatch
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'running' | 'upcoming'>('all');

  const filteredBatches = mockBatches.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Batch Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-brand-50 text-brand-700 border border-brand-200/60">
              {mockBatches.length} Batches
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mastered Skill Academy Calicut classroom scheduling, mentor allocation, and syllabus timelines.
          </p>
        </div>

        <button
          onClick={onOpenNewBatch}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-600/30 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Schedule New Batch
        </button>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterStatus === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Batches ({mockBatches.length})
        </button>
        <button
          onClick={() => setFilterStatus('running')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterStatus === 'running' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Currently Running (4)
        </button>
        <button
          onClick={() => setFilterStatus('upcoming')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterStatus === 'upcoming' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming Admissions (1)
        </button>
      </div>

      {/* 3. Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBatches.map((batch) => {
          const seatFillPct = Math.round((batch.enrolledStudentsCount / batch.maxSeats) * 100);
          return (
            <div 
              key={batch.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Batch Top Header */}
              <div className="p-5 border-b border-slate-100 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-900 text-white">
                    {batch.batchCode}
                  </span>
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                    batch.status === 'running' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {batch.status === 'running' ? '● In Session' : 'Admissions Open'}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">{batch.batchName}</h3>
                  <div className="text-xs text-brand-600 font-semibold">{batch.courseName}</div>
                </div>

                {/* Timing & Lab */}
                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{batch.timing} <strong className="text-slate-800">({batch.slotType})</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{batch.roomLab}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{batch.startDate} to {batch.endDate}</span>
                  </div>
                </div>

                {/* Trainer Row */}
                <div className="flex items-center gap-2.5 pt-1">
                  <img 
                    src={batch.trainerAvatar} 
                    alt={batch.trainerName} 
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-400 block">Lead Mentor</span>
                    <span className="font-bold text-slate-800">{batch.trainerName}</span>
                  </div>
                </div>
              </div>

              {/* Batch Bottom Footer */}
              <div className="p-5 bg-slate-50/60 space-y-3">
                {/* Seat Capacity */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Seat Capacity</span>
                    <span>{batch.enrolledStudentsCount} / {batch.maxSeats} ({seatFillPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${seatFillPct >= 95 ? 'bg-rose-500' : seatFillPct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${seatFillPct}%` }}
                    />
                  </div>
                </div>

                {/* Current Syllabus Topic */}
                {batch.status === 'running' && (
                  <div className="text-[11px] bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-400 font-semibold mb-0.5">
                      <span>Today's Topic:</span>
                      <span className="text-brand-600 font-bold">{batch.progressPercentage}% Completed</span>
                    </div>
                    <div className="font-semibold text-slate-800 truncate">{batch.currentTopic}</div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
