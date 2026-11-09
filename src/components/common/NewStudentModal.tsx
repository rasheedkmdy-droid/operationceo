import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
import { Student } from '../../types';
import { mockCourses, mockBatches } from '../../data/mockData';

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
}

export const NewStudentModal: React.FC<NewStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Calicut',
    address: '',
    guardianName: '',
    guardianPhone: '',
    qualification: 'B.Tech / Degree',
    courseId: mockCourses[0].id,
    batchId: mockBatches[0].id,
    totalFee: mockCourses[0].totalFee,
    paidFee: 15000,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleCourseChange = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    setFormData(prev => ({
      ...prev,
      courseId,
      totalFee: course ? course.totalFee : prev.totalFee
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const course = mockCourses.find(c => c.id === formData.courseId);
    const batch = mockBatches.find(b => b.id === formData.batchId);
    
    const pending = Math.max(0, formData.totalFee - formData.paidFee);
    const feeStatus = pending === 0 ? 'paid' : pending === formData.totalFee ? 'overdue' : 'partial';

    const newStudent: Student = {
      id: `s-${Date.now()}`,
      studentCode: `MSA-2026-0${Math.floor(100 + Math.random() * 900)}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      guardianName: formData.guardianName,
      guardianPhone: formData.guardianPhone,
      address: formData.address,
      city: formData.city,
      courseId: formData.courseId,
      courseName: course?.title || 'Full Stack Engineering',
      batchId: formData.batchId,
      batchName: batch?.batchCode || 'MERN-B08',
      admissionDate: new Date().toISOString().split('T')[0],
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      totalFee: formData.totalFee,
      paidFee: formData.paidFee,
      pendingFee: pending,
      feeStatus,
      attendancePercentage: 100,
      status: 'active',
      qualification: formData.qualification,
      placementStatus: 'in_process'
    };

    onAddStudent(newStudent);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-400" />
            <h2 className="font-bold text-sm">New Student Admission</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Admission Successfully Recorded!</h3>
            <p className="text-xs text-slate-500">Student enrollment and initial fee receipt created for Calicut Campus.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Suhail Ahmed"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Number *</label>
                <input
                  required
                  type="text"
                  placeholder="+91 98470 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="student@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City / Location</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Guardian Name</label>
                <input
                  type="text"
                  placeholder="Father / Mother Name"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Guardian Phone</label>
                <input
                  type="text"
                  placeholder="+91 94470 00000"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Program / Course</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none"
                >
                  {mockCourses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assign Batch</label>
                <select
                  value={formData.batchId}
                  onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none"
                >
                  {mockBatches.map((b) => (
                    <option key={b.id} value={b.id}>{b.batchCode} ({b.timing})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Agreed Course Fee (₹)</label>
                <input
                  type="number"
                  value={formData.totalFee}
                  onChange={(e) => setFormData({ ...formData, totalFee: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-emerald-700 block mb-1">Initial Token Paid (₹)</label>
                <input
                  type="number"
                  value={formData.paidFee}
                  onChange={(e) => setFormData({ ...formData, paidFee: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-emerald-700"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm transition-all"
              >
                Confirm Admission
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
