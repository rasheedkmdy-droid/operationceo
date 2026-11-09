import React, { useState } from 'react';
import { UserRole, Student, Batch, Transaction } from './types';
import { mockStudents, mockBatches, mockTransactions } from './data/mockData';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { CEODashboard } from './components/dashboard/CEODashboard';
import { StudentManagement } from './components/students/StudentManagement';
import { BatchManagement } from './components/batches/BatchManagement';
import { FinanceDashboard } from './components/finance/FinanceDashboard';
import { PlacementPreview } from './components/placements/PlacementPreview';
import { ModulePlaceholder } from './components/common/ModulePlaceholder';
import { ReceiptModal } from './components/common/ReceiptModal';
import { NewStudentModal } from './components/common/NewStudentModal';
import { NewBatchModal } from './components/common/NewBatchModal';
import { CollectFeeModal } from './components/common/CollectFeeModal';

export const App: React.FC = () => {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('ceo');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Interactive Live State
  const [studentsList, setStudentsList] = useState<Student[]>(mockStudents);
  const [batchesList, setBatchesList] = useState<Batch[]>(mockBatches);
  const [transactionsList, setTransactionsList] = useState<Transaction[]>(mockTransactions);

  // Modal States
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [isNewStudentOpen, setIsNewStudentOpen] = useState(false);
  const [isNewBatchOpen, setIsNewBatchOpen] = useState(false);
  const [isCollectFeeOpen, setIsCollectFeeOpen] = useState(false);

  // Handle adding new student
  const handleAddStudent = (newStudent: Student) => {
    setStudentsList(prev => [newStudent, ...prev]);
    // Also record initial fee transaction if paid
    if (newStudent.paidFee > 0) {
      const initialTx: Transaction = {
        id: `tx-init-${Date.now()}`,
        receiptNumber: `MSA-REC-2026-${Math.floor(2000 + Math.random() * 8000)}`,
        studentId: newStudent.id,
        studentName: newStudent.fullName,
        studentCode: newStudent.studentCode,
        courseName: newStudent.courseName,
        batchName: newStudent.batchName,
        amount: newStudent.paidFee,
        paymentMethod: 'UPI',
        transactionReference: `UPI-REG-${Date.now().toString().slice(-6)}`,
        paymentDate: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        collectedBy: 'Counseling & Admissions Desk',
        installmentNumber: 1,
        totalInstallments: 3,
        status: 'Completed',
        remarks: 'Admission confirmation token & registration fee'
      };
      setTransactionsList(prev => [initialTx, ...prev]);
      setSelectedReceipt(initialTx); // Show receipt immediately!
    }
  };

  // Handle adding new batch
  const handleAddBatch = (newBatch: Batch) => {
    setBatchesList(prev => [newBatch, ...prev]);
  };

  // Handle recording new fee payment
  const handleRecordPayment = (newTx: Transaction) => {
    setTransactionsList(prev => [newTx, ...prev]);
    
    // Update student's fee ledger
    setStudentsList(prev => prev.map(s => {
      if (s.id === newTx.studentId) {
        const updatedPaid = s.paidFee + newTx.amount;
        const updatedPending = Math.max(0, s.totalFee - updatedPaid);
        return {
          ...s,
          paidFee: updatedPaid,
          pendingFee: updatedPending,
          feeStatus: updatedPending === 0 ? 'paid' : 'partial'
        };
      }
      return s;
    }));

    // Instantly open the printable receipt!
    setSelectedReceipt(newTx);
  };

  const overdueCount = studentsList.filter(s => s.feeStatus === 'overdue' || s.pendingFee > 0).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          studentsCount={studentsList.length}
          batchesCount={batchesList.length}
          overdueCount={overdueCount}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            
            {activeTab === 'dashboard' && (
              <CEODashboard
                onNavigate={setActiveTab}
                onOpenReceipt={setSelectedReceipt}
                onOpenNewStudent={() => setIsNewStudentOpen(true)}
                onOpenNewBatch={() => setIsNewBatchOpen(true)}
              />
            )}

            {activeTab === 'students' && (
              <StudentManagement
                onOpenNewStudent={() => setIsNewStudentOpen(true)}
              />
            )}

            {activeTab === 'batches' && (
              <BatchManagement
                onOpenNewBatch={() => setIsNewBatchOpen(true)}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceDashboard
                onOpenReceipt={setSelectedReceipt}
                onOpenNewPayment={() => setIsCollectFeeOpen(true)}
              />
            )}

            {activeTab === 'placements' && (
              <PlacementPreview />
            )}

            {activeTab === 'attendance' && (
              <ModulePlaceholder
                moduleName="Attendance Management"
                phaseNumber={2}
                description="Fast 1-tap mobile attendance for trainers and students, biometric log integration, and automatic absence alert SMS."
                features={[
                  "1-Tap Present/Absent mobile marking for trainers in under 30 seconds",
                  "Automated warnings when student attendance drops below 80%",
                  "Monthly attendance register exports (.xlsx & PDF) for corporate certification audits",
                  "Staff and faculty punch-in and leave request tracking"
                ]}
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'academics' && (
              <ModulePlaceholder
                moduleName="Academic & Syllabus Management"
                phaseNumber={2}
                description="Curriculum milestone pacing, daily topic logging by mentors, project assignment submissions, and mock interview scoring."
                features={[
                  "Week-by-week syllabus progress trackers across all courses",
                  "Daily trainer lecture logs to prevent course delays",
                  "GitHub and Drive assignment submission portal with grading",
                  "Automated QR-code verified certificate issuance upon course completion"
                ]}
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'hr' && (
              <ModulePlaceholder
                moduleName="HR & Staff Payroll"
                phaseNumber={3}
                description="Faculty and staff profiles, biometric attendance-linked salary calculations, deductions, and 1-click payslip generation."
                features={[
                  "Calicut faculty & administrative staff directory",
                  "Hourly payouts for guest speakers and fixed salary contracts",
                  "Automated PF, ESI, and Loss of Pay (LOP) calculations",
                  "Branded PDF payslips ready for employee download"
                ]}
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'operations' && (
              <ModulePlaceholder
                moduleName="Operations & Campus Assets"
                phaseNumber={3}
                description="Inventory control for Calicut campus computer labs, software licenses, room bookings, and student helpdesk tickets."
                features={[
                  "Workstation & hardware serial tracking across Turing Lab, Ada Lab, and Design Studio",
                  "Classroom and conference room calendar scheduler to prevent double-booking",
                  "Student support ticket resolution workflow (lab issues, software requests)",
                  "Vendor contract and AMC maintenance logs"
                ]}
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'reports' && (
              <ModulePlaceholder
                moduleName="Reports & Executive Analytics"
                phaseNumber={4}
                description="Consolidated revenue ledgers, course profitability, trainer efficiency index, and batch completion rates."
                features={[
                  "One-click monthly financial ledger export for academy chartered accountants",
                  "Student dropout and retention analytics per course",
                  "Placement package distribution graphs and recruiter hiring patterns",
                  "Audited Form T wage registers and GST collection reconciliations"
                ]}
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            )}

          </div>
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        overdueCount={overdueCount}
      />

      {/* Interactive Modals */}
      <ReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      <NewStudentModal
        isOpen={isNewStudentOpen}
        onClose={() => setIsNewStudentOpen(false)}
        onAddStudent={handleAddStudent}
      />

      <NewBatchModal
        isOpen={isNewBatchOpen}
        onClose={() => setIsNewBatchOpen(false)}
        onAddBatch={handleAddBatch}
      />

      <CollectFeeModal
        isOpen={isCollectFeeOpen}
        onClose={() => setIsCollectFeeOpen(false)}
        onRecordPayment={handleRecordPayment}
      />

    </div>
  );
};

export default App;
