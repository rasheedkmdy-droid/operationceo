import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Eye, 
  MoreVertical,
  X,
  CreditCard,
  Building2,
  Award,
  Download,
  Share2
} from 'lucide-react';
import { Student } from '../../types';
import { mockStudents, mockCourses, mockBatches } from '../../data/mockData';

interface StudentManagementProps {
  onOpenNewStudent: () => void;
  onSelectStudentForFee?: (student: Student) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  onOpenNewStudent,
  onSelectStudentForFee
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('all');
  const [activeStudentModal, setActiveStudentModal] = useState<Student | null>(null);

  // Format currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Filter students based on search, course, and fee status
  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm) ||
      student.courseName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = selectedCourse === 'all' || student.courseId === selectedCourse;
    const matchesFee = selectedFeeStatus === 'all' || student.feeStatus === selectedFeeStatus;

    return matchesSearch && matchesCourse && matchesFee;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Student Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-brand-50 text-brand-700 border border-brand-200/60">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calicut Campus student admissions, KYC records, batch enrollments, and fee ledgers.
          </p>
        </div>

        <button
          onClick={onOpenNewStudent}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-600/30 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Register New Student
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, code (MSA-2026), phone..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Filter by Course */}
        <div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-700 font-medium"
          >
            <option value="all">All Courses & Programs</option>
            {mockCourses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Filter by Fee Status */}
        <div>
          <select
            value={selectedFeeStatus}
            onChange={(e) => setSelectedFeeStatus(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-700 font-medium"
          >
            <option value="all">All Fee Payment Statuses</option>
            <option value="paid">Fully Cleared (Paid)</option>
            <option value="partial">Partially Paid</option>
            <option value="overdue">Overdue / Follow-up Required</option>
          </select>
        </div>
      </div>

      {/* 3. Students List (Responsive Cards on Mobile, Table on Desktop) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Student Info</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Enrolled Course & Batch</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredStudents.map((student) => {
                const feePercentage = Math.round((student.paidFee / student.totalFee) * 100);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.avatarUrl} 
                          alt={student.fullName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" 
                        />
                        <div>
                          <div className="font-bold text-slate-900">{student.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{student.studentCode}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-semibold">{student.phone}</div>
                      <div className="text-[11px] text-slate-400">{student.city}</div>
                    </td>

                    {/* Course & Batch */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">{student.courseName}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px] font-bold">
                        {student.batchName}
                      </span>
                    </td>

                    {/* Fee Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={
                          student.feeStatus === 'paid' ? 'text-emerald-700' :
                          student.feeStatus === 'overdue' ? 'text-rose-600' : 'text-amber-700'
                        }>
                          {formatINR(student.paidFee)}
                        </span>
                        <span className="text-[10px] text-slate-400">/ {formatINR(student.totalFee)}</span>
                      </div>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            student.feeStatus === 'paid' ? 'bg-emerald-500' :
                            student.feeStatus === 'overdue' ? 'bg-rose-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${feePercentage}%` }}
                        />
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        student.attendancePercentage >= 90 ? 'bg-emerald-50 text-emerald-700' :
                        student.attendancePercentage >= 80 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {student.attendancePercentage}%
                      </span>
                    </td>

                    {/* Status / Placement */}
                    <td className="py-3.5 px-4">
                      {student.status === 'placed' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Award className="w-3 h-3" /> Placed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Trainee
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveStudentModal(student)}
                        className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: High-Touch Cards */}
        <div className="lg:hidden divide-y divide-slate-100">
          {filteredStudents.map((student) => (
            <div key={student.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={student.avatarUrl} 
                    alt={student.fullName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100" 
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{student.fullName}</h3>
                    <div className="text-[10px] font-mono text-slate-400">{student.studentCode} • {student.city}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  student.feeStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                  student.feeStatus === 'overdue' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {student.feeStatus === 'paid' ? 'Paid' : student.feeStatus === 'overdue' ? 'Overdue' : 'Partial'}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                <div className="font-semibold text-slate-800">{student.courseName}</div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Batch: <strong className="text-brand-600">{student.batchName}</strong></span>
                  <span>Attendance: <strong className="text-slate-700">{student.attendancePercentage}%</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-xs">
                  <span className="text-slate-400">Balance Due: </span>
                  <span className={`font-bold ${student.pendingFee > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatINR(student.pendingFee)}
                  </span>
                </div>
                <button
                  onClick={() => setActiveStudentModal(student)}
                  className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Detailed Student Profile Slide-Over / Modal */}
      {activeStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-brand-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={activeStudentModal.avatarUrl} 
                  alt={activeStudentModal.fullName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <h2 className="text-base font-bold">{activeStudentModal.fullName}</h2>
                  <div className="text-xs text-brand-300 font-mono">{activeStudentModal.studentCode}</div>
                </div>
              </div>
              <button 
                onClick={() => setActiveStudentModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Placement Banner if Placed */}
              {activeStudentModal.status === 'placed' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3 text-purple-900">
                  <Award className="w-6 h-6 text-purple-600 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">Successfully Placed!</div>
                    <div className="text-[11px] text-purple-700">
                      {activeStudentModal.companyPlaced} • Package: {activeStudentModal.salaryPackage}
                    </div>
                  </div>
                </div>
              )}

              {/* Course & Batch Card */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-800 text-sm">{activeStudentModal.courseName}</div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Batch</span>
                    <span className="font-semibold">{activeStudentModal.batchName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Admission Date</span>
                    <span className="font-semibold">{activeStudentModal.admissionDate}</span>
                  </div>
                </div>
              </div>

              {/* Fee Ledger Summary */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Fee Ledger</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    activeStudentModal.feeStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                    activeStudentModal.feeStatus === 'overdue' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeStudentModal.feeStatus}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-400">Total Agreed</div>
                    <div className="font-bold text-slate-800">{formatINR(activeStudentModal.totalFee)}</div>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <div className="text-[10px] text-emerald-600 font-semibold">Total Paid</div>
                    <div className="font-bold text-emerald-700">{formatINR(activeStudentModal.paidFee)}</div>
                  </div>
                  <div className="bg-rose-50 p-2 rounded-lg">
                    <div className="text-[10px] text-rose-600 font-semibold">Remaining Due</div>
                    <div className="font-bold text-rose-700">{formatINR(activeStudentModal.pendingFee)}</div>
                  </div>
                </div>
              </div>

              {/* Contact & Guardian Details */}
              <div className="space-y-2 text-slate-600">
                <div className="font-bold text-slate-800 text-xs">KYC & Contact Info</div>
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Student Phone: <strong>{activeStudentModal.phone}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email: <strong>{activeStudentModal.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Guardian: <strong>{activeStudentModal.guardianName}</strong> ({activeStudentModal.guardianPhone})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Address: <strong>{activeStudentModal.address}, {activeStudentModal.city}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>Background: <strong>{activeStudentModal.qualification}</strong></span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveStudentModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
              <a
                href={`tel:${activeStudentModal.phone}`}
                className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Student
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
