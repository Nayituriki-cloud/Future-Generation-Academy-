import React, { useState } from 'react';
import { useSchoolStore } from './data/store';
import { Header } from './components/Header';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { QrScannerModal } from './components/common/QrScannerModal';
import { MoMoPaymentModal } from './components/common/MoMoPaymentModal';
import { ReportCardModal } from './components/common/ReportCardModal';
import { StudentIdCardModal } from './components/common/StudentIdCardModal';
import { AiAssistantModal } from './components/common/AiAssistantModal';

import { DirectorCommandCenter } from './components/dashboards/DirectorCommandCenter';
import { ParentDashboard } from './components/dashboards/ParentDashboard';
import { TeacherDashboard } from './components/dashboards/TeacherDashboard';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { AccountantDashboard } from './components/dashboards/AccountantDashboard';
import { AdmissionsDashboard } from './components/dashboards/AdmissionsDashboard';
import { SecurityDashboard } from './components/dashboards/SecurityDashboard';
import { LibrarianDashboard } from './components/dashboards/LibrarianDashboard';
import { NurseDashboard } from './components/dashboards/NurseDashboard';
import { TransportDashboard } from './components/dashboards/TransportDashboard';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';
import { HeadteacherDashboard } from './components/dashboards/HeadteacherDashboard';

import { Student, FeeInvoice } from './types';
import {
  CreditCard,
  Award,
  Search,
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const { state } = useSchoolStore();
  const [activeNavTab, setActiveNavTab] = useState<string>('dashboard');

  // Modal visibility states
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isMoMoOpen, setIsMoMoOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | undefined>(undefined);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  // Student specific modals
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [selectedStudentForId, setSelectedStudentForId] = useState<Student | null>(null);

  // Search filter for students list view
  const [studentSearch, setStudentSearch] = useState<string>('');

  const handleOpenMoMo = (invoiceId?: string) => {
    if (invoiceId) {
      const inv = state.invoices.find((i) => i.id === invoiceId);
      setSelectedInvoice(inv);
    } else {
      setSelectedInvoice(undefined);
    }
    setIsMoMoOpen(true);
  };

  const handleOpenReportCard = (student: Student) => {
    setSelectedStudentForReport(student);
  };

  const handleOpenIdCard = (student: Student) => {
    setSelectedStudentForId(student);
  };

  // Determine which dashboard to render
  const renderDashboardByRole = () => {
    switch (state.currentUser.role) {
      case 'director':
        return (
          <DirectorCommandCenter
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenMoMo={() => handleOpenMoMo()}
            onOpenAi={() => setIsAiOpen(true)}
            onSelectStudent={(id) => {
              const std = state.students.find((s) => s.id === id);
              if (std) handleOpenIdCard(std);
            }}
          />
        );
      case 'parent':
        return (
          <ParentDashboard
            onOpenMoMo={handleOpenMoMo}
            onOpenReportCard={handleOpenReportCard}
            onOpenIdCard={handleOpenIdCard}
          />
        );
      case 'teacher':
        return (
          <TeacherDashboard
            onOpenAi={() => setIsAiOpen(true)}
            onOpenReportCard={handleOpenReportCard}
          />
        );
      case 'student':
        return (
          <StudentDashboard
            onOpenReportCard={handleOpenReportCard}
            onOpenIdCard={handleOpenIdCard}
            onOpenAi={() => setIsAiOpen(true)}
          />
        );
      case 'accountant':
        return <AccountantDashboard onOpenMoMo={handleOpenMoMo} />;
      case 'admissions':
        return <AdmissionsDashboard onOpenIdCard={handleOpenIdCard} />;
      case 'security':
        return <SecurityDashboard onOpenScanner={() => setIsScannerOpen(true)} />;
      case 'librarian':
        return <LibrarianDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      case 'transport':
        return <TransportDashboard />;
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'headteacher':
        return <HeadteacherDashboard />;
      default:
        return (
          <DirectorCommandCenter
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenMoMo={() => handleOpenMoMo()}
            onOpenAi={() => setIsAiOpen(true)}
            onSelectStudent={(id) => {
              const std = state.students.find((s) => s.id === id);
              if (std) handleOpenIdCard(std);
            }}
          />
        );
    }
  };

  // Filtered students for the direct "Students & ID Cards" tab
  const filteredStudents = state.students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.lastName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.regNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.className.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        onOpenAi={() => setIsAiOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {activeNavTab === 'dashboard' && renderDashboardByRole()}

        {activeNavTab === 'students' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-white">
                  Student Administration & Smart Badges
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete registry of Kindergarten, Primary, and Secondary students with printable QR badges and NESA report cards.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student, class, reg number..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.firstName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-white leading-tight">
                          {student.firstName} {student.lastName}
                        </h3>
                        <span className="text-xs font-mono text-amber-400 font-semibold block mt-0.5">
                          {student.regNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {student.className} · Blood: {student.bloodType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Attendance: <strong className="text-emerald-400">{student.attendanceRate}%</strong></span>
                    <span>Fee Balance: <strong className="text-amber-400 font-mono">RWF {student.feeBalance.toLocaleString()}</strong></span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleOpenIdCard(student)}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>ID Badge</span>
                    </button>
                    <button
                      onClick={() => handleOpenReportCard(student)}
                      className="py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Report Card</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNavTab === 'finance' && <AccountantDashboard onOpenMoMo={handleOpenMoMo} />}
        {activeNavTab === 'gate' && <SecurityDashboard onOpenScanner={() => setIsScannerOpen(true)} />}
        {activeNavTab === 'transport' && <TransportDashboard />}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-800/80 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Future Generation Academy · Kigali, Rwanda · "Educating Today, Leading Tomorrow"
          </span>
          <span className="font-mono text-slate-400">
            Kigali Main Campus · Gishushu · Registered NESA Institution
          </span>
        </div>
      </footer>

      {/* Interactive Global Modals */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
      />

      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <MoMoPaymentModal
        isOpen={isMoMoOpen}
        onClose={() => setIsMoMoOpen(false)}
        targetInvoice={selectedInvoice}
      />

      {selectedStudentForReport && (
        <ReportCardModal
          isOpen={!!selectedStudentForReport}
          onClose={() => setSelectedStudentForReport(null)}
          student={selectedStudentForReport}
        />
      )}

      {selectedStudentForId && (
        <StudentIdCardModal
          isOpen={!!selectedStudentForId}
          onClose={() => setSelectedStudentForId(null)}
          student={selectedStudentForId}
        />
      )}

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />
    </div>
  );
}
