import { useState, useEffect } from 'react';
import {
  UserAccount,
  UserRole,
  Student,
  Teacher,
  ClassRoom,
  Subject,
  AttendanceRecord,
  GradeRecord,
  FeeInvoice,
  PaymentRecord,
  PayrollRecord,
  TransportBus,
  TransportRoute,
  LibraryBook,
  VisitorLog,
  SecurityIncident,
  NurseVisit,
  Campus,
  NotificationItem,
  InventoryItem,
  Language,
} from '../types';
import {
  INITIAL_CAMPUSES,
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_GRADES,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_PAYROLL,
  INITIAL_BUSES,
  INITIAL_ROUTES,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_ATTENDANCE,
  INITIAL_VISITORS,
  INITIAL_INCIDENTS,
  INITIAL_CLINIC_VISITS,
  INITIAL_NOTIFICATIONS,
  INITIAL_INVENTORY,
} from './mockData';

const STORAGE_KEY = 'fga_kigali_academy_data_v1';

interface SchoolState {
  language: Language;
  currentUser: UserAccount;
  campuses: Campus[];
  users: UserAccount[];
  students: Student[];
  classes: ClassRoom[];
  subjects: Subject[];
  grades: GradeRecord[];
  invoices: FeeInvoice[];
  payments: PaymentRecord[];
  payroll: PayrollRecord[];
  buses: TransportBus[];
  routes: TransportRoute[];
  libraryBooks: LibraryBook[];
  attendance: AttendanceRecord[];
  visitors: VisitorLog[];
  incidents: SecurityIncident[];
  clinicVisits: NurseVisit[];
  notifications: NotificationItem[];
  inventory: InventoryItem[];
}

function getInitialState(): SchoolState {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached school state', e);
      }
    }
  }

  return {
    language: 'EN',
    currentUser: INITIAL_USERS[1], // Default to School Director for immediate Command Centre view
    campuses: INITIAL_CAMPUSES,
    users: INITIAL_USERS,
    students: INITIAL_STUDENTS,
    classes: INITIAL_CLASSES,
    subjects: INITIAL_SUBJECTS,
    grades: INITIAL_GRADES,
    invoices: INITIAL_INVOICES,
    payments: INITIAL_PAYMENTS,
    payroll: INITIAL_PAYROLL,
    buses: INITIAL_BUSES,
    routes: INITIAL_ROUTES,
    libraryBooks: INITIAL_LIBRARY_BOOKS,
    attendance: INITIAL_ATTENDANCE,
    visitors: INITIAL_VISITORS,
    incidents: INITIAL_INCIDENTS,
    clinicVisits: INITIAL_CLINIC_VISITS,
    notifications: INITIAL_NOTIFICATIONS,
    inventory: INITIAL_INVENTORY,
  };
}

let globalState: SchoolState = getInitialState();
const listeners = new Set<(state: SchoolState) => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }
  listeners.forEach((listener) => listener(globalState));
}

