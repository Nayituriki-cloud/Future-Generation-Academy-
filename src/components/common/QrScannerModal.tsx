import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import { Student } from '../../types';
import { X, QrCode, CheckCircle2, AlertTriangle, ShieldCheck, Camera, UserCheck, RefreshCw } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'check_in' | 'check_out' | 'library' | 'bus';
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  defaultAction = 'check_in',
}) => {
  const { state, recordGateAttendanceScan } = useSchoolStore();
  const [action, setAction] = useState<'check_in' | 'check_out'>(
    defaultAction === 'check_out' ? 'check_out' : 'check_in'
  );
  const [selectedCollector, setSelectedCollector] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    student?: Student;
    time?: string;
    action?: string;
    collector?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleScanStudent = (student: Student) => {
    // If departure, check collector
    let collector = selectedCollector;
    if (action === 'check_out' && !collector && student.authorizedCollectors.length > 0) {
      collector = `${student.authorizedCollectors[0].name} (${student.authorizedCollectors[0].relationship})`;
    }

    const res = recordGateAttendanceScan(student.id, action, 'qr_scanner', collector);
    if (res.success) {
      setScanResult({
        success: true,
        student: res.student,
        time: res.time,
        action: res.action,
        collector: res.collector,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                FGA Digital QR Terminal
              </h2>
              <p className="text-xs text-slate-400">
                Gate 1 Biometric & QR Badge Turnstile System · Kigali Main Campus
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setScanResult(null);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Action Selector */}
          <div className="flex items-center gap-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                setAction('check_in');
                setScanResult(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                action === 'check_in'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Morning Arrival (Check-In)
            </button>
            <button
              onClick={() => {
                setAction('check_out');
                setScanResult(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                action === 'check_out'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dismissal & Guardian Pickup (Check-Out)
            </button>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="relative rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-6 flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Visual Corner Markers */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

            {scanResult ? (
              <div className="py-4 space-y-3 animate-fade-in max-w-md">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    Verification Successful
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {scanResult.student?.firstName} {scanResult.student?.lastName}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{scanResult.student?.regNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400 font-semibold">{scanResult.student?.className}</span>
                    <span aria-hidden="true">·</span>
                    <span>{scanResult.time}</span>
                  </div>
                </div>

                {action === 'check_out' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 text-left">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Authorized Guardian Verification:
                    </span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {scanResult.collector || 'Verified Parent on File'}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setScanResult(null)}
                  className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Scan Next Badge
                </button>
              </div>
            ) : (
              <div className="py-6 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <Camera className="w-6 h-6 animate-pulse text-amber-400" />
                </div>
                <p className="text-xs font-medium text-slate-200">
                  Point barcode reader or tap any student badge below
                </p>
                <p className="text-[11px] text-slate-400">
                  Simulates optical scanner at turnstile · Instant parent notification
                </p>
              </div>
            )}
          </div>

          {/* Quick Instant Scan Student Badges */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
              1-Click Scan Sample Student Badges (Instant Test):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {state.students.slice(0, 4).map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleScanStudent(student)}
                  className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/70 hover:bg-slate-750 hover:border-amber-500/50 transition-all text-left flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.firstName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-600"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 truncate block">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block">
                        {student.regNumber} · {student.className}
                      </span>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-700 text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <QrCode className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Camera Access: Ready · Optical Reader: Active</span>
          <button
            onClick={() => {
              setScanResult(null);
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
