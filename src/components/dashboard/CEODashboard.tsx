import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  GraduationCap, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building, 
  Sparkles,
  Download,
  PlusCircle,
  ExternalLink,
  PhoneCall,
  FileSpreadsheet
} from 'lucide-react';
import { mockCEOStats, monthlyRevenueTrend, coursePopularityData, mockBatches, mockTransactions, mockStudents } from '../../data/mockData';
import { ActiveTab } from '../layout/Sidebar';

interface CEODashboardProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenReceipt: (tx: any) => void;
  onOpenNewStudent: () => void;
  onOpenNewBatch: () => void;
}

export const CEODashboard: React.FC<CEODashboardProps> = ({
  onNavigate,
  onOpenReceipt,
  onOpenNewStudent,
  onOpenNewBatch
}) => {
  const [selectedMonth, setSelectedMonth] = useState('Nov');

  // Format currency in Indian Rupees style (₹)
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const revenueAchievementPct = Math.round((mockCEOStats.monthlyRevenue / mockCEOStats.revenueTarget) * 100);

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      
      {/* 1. Welcome Banner & Quick Action Buttons */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 rounded-2xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-300 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Operations: Calicut Center
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Executive CEO Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Real-time overview of admissions, revenue collection, batch capacity, and placement velocity at Mastered Skill Academy.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewStudent}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-600/30 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              New Admission
            </button>
            <button
              onClick={() => onNavigate('finance')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-sm transition-all border border-white/10 active:scale-95"
            >
              <Wallet className="w-4 h-4" />
              Collect Fee
            </button>
            <button
              onClick={onOpenNewBatch}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-sm transition-all border border-white/10 active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              Create Batch
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 4 High-Impact KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Monthly Revenue vs Target */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Monthly Revenue</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatINR(mockCEOStats.monthlyRevenue)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Target: {formatINR(mockCEOStats.revenueTarget)}</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {revenueAchievementPct}% Achieved
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${revenueAchievementPct}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Active Enrolled Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Active Trainees</span>
            <span className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {mockCEOStats.totalActiveStudents}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-brand-600 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18
            </span>
            <span>admissions this month</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            <span>Running Batches: <strong className="text-slate-700">{mockCEOStats.activeBatchesCount}</strong></span>
            <button onClick={() => onNavigate('students')} className="text-brand-600 font-semibold hover:underline">
              View all →
            </button>
          </div>
        </div>

        {/* Metric 3: Fee Defaulter Alert & Pending Dues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Outstanding Fee Dues</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 tracking-tight">
            {formatINR(mockCEOStats.totalOverdueAmount)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{mockCEOStats.overdueStudentsCount} Students pending</span>
            <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">Action needed</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-slate-400">Follow-up list ready</span>
            <button onClick={() => onNavigate('finance')} className="text-rose-600 font-bold hover:underline">
              Manage Dues →
            </button>
          </div>
        </div>

        {/* Metric 4: Placement Drive Velocity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Placement Success</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {mockCEOStats.placementRatePercentage}%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-emerald-600 font-bold">{mockCEOStats.studentsPlacedThisQuarter} Placed</span>
            <span>this quarter (Avg 4.8 LPA)</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            <span>Next Drive: Friday (TCS)</span>
            <button onClick={() => onNavigate('placements')} className="text-brand-600 font-semibold hover:underline">
              Placements →
            </button>
          </div>
        </div>

      </div>

      {/* 3. Operational Highlights & Revenue Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Revenue Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Revenue & Target Performance</h2>
              <p className="text-xs text-slate-500">Month-on-Month comparison for Calicut Campus (in Lakhs ₹)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                <span className="w-3 h-3 rounded-sm bg-brand-600"></span> Actual Revenue
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-slate-200"></span> Target
              </span>
            </div>
          </div>

          {/* Responsive SVG Chart */}
          <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
            {monthlyRevenueTrend.map((item, index) => {
              const maxVal = 2000000;
              const actualHeightPct = Math.round((item.revenue / maxVal) * 100);
              const targetHeightPct = Math.round((item.target / maxVal) * 100);

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] p-2 rounded-lg absolute -translate-y-28 pointer-events-none shadow-xl z-20 whitespace-nowrap">
                    <div className="font-bold">{item.month}</div>
                    <div>Collected: {formatINR(item.revenue)}</div>
                    <div>Target: {formatINR(item.target)}</div>
                    <div>Admissions: {item.admissions} students</div>
                  </div>

                  {/* Bars */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-48">
                    {/* Actual Bar */}
                    <div 
                      className={`w-1/2 rounded-t-lg transition-all duration-300 ${
                        index === monthlyRevenueTrend.length - 1 
                          ? 'bg-gradient-to-t from-brand-700 to-brand-500 shadow-md shadow-brand-500/20' 
                          : 'bg-brand-600 hover:bg-brand-500'
                      }`}
                      style={{ height: `${actualHeightPct}%` }}
                    />
                    {/* Target Bar */}
                    <div 
                      className="w-1/2 bg-slate-200 rounded-t-lg hover:bg-slate-300 transition-all"
                      style={{ height: `${targetHeightPct}%` }}
                    />
                  </div>

                  {/* Label */}
                  <div className="text-[11px] font-medium text-slate-600 truncate text-center w-full">
                    {item.month}
                  </div>
                  <div className="text-[10px] font-bold text-slate-900">
                    ₹{(item.revenue / 100000).toFixed(1)}L
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Course Enrollment Share */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Course Popularity</h2>
            <p className="text-xs text-slate-500 mb-4">Enrollment distribution across active departments</p>
            
            <div className="space-y-3.5">
              {coursePopularityData.map((course, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{course.name}</span>
                    <span className="text-slate-500">{course.students} Trainees ({course.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${course.percentage}%`, backgroundColor: course.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Highest growth:</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Full Stack MERN (+32%)
            </span>
          </div>
        </div>

      </div>

      {/* 4. Active Batches & Classroom Status */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Batches & Classroom Allocation</h2>
            <p className="text-xs text-slate-500">Calicut Center capacity utilization and syllabus progress</p>
          </div>
          <button 
            onClick={() => onNavigate('batches')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto"
          >
            Manage All Batches ({mockBatches.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockBatches.map((batch) => {
            const seatFillPct = Math.round((batch.enrolledStudentsCount / batch.maxSeats) * 100);
            return (
              <div 
                key={batch.id}
                className="p-4 rounded-xl border border-slate-200/70 hover:border-brand-300 hover:shadow-xs transition-all bg-slate-50/50"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-white border border-slate-200 text-slate-700">
                      {batch.batchCode}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">{batch.batchName}</h3>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    batch.status === 'running' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {batch.status === 'running' ? '● Running' : 'Upcoming'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{batch.timing} ({batch.slotType})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{batch.roomLab}</span>
                  </div>
                </div>

                {/* Capacity Meter */}
                <div className="pt-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                    <span>Seats: {batch.enrolledStudentsCount}/{batch.maxSeats} filled</span>
                    <span className="font-bold text-slate-800">{seatFillPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${seatFillPct >= 90 ? 'bg-amber-500' : 'bg-brand-600'}`}
                      style={{ width: `${seatFillPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recent Financial Collections & Audit Trail */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Fee Receipts & Transactions</h2>
            <p className="text-xs text-slate-500">Live feed of payments cleared at the Calicut Accounts counter</p>
          </div>
          <button 
            onClick={() => onNavigate('finance')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View Full Cash Register →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Receipt No</th>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Course / Batch</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {mockTransactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {tx.receiptNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{tx.studentName}</div>
                    <div className="text-[10px] text-slate-400">{tx.studentCode}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="truncate max-w-[150px]">{tx.courseName}</div>
                    <div className="text-[10px] text-brand-600 font-semibold">{tx.batchName}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-700">
                    {formatINR(tx.amount)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {tx.paymentDate}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onOpenReceipt(tx)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
