import React, { useState } from 'react';
import { X, Wallet, CheckCircle2, QrCode } from 'lucide-react';
import { Transaction, Student, PaymentMethod } from '../../types';
import { mockStudents } from '../../data/mockData';

interface CollectFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordPayment: (transaction: Transaction) => void;
}

export const CollectFeeModal: React.FC<CollectFeeModalProps> = ({
  isOpen,
  onClose,
  onRecordPayment
}) => {
  if (!isOpen) return null;

  const [selectedStudentId, setSelectedStudentId] = useState(mockStudents[0].id);
  const selectedStudent = mockStudents.find(s => s.id === selectedStudentId) || mockStudents[0];

  const [amount, setAmount] = useState(15000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('GPay');
  const [transactionRef, setTransactionRef] = useState(`UPI-${Date.now().toString().slice(-8)}`);
  const [remarks, setRemarks] = useState('Tuition installment fee paid at Calicut counter');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      receiptNumber: `MSA-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      studentCode: selectedStudent.studentCode,
      courseName: selectedStudent.courseName,
      batchName: selectedStudent.batchName,
      amount: Number(amount),
      paymentMethod,
      transactionReference: transactionRef,
      paymentDate: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      collectedBy: 'Shameem K. (Accounts Officer)',
      installmentNumber: selectedStudent.feeStatus === 'paid' ? 3 : 2,
      totalInstallments: 3,
      status: 'Completed',
      remarks
    };

    onRecordPayment(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm">Fee Collection & Digital Receipt</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Select Student */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Student *</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
            >
              {mockStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.studentCode}) - {s.courseName} [Due: ₹{s.pendingFee}]
                </option>
              ))}
            </select>
          </div>

          {/* Student Snapshot Card */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1 text-slate-600">
            <div className="flex items-center justify-between">
              <span>Course: <strong className="text-slate-800">{selectedStudent.courseName}</strong></span>
              <span>Batch: <strong className="text-brand-600">{selectedStudent.batchName}</strong></span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>Agreed Total: ₹{selectedStudent.totalFee}</span>
              <span className="font-bold text-rose-600">Outstanding Balance: ₹{selectedStudent.pendingFee}</span>
            </div>
          </div>

          {/* Payment Amount & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Amount to Pay (₹) *</label>
              <input
                required
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-black text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none"
              >
                <option value="GPay">Google Pay (GPay QR)</option>
                <option value="PhonePe">PhonePe</option>
                <option value="UPI">Any UPI App / BHIM</option>
                <option value="Cash">Physical Cash</option>
                <option value="Bank Transfer">Bank Wire / NEFT / IMPS</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>
          </div>

          {/* Reference & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">UPI Ref / Cheque No.</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Remarks / Note</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
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
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all"
            >
              Generate Receipt & Log Payment
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
