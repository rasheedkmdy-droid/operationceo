import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  Receipt, 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Send, 
  PhoneCall, 
  CheckCircle2, 
  Building2,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Transaction, Student, PaymentMethod } from '../../types';
import { mockTransactions, mockStudents, mockCEOStats } from '../../data/mockData';

interface FinanceDashboardProps {
  onOpenReceipt: (tx: Transaction) => void;
  onOpenNewPayment: () => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  onOpenReceipt,
  onOpenNewPayment
}) => {
  const [filterMode, setFilterMode] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Format currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch = 
      tx.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.studentCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMode = filterMode === 'all' || tx.paymentMethod === filterMode;
    return matchesSearch && matchesMode;
  });

  // Students with overdue balance
  const overdueStudents = mockStudents.filter((s) => s.feeStatus === 'overdue' || s.pendingFee > 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Finance & Fee Collection
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Calicut Counter
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fee installment receipts, payment mode reconciliation, and pending dues management.
          </p>
        </div>

        <button
          onClick={onOpenNewPayment}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/30 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Collect Fee / Issue Receipt
        </button>
      </div>

      {/* 2. Finance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monthly Inflow */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Inflow (November)</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatINR(mockCEOStats.monthlyRevenue)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Target: <strong>{formatINR(mockCEOStats.revenueTarget)}</strong>
          </div>
        </div>

        {/* Pending Overdue Dues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Outstanding Dues</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 tracking-tight">
            {formatINR(mockCEOStats.totalOverdueAmount)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across <strong>{mockCEOStats.overdueStudentsCount}</strong> student installments
          </div>
        </div>

        {/* Today's Cash in Hand */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Counter Cash in Hand</span>
            <span className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatINR(mockCEOStats.cashInHandToday)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Physical cash balance at reception
          </div>
        </div>

        {/* UPI & Digital Share */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Digital Collection Share</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            87.5%
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Via GPay, PhonePe, & Net Banking
          </div>
        </div>
      </div>

      {/* 3. Dues & Defaulters Watchlist */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Follow-Up & Pending Installments Watchlist
            </h2>
            <p className="text-xs text-slate-500">Students with unpaid fees scheduled for this cycle</p>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            {overdueStudents.length} Students Pending
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {overdueStudents.map((s) => (
            <div key={s.id} className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/30 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 text-xs">{s.fullName}</div>
                <div className="text-[10px] text-slate-500">{s.studentCode} • {s.batchName}</div>
                <div className="text-xs font-black text-rose-600 mt-1">
                  Due: {formatINR(s.pendingFee)}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <a
                  href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(s.fullName)},%20this%20is%20a%20reminder%20from%20Mastered%20Skill%20Academy%20Calicut%20regarding%20your%20pending%20fee%20installment.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  WhatsApp
                </a>
                <button
                  onClick={onOpenNewPayment}
                  className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg shadow-2xs transition-colors"
                >
                  Collect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Complete Fee Receipts Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Ledger Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Fee Payment Records</h2>
            <p className="text-xs text-slate-500">Official receipt history with instant verification</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search receipt / student..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Mode Filter */}
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Modes</option>
              <option value="GPay">GPay</option>
              <option value="PhonePe">PhonePe</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-4">Course & Batch</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4">Mode / Ref</th>
                <th className="py-3 px-4">Received By</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {tx.receiptNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{tx.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tx.studentCode}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 line-clamp-1">{tx.courseName}</div>
                    <div className="text-[10px] text-brand-600 font-semibold">{tx.batchName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-black text-emerald-700 text-sm">{formatINR(tx.amount)}</div>
                    <div className="text-[10px] text-slate-400">Inst. #{tx.installmentNumber} of {tx.totalInstallments}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {tx.paymentMethod}
                    </span>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate max-w-[120px]">{tx.transactionReference}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                    {tx.collectedBy}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {tx.paymentDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onOpenReceipt(tx)}
                      className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Print
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