export function useSchoolStore() {
  const [state, setState] = useState<SchoolState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    globalState = { ...globalState, language: lang };
    notify();
  };

  const switchUser = (role: UserRole) => {
    const targetUser = globalState.users.find((u) => u.role === role) || globalState.users[0];
    globalState = { ...globalState, currentUser: targetUser };
    notify();
  };

  const admitStudent = (newStudentData: Omit<Student, 'id' | 'regNumber' | 'qrCodeData' | 'rfidUid' | 'feeBalance' | 'attendanceRate' | 'status'>) => {
    const nextNum = globalState.students.length + 43;
    const regNumber = `FGA-2026-0${nextNum}`;
    const id = `std-${Date.now().toString().slice(-4)}`;
    const student: Student = {
      ...newStudentData,
      id,
      regNumber,
      qrCodeData: `FGA-ID-KIGALI-2026-${nextNum}-${newStudentData.firstName.toUpperCase()}-${newStudentData.lastName.toUpperCase()}`,
      rfidUid: `E2806894000040${nextNum}X`,
      feeBalance: 360000,
      attendanceRate: 100,
      status: 'active',
    };

    // Also auto-generate initial invoice
    const newInvoice: FeeInvoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV-2026-0${nextNum}`,
      studentId: id,
      studentName: `${student.firstName} ${student.lastName}`,
      className: student.className,
      term: 'Term 1 - 2026',
      tuitionFee: 280000,
      transportFee: 50000,
      cafeteriaFee: 30000,
      totalAmount: 360000,
      amountPaid: 0,
      balanceDue: 360000,
      dueDate: '2026-02-28',
      status: 'pending',
    };

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Student Admission Completed',
      message: `${student.firstName} ${student.lastName} successfully enrolled into ${student.className}. Student ID ${regNumber} generated.`,
      timestamp: 'Just now',
      type: 'general',
      targetRole: 'all',
    };

    globalState = {
      ...globalState,
      students: [student, ...globalState.students],
      invoices: [newInvoice, ...globalState.invoices],
      notifications: [newNotif, ...globalState.notifications],
    };
    notify();
    return student;
  };

  const recordGateAttendanceScan = (
    studentId: string,
    action: 'check_in' | 'check_out',
    verificationMethod: 'qr_scanner' | 'rfid' | 'biometric' = 'qr_scanner',
    authorizedCollector?: string
  ) => {
    const student = globalState.students.find((s) => s.id === studentId);
    if (!student) return { success: false, message: 'Student not recognized in database' };

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    // Check if attendance record exists for today
    const existingIndex = globalState.attendance.findIndex(
      (a) => a.studentId === studentId && a.date === todayStr
    );

    let updatedAttendance = [...globalState.attendance];

    if (action === 'check_in') {
      const isLate = now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() > 30);
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}`,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        className: student.className,
        date: todayStr,
        timeIn: timeStr,
        status: isLate ? 'late' : 'present',
        verificationMethod,
        recordedBy: `${globalState.currentUser.title} (${globalState.currentUser.name})`,
      };

      if (existingIndex >= 0) {
        updatedAttendance[existingIndex] = { ...updatedAttendance[existingIndex], timeIn: timeStr };
      } else {
        updatedAttendance = [newRec, ...updatedAttendance];
      }
    } else {
      // Check-out / departure
      if (existingIndex >= 0) {
        updatedAttendance[existingIndex] = {
          ...updatedAttendance[existingIndex],
          timeOut: timeStr,
          pickupAuthorizedCollector: authorizedCollector || 'Verified Parent/Guardian',
        };
      } else {
        const newRec: AttendanceRecord = {
          id: `att-${Date.now()}`,
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          className: student.className,
          date: todayStr,
          timeOut: timeStr,
          status: 'present',
          verificationMethod,
          recordedBy: `${globalState.currentUser.title} (${globalState.currentUser.name})`,
          pickupAuthorizedCollector: authorizedCollector || 'Verified Parent/Guardian',
        };
        updatedAttendance = [newRec, ...updatedAttendance];
      }
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: action === 'check_in' ? 'Student Campus Entry' : 'Authorized Student Departure',
      message: `${student.firstName} ${student.lastName} (${student.className}) recorded at Gate 1 at ${timeStr}. Method: ${verificationMethod.toUpperCase()}.`,
      timestamp: 'Just now',
      type: 'attendance',
      targetRole: 'parent',
    };

    globalState = {
      ...globalState,
      attendance: updatedAttendance,
      notifications: [notif, ...globalState.notifications],
    };
    notify();

    return {
      success: true,
      student,
      time: timeStr,
      action,
      collector: authorizedCollector,
    };
  };

  const processMoMoPayment = (
    invoiceId: string,
    amountToPay: number,
    phoneNumber: string,
    paymentMethod: 'MTN MoMo' | 'Airtel Money' = 'MTN MoMo'
  ) => {
    const inv = globalState.invoices.find((i) => i.id === invoiceId);
    if (!inv) return null;

    const receiptNumber = `REC-2026-00${Date.now().toString().slice(-4)}`;
    const txRef = `${paymentMethod === 'MTN MoMo' ? 'MOMO-RW' : 'AIRTEL-RW'}-${Date.now().toString().slice(-7)}`;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      invoiceId: inv.id,
      studentId: inv.studentId,
      studentName: inv.studentName,
      amount: amountToPay,
      paymentMethod,
      momoTransactionRef: txRef,
      phoneNumber,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
      receiptNumber,
    };

    const newAmountPaid = inv.amountPaid + amountToPay;
    const newBalanceDue = Math.max(0, inv.totalAmount - newAmountPaid);
    const newStatus: 'paid' | 'partial' = newBalanceDue === 0 ? 'paid' : 'partial';

    const updatedInvoices = globalState.invoices.map((i) =>
      i.id === invoiceId
        ? {
            ...i,
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue,
            status: newStatus,
          }
        : i
    );

    const updatedStudents = globalState.students.map((s) =>
      s.id === inv.studentId
        ? {
            ...s,
            feeBalance: Math.max(0, s.feeBalance - amountToPay),
          }
        : s
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Tuition Fee Payment Confirmed',
      message: `RWF ${amountToPay.toLocaleString()} received via ${paymentMethod} (${phoneNumber}) for ${inv.studentName}. Receipt #${receiptNumber}.`,
      timestamp: 'Just now',
      type: 'fee',
      targetRole: 'all',
    };

    globalState = {
      ...globalState,
      payments: [newPayment, ...globalState.payments],
      invoices: updatedInvoices,
      students: updatedStudents,
      notifications: [notif, ...globalState.notifications],
    };
    notify();

    return newPayment;
  };

  const borrowLibraryBook = (bookId: string, studentId: string) => {
    const book = globalState.libraryBooks.find((b) => b.id === bookId);
    const student = globalState.students.find((s) => s.id === studentId);
    if (!book || !student || book.availableCopies <= 0) return false;

    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0];

    const updatedBooks = globalState.libraryBooks.map((b) => {
      if (b.id === bookId) {
        return {
          ...b,
          availableCopies: b.availableCopies - 1,
          borrowedHistory: [
            {
              studentId: student.id,
              studentName: `${student.firstName} ${student.lastName}`,
              borrowDate: today,
              dueDate,
              status: 'borrowed' as const,
            },
            ...b.borrowedHistory,
          ],
        };
      }
      return b;
    });

    globalState = { ...globalState, libraryBooks: updatedBooks };
    notify();
    return true;
  };

  const returnLibraryBook = (bookId: string, studentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedBooks = globalState.libraryBooks.map((b) => {
      if (b.id === bookId) {
        return {
          ...b,
          availableCopies: Math.min(b.totalCopies, b.availableCopies + 1),
          borrowedHistory: b.borrowedHistory.map((h) => {
            if (h.studentId === studentId && h.status === 'borrowed') {
              return { ...h, status: 'returned' as const, returnDate: today };
            }
            return h;
          }),
        };
      }
      return b;
    });

    globalState = { ...globalState, libraryBooks: updatedBooks };
    notify();
    return true;
  };

  const registerVisitor = (visitorData: Omit<VisitorLog, 'id' | 'badgeNumber' | 'checkInTime' | 'status'>) => {
    const badgeNum = `VIS-2026-0${globalState.visitors.length + 85}`;
    const newVisitor: VisitorLog = {
      ...visitorData,
      id: `vis-${Date.now()}`,
      badgeNumber: badgeNum,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'checked_in',
    };

    globalState = {
      ...globalState,
      visitors: [newVisitor, ...globalState.visitors],
    };
    notify();
    return newVisitor;
  };

  const checkOutVisitor = (visitorId: string) => {
    const timeOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedVisitors = globalState.visitors.map((v) =>
      v.id === visitorId ? { ...v, checkOutTime: timeOut, status: 'checked_out' as const } : v
    );
    globalState = { ...globalState, visitors: updatedVisitors };
    notify();
  };

  const logClinicVisit = (data: Omit<NurseVisit, 'id' | 'timestamp'>) => {
    const timeStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newVisit: NurseVisit = {
      ...data,
      id: `cln-${Date.now()}`,
      timestamp: timeStr,
    };

    globalState = {
      ...globalState,
      clinicVisits: [newVisit, ...globalState.clinicVisits],
    };
    notify();
    return newVisit;
  };

  const addSecurityIncident = (data: Omit<SecurityIncident, 'id' | 'timestamp' | 'resolved'>) => {
    const newIncident: SecurityIncident = {
      ...data,
      id: `inc-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      resolved: false,
    };

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `SECURITY ALERT: ${data.title}`,
      message: `Reported at ${data.location}. Severity: ${data.severity.toUpperCase()}. Security staff mobilized.`,
      timestamp: 'Just now',
      type: 'emergency',
      targetRole: 'all',
    };

    globalState = {
      ...globalState,
      incidents: [newIncident, ...globalState.incidents],
      notifications: [notif, ...globalState.notifications],
    };
    notify();
    return newIncident;
  };

  const addStudentGrade = (grade: Omit<GradeRecord, 'id'>) => {
    const newGrade: GradeRecord = {
      ...grade,
      id: `grd-${Date.now()}`,
    };
    globalState = {
      ...globalState,
      grades: [newGrade, ...globalState.grades],
    };
    notify();
    return newGrade;
  };

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    globalState = getInitialState();
    notify();
  };

  return {
    state,
    setLanguage,
    switchUser,
    admitStudent,
    recordGateAttendanceScan,
    processMoMoPayment,
    borrowLibraryBook,
    returnLibraryBook,
    registerVisitor,
    checkOutVisitor,
    logClinicVisit,
    addSecurityIncident,
    addStudentGrade,
    resetAllData,
  };
}
