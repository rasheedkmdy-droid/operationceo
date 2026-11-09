import React, { useState } from 'react';
import { X, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Batch } from '../../types';
import { mockCourses } from '../../data/mockData';

interface NewBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatch: (newBatch: Batch) => void;
}

export const NewBatchModal: React.FC<NewBatchModalProps> = ({
  isOpen,
  onClose,
  onAddBatch
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    batchCode: 'MERN-B10',
    batchName: 'Full Stack MERN - Batch 10',
    courseId: mockCourses[0].id,
    trainerName: 'Nidhin Varghese',
    timing: '09:30 AM - 01:00 PM',
    slotType: 'Morning' as 'Morning' | 'Afternoon' | 'Evening' | 'Weekend',
    roomLab: 'Lab A - Turing Lab (28 Systems)',
    startDate: '2026-12-01',
    endDate: '2027-06-01',
    maxSeats: 25,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const course = mockCourses.find(c => c.id === formData.courseId);

    const newBatch: Batch = {
      id: `b-${Date.now()}`,
      batchCode: formData.batchCode,
      batchName: formData.batchName,
      courseId: formData.courseId,
      courseName: course?.title || 'Full Stack Web Engineering',
      trainerName: formData.trainerName,
      trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      timing: formData.timing,
      slotType: formData.slotType,
      roomLab: formData.roomLab,
      startDate: formData.startDate,
      endDate: formData.endDate,
      maxSeats: Number(formData.maxSeats),
      enrolledStudentsCount: 1,
      status: 'upcoming',
      progressPercentage: 0,
      currentTopic: 'Syllabus Orientation & Workstation Setup'
    };

    onAddBatch(newBatch);
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
            <GraduationCap className="w-5 h-5 text-brand-400" />
            <h2 className="font-bold text-sm">Schedule New Academy Batch</h2>
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
            <h3 className="font-bold text-slate-900 text-base">New Batch Scheduled!</h3>
            <p className="text-xs text-slate-500">Classroom and trainer roster reserved at Calicut Center.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Batch Code *</label>
                <input
                  required
                  type="text"
                  value={formData.batchCode}
                  onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 uppercase font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Batch Display Name *</label>
                <input
                  required
                  type="text"
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Select Academy Course</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none"
              >
                {mockCourses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Timing Slot</label>
                <select
                  value={formData.slotType}
                  onChange={(e) => setFormData({ ...formData, slotType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none"
                >
                  <option value="Morning">Morning (09:30 AM - 01:00 PM)</option>
                  <option value="Afternoon">Afternoon (02:00 PM - 05:30 PM)</option>
                  <option value="Evening">Evening (06:00 PM - 08:30 PM)</option>
                  <option value="Weekend">Weekend (09:30 AM - 04:30 PM)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Room / Lab Allocation</label>
                <input
                  type="text"
                  value={formData.roomLab}
                  onChange={(e) => setFormData({ ...formData, roomLab: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Lead Trainer / Mentor</label>
                <input
                  type="text"
                  value={formData.trainerName}
                  onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Max Student Capacity</label>
                <input
                  type="number"
                  value={formData.maxSeats}
                  onChange={(e) => setFormData({ ...formData, maxSeats: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                Save Batch
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
