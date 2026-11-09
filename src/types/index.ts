export type UserRole = 'ceo' | 'admin' | 'finance' | 'trainer' | 'placement' | 'counselor';

export type PaymentMethod = 'UPI' | 'GPay' | 'PhonePe' | 'Cash' | 'Card' | 'Bank Transfer';

export interface Student {
  id: string;
  studentCode: string; // e.g. MSA-2026-0104
  fullName: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  city: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  admissionDate: string;
  avatarUrl: string;
  totalFee: number;
  paidFee: number;
  pendingFee: number;
  feeStatus: 'paid' | 'partial' | 'overdue';
  attendancePercentage: number;
  status: 'active' | 'graduated' | 'placed' | 'dropped';
  qualification: string;
  placementStatus?: 'ready' | 'in_process' | 'placed' | 'not_eligible';
  companyPlaced?: string;
  salaryPackage?: string;
}

export interface Batch {
  id: string;
  batchCode: string; // e.g. MERN-B08
  batchName: string;
  courseId: string;
  courseName: string;
  trainerName: string;
  trainerAvatar: string;
  timing: string; // e.g. "09:30 AM - 01:00 PM"
  slotType: 'Morning' | 'Afternoon' | 'Evening' | 'Weekend';
  roomLab: string; // e.g. "Lab A (Kozhikode Center)"
  startDate: string;
  endDate: string;
  maxSeats: number;
  enrolledStudentsCount: number;
  status: 'upcoming' | 'running' | 'completed';
  progressPercentage: number;
  currentTopic: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  durationMonths: number;
  totalFee: number;
  description: string;
  category: string;
  totalEnrolled: number;
  iconName: string;
}

export interface Transaction {
  id: string;
  receiptNumber: string; // e.g. MSA-REC-4821
  studentId: string;
  studentName: string;
  studentCode: string;
  courseName: string;
  batchName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  paymentDate: string;
  collectedBy: string;
  installmentNumber: number;
  totalInstallments: number;
  status: 'Completed' | 'Pending' | 'Failed';
  remarks?: string;
}

export interface CEOStats {
  monthlyRevenue: number;
  revenueTarget: number;
  totalActiveStudents: number;
  activeBatchesCount: number;
  totalOverdueAmount: number;
  overdueStudentsCount: number;
  placementRatePercentage: number;
  studentsPlacedThisQuarter: number;
  dailyAttendanceRate: number;
  cashInHandToday: number;
}
