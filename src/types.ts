export type UserRole =
  | 'super_admin'
  | 'director'
  | 'headteacher'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'admissions'
  | 'librarian'
  | 'nurse'
  | 'transport'
  | 'security';

export type Language = 'EN' | 'RW' | 'FR';

export type EducationLevel = 'kindergarten' | 'primary' | 'secondary';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  title: string;
  campusId: string;
}

export interface Student {
  id: string;
  regNumber: string; // e.g., FGA-2026-0142
  firstName: string;
  lastName: string;
  level: EducationLevel;
  className: string; // e.g. "S5 PCM" or "P6 A" or "KG 3"
  dateOfBirth: string;
  gender: 'M' | 'F';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  nationalId?: string;
  avatar: string;
  campusId: string;
  feeBalance: number; // in RWF
  attendanceRate: number; // percentage
  status: 'active' | 'transferred' | 'graduated';
  medicalNotes: string;
  bloodType: string;
  qrCodeData: string;
  rfidUid: string;
  authorizedCollectors: {
    name: string;
    relationship: string;
    phone: string;
    nationalId: string;
    photoUrl?: string;
  }[];
}

export interface Teacher {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  assignedClass?: string;
  qualification: string;
  avatar: string;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  studentIds: string[];
  address: string;
  preferredMoMoNumber: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  level: EducationLevel;
  classTeacher: string;
  capacity: number;
  enrolledCount: number;
  roomNumber: string;
  campusId: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  level: EducationLevel;
  department: string;
  coefficient: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  timeIn?: string;
  timeOut?: string;
  status: 'present' | 'late' | 'absent' | 'excused';
  verificationMethod: 'qr_scanner' | 'rfid' | 'biometric' | 'manual';
  recordedBy: string;
  pickupAuthorizedCollector?: string;
}

export interface Examination {
  id: string;
  title: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'published';
}

export interface GradeRecord {
  id: string;
  studentId: string;
  examId: string;
  subjectId: string;
  subjectName: string;
  score: number; // out of 100
  gradeLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  teacherRemarks: string;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-0891
  studentId: string;
  studentName: string;
  className: string;
  term: string;
  tuitionFee: number;
  transportFee: number;
  cafeteriaFee: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMethod: 'MTN MoMo' | 'Airtel Money' | 'Bank Transfer' | 'Cash';
  momoTransactionRef: string;
  phoneNumber?: string;
  date: string;
  status: 'completed' | 'processing' | 'failed';
  receiptNumber: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  month: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending';
  paymentDate?: string;
}

export interface TransportBus {
  id: string;
  plateNumber: string; // e.g. RAC 420 D
  model: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  currentStop: string;
  routeId: string;
  status: 'in_transit' | 'at_campus' | 'maintenance';
  currentSpeed: number; // km/h
}

export interface TransportRoute {
  id: string;
  name: string;
  startPoint: string;
  destination: string;
  stops: string[];
  busPlate: string;
  registeredStudentsCount: number;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  borrowedHistory: {
    studentId: string;
    studentName: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'borrowed' | 'returned' | 'overdue';
  }[];
}

export interface VisitorLog {
  id: string;
  badgeNumber: string;
  fullName: string;
  nationalId: string;
  phone: string;
  hostPerson: string;
  purpose: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'checked_in' | 'checked_out';
}

export interface SecurityIncident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  description: string;
  reportedBy: string;
  resolved: boolean;
}

export interface NurseVisit {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  timestamp: string;
  symptoms: string;
  treatment: string;
  medicationGiven: string;
  parentNotified: boolean;
  status: 'treated_returned_to_class' | 'sent_home' | 'transferred_to_hospital';
}

export interface Campus {
  id: string;
  name: string;
  district: string;
  sector: string;
  address: string;
  principal: string;
  studentCount: number;
  staffCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'general' | 'fee' | 'attendance' | 'security' | 'emergency';
  targetRole?: UserRole | 'all';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'ICT & Lab' | 'Furniture' | 'Sports' | 'Textbooks' | 'Facility';
  quantity: number;
  condition: 'Excellent' | 'Good' | 'Needs Repair';
  location: string;
}
