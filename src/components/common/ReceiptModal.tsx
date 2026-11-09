import React from 'react';
import { X, Printer, CheckCircle2, Building2, ShieldCheck, Download } from 'lucide-react';
import { Transaction } from '../../types';
import { academyInfo } from '../../data/mockData';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-400" />
            <span className="font-bold text-sm">Official Fee Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-8 space-y-6 text-slate-800 bg-white">
          
          {/* Academy Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-base">
                  M
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                    {academyInfo.name}
                  </h1>
                  <p className="text-[11px] font-semibold text-brand-700">{academyInfo.center}</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 max-w-sm pt-1 leading-relaxed">
                {academyInfo.address}
              </p>
              <div className="text-[10px] text-slate-600 font-medium">
                Phone: {academyInfo.phone} • GSTIN: <strong className="font-mono">{academyInfo.gstin}</strong>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-bold uppercase tracking-wider mb-2">
                Fee Receipt
              </div>
              <div className="text-xs font-bold text-slate-900 font-mono">
                {transaction.receiptNumber}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {transaction.paymentDate}
              </div>
            </div>
          </div>

          {/* Student & Course Details Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Student Details</span>
              <div className="font-extrabold text-sm text-slate-900">{transaction.studentName}</div>
              <div className="text-slate-600 font-mono font-medium">Reg Code: {transaction.studentCode}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Enrolled Course</span>
              <div className="font-bold text-slate-900">{transaction.courseName}</div>
              <div className="text-brand-700 font-semibold text-[11px]">Batch: {transaction.batchName}</div>
            </div>
          </div>

          {/* Payment Itemized Table */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Payment Mode</th>
                <th className="py-2.5 px-3">Reference / Tx ID</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">
                    Tuition Fee Installment #{transaction.installmentNumber} of {transaction.totalInstallments}
                  </div>
                  <div className="text-[11px] text-slate-500">{transaction.remarks}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded font-bold bg-slate-200/70 text-slate-800 text-[11px]">
                    {transaction.paymentMethod}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                  {transaction.transactionReference}
                </td>
                <td className="py-3 px-3 text-right font-black text-sm text-slate-900">
                  {formatINR(transaction.amount)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-black text-sm border-t border-slate-200">
                <td colSpan={3} className="py-2.5 px-3 text-right text-slate-700 uppercase text-xs">
                  Total Amount Received:
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-700 font-black text-base">
                  {formatINR(transaction.amount)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Verification & Signatures */}
          <div className="pt-4 grid grid-cols-2 gap-8 items-end text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                Digitally Generated & Verified
              </div>
              <p className="text-[10px] text-slate-400">
                Fee is non-refundable as per Mastered Skill Academy academy terms. Keep this receipt safe for course certification.
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="text-[10px] text-slate-400">Cashier / Collected By:</div>
              <div className="font-bold text-slate-900">{transaction.collectedBy}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest pt-3 border-t border-slate-300">
                Authorized Signatory
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions (Hidden on print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-[11px] text-slate-500">
            Press Ctrl+P to save as official PDF receipt
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
