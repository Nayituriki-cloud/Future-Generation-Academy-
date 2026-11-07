import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import { Student } from '../../types';
import {
  HeartPulse,
  Wallet,
  ShieldCheck,
  Award,
  QrCode,
  CreditCard,
  UserCheck,
  CheckCircle2,
  Clock,
  Phone,
  Plus,
  AlertCircle,
} from 'lucide-react';

interface ParentDashboardProps {
  onOpenMoMo: (invoiceId?: string) => void;
  onOpenReportCard: (student: Student) => void;
  onOpenIdCard: (student: Student) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onOpenMoMo,
  onOpenReportCard,
  onOpenIdCard,
}) => {
  const { state } = useSchoolStore();
  const parent = state.currentUser;

  // Filter children belonging to this parent (Kevin std-001 and Keza std-002)
  const myChildren = state.students.filter(
    (s) => s.id === 'std-001' || s.id === 'std-002'
  );

  const [selectedChildId, setSelectedChildId] = useState<string>(myChildren[0]?.id || 'std-001');
  const activeChild = myChildren.find((c) => c.id === selectedChildId) || myChildren[0];

  const childInvoice = state.invoices.find((i) => i.studentId === activeChild?.id);
  const childAttendance = state.attendance.filter((a) => a.studentId === activeChild?.id);

  // Authorized collector PIN generator
  const [pickupOtp, setPickupOtp] = useState<string>('849-210');
  const [showAddCollector, setShowAddCollector] = useState<boolean>(false);
  const [collectorName, setCollectorName] = useState<string>('');
  const [collectorRelation, setCollectorRelation] = useState<string>('');
  const [collectorPhone, setCollectorPhone] = useState<string>('');
  const [collectorId, setCollectorId] = useState<string>('');

  const generateNewPickupPin = () => {
    const code = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    setPickupOtp(code);
  };

  const handleAddCollector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectorName || !collectorPhone) return;
    if (activeChild) {
      activeChild.authorizedCollectors.push({
        name: collectorName,
        relationship: collectorRelation || 'Family Relative',
        phone: collectorPhone,
        nationalId: collectorId || '1198580098472699',
      });
    }
    setShowAddCollector(false);
    setCollectorName('');
    setCollectorRelation('');
    setCollectorPhone('');
    setCollectorId('');
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Parent & Guardian Portal
            </span>
            <span className="text-xs text-slate-400">· Future Generation Academy</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">
            Welcome, {parent.name}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time gate notifications, academic report cards, verified pickup permissions, and MTN MoMo fee payments.
          </p>
        </div>

        {/* Children Selector Pills */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {myChildren.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedChildId === child.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <img
                src={child.avatar}
                alt={child.firstName}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{child.firstName} ({child.className})</span>
            </button>
          ))}
        </div>
      </div>

      {activeChild && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Academic & Child Status (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Child Profile & Actions Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={activeChild.avatar}
                    alt={activeChild.firstName}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-amber-500/50 shadow-md"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight">
                      {activeChild.firstName} {activeChild.lastName}
                    </h2>
                    <span className="text-xs font-mono text-amber-400 font-semibold block">
                      {activeChild.regNumber} · {activeChild.className}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Blood Group: {activeChild.bloodType} · Medical: {activeChild.medicalNotes}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenReportCard(activeChild)}
                    className="px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Term 1 Report Card</span>
                  </button>
                  <button
                    onClick={() => onOpenIdCard(activeChild)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Digital Student ID</span>
                  </button>
                </div>
              </div>

              {/* Attendance & Gate Status */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Today's Campus Entry</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      07:18 · Gate 1 Turnstile
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Verified via Optical QR Badge Scan
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Academic Attendance</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-base font-extrabold font-mono text-emerald-400">
                      {activeChild.attendanceRate}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Exemplary Record</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    0 Unexcused Absences
                  </span>
                </div>
              </div>
            </div>

            {/* Fees & MTN MoMo Payment Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <span>Tuition Fees & Payments</span>
                  </h3>
                  <p className="text-xs text-slate-400">Academic Term 1 - 2026</p>
                </div>

                {childInvoice && childInvoice.balanceDue > 0 && (
                  <button
                    onClick={() => onOpenMoMo(childInvoice.id)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Pay with MTN MoMo (*182#)</span>
                  </button>
                )}
              </div>

              {childInvoice ? (
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-white">{childInvoice.invoiceNumber}</span>
                      <span className="text-[11px] text-slate-400 block">Due: {childInvoice.dueDate}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        childInvoice.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {childInvoice.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tuition:</span>
                      <span className="font-mono text-white">
                        RWF {childInvoice.tuitionFee.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Transport & Lunch:</span>
                      <span className="font-mono text-white">
                        RWF {(childInvoice.transportFee + childInvoice.cafeteriaFee).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Total Amount:</span>
                      <span className="font-mono font-bold text-white">
                        RWF {childInvoice.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400">Total Paid: </span>
                      <span className="font-bold text-emerald-400 font-mono">
                        RWF {childInvoice.amountPaid.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Outstanding Balance: </span>
                      <span className="font-bold text-amber-400 font-mono">
                        RWF {childInvoice.balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No active invoices for this term.</p>
              )}
            </div>
          </div>

          {/* Right Column: Gate Security & Verified Pickup (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Gate Collection Security & Verification PIN */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Authorized Pickup Pass</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Prevents unauthorized student dismissal at Gate
                  </p>
                </div>
                <button
                  onClick={generateNewPickupPin}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Regenerate PIN
                </button>
              </div>

              {/* Dynamic Security OTP Box */}
              <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 text-center space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block">
                  TODAY'S VERIFICATION PIN (SHARE WITH DRIVER / GUARDIAN)
                </span>
                <div className="text-2xl font-black font-mono tracking-widest text-white">
                  {pickupOtp}
                </div>
                <p className="text-[11px] text-slate-400">
                  Officer at Gate 1 checks this PIN and national ID before allowing {activeChild.firstName} to exit campus.
                </p>
              </div>

              {/* Registered Authorized Collectors List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Registered Collectors on File:
                  </span>
                  <button
                    onClick={() => setShowAddCollector(!showAddCollector)}
                    className="text-amber-400 text-[11px] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Collector
                  </button>
                </div>

                {showAddCollector && (
                  <form
                    onSubmit={handleAddCollector}
                    className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs animate-fade-in"
                  >
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={collectorName}
                      onChange={(e) => setCollectorName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Relationship (e.g. Uncle)"
                        value={collectorRelation}
                        onChange={(e) => setCollectorRelation(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={collectorPhone}
                        onChange={(e) => setCollectorPhone(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                    >
                      Save Authorized Collector
                    </button>
                  </form>
                )}

                <div className="space-y-2">
                  {activeChild.authorizedCollectors.map((col, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{col.name}</span>
                        <span className="text-[11px] text-slate-400">
                          {col.relationship} · {col.phone}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Authorized
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* School Bus Route Notice */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">Daily Bus Shuttle Notice</h3>
              <div className="text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bus Assigned:</span>
                  <span className="font-semibold text-white">Bus 01 (RAC 420 D)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Designated Stop:</span>
                  <span className="font-semibold text-amber-400">Sonatubes Roundabout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Evening Departure:</span>
                  <span className="font-semibold text-white">16:30 from FGA Main Gate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
