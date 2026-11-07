import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Student } from '../../types';
import { X, Printer, Shield, CreditCard, Droplet, Phone } from 'lucide-react';

interface StudentIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (student) {
      const payload = JSON.stringify({
        id: student.id,
        reg: student.regNumber,
        name: `${student.firstName} ${student.lastName}`,
        class: student.className,
        school: 'Future Generation Academy Kigali',
        authHash: `FGA-SEC-${student.rfidUid.slice(0, 8)}`,
      });

      QRCode.toDataURL(payload, {
        width: 180,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [student]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden flex flex-col shadow-2xl">
        {/* Toolbar */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-white">
                Official Digital Student ID & Smart Badge
              </h2>
              <p className="text-[11px] text-slate-400">
                RFID + Optical QR Access Pass · Future Generation Academy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Badge Card Container */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-950 print-container">
          {/* Physical ID Card Preview (CR80 standard ratio) */}
          <div className="w-[380px] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-white font-sans">
            {/* Top Security Stripe / Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500"></div>

            {/* School Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 pt-1">
              <div className="flex items-center gap-2.5">
                <img
                  src="/src/assets/images/fga_academy_crest_1794084879975.jpg"
                  alt="Crest"
                  className="w-10 h-10 rounded-full border border-amber-400 object-cover"
                />
                <div>
                  <h3 className="text-xs font-black tracking-tight text-white leading-tight">
                    FUTURE GENERATION ACADEMY
                  </h3>
                  <span className="text-[9px] text-amber-400 font-mono tracking-wider block">
                    KIGALI · RWANDA · STUDENT ID
                  </span>
                </div>
              </div>
              <Shield className="w-5 h-5 text-amber-400" />
            </div>

            {/* Student Photo & Bio Layout */}
            <div className="grid grid-cols-12 gap-3.5 py-4 items-center">
              {/* Photo Box */}
              <div className="col-span-5 relative">
                <img
                  src={student.avatar}
                  alt={student.firstName}
                  className="w-full h-36 rounded-xl object-cover border-2 border-slate-700 shadow-md"
                />
                <span className="absolute bottom-1 right-1 bg-emerald-600 text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                  ACTIVE
                </span>
              </div>

              {/* Bio Details */}
              <div className="col-span-7 space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Student Name</span>
                  <span className="text-sm font-extrabold text-white leading-tight block">
                    {student.firstName} {student.lastName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Student ID Number</span>
                  <span className="font-mono text-amber-400 font-bold tracking-wider">
                    {student.regNumber}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Class Level</span>
                    <span className="font-bold text-slate-200">{student.className}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Blood Group</span>
                    <span className="font-bold text-red-400 flex items-center gap-0.5">
                      <Droplet className="w-3 h-3 fill-red-400" /> {student.bloodType}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Emergency Parent Contact</span>
                  <span className="font-mono text-[11px] text-slate-300 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" /> {student.parentPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: QR Code & Barcode */}
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-slate-400 block">RFID SMART CHIP</span>
                <span className="text-[10px] font-mono text-slate-300 font-bold">
                  {student.rfidUid}
                </span>
                <div className="text-[8px] text-slate-500 mt-1">
                  Valid 2026/2027 · Return if found
                </div>
              </div>

              {/* High-Res QR Code */}
              {qrDataUrl && (
                <div className="bg-white p-1 rounded-lg border border-amber-500/40 shadow-sm">
                  <img src={qrDataUrl} alt="Student QR Code" className="w-14 h-14" />
                </div>
              )}
            </div>
          </div>

          <p className="no-print text-xs text-slate-500 mt-4 text-center">
            Standard ISO 7810 ID card layout · Compatible with turnstile barcode scanners & NFC readers
          </p>
        </div>
      </div>
    </div>
  );
};
