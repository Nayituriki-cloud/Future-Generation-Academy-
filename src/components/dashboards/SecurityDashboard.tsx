import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import {
  ShieldCheck,
  QrCode,
  UserCheck,
  AlertTriangle,
  Clock,
  Printer,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react';

interface SecurityDashboardProps {
  onOpenScanner: () => void;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ onOpenScanner }) => {
  const { state, registerVisitor, checkOutVisitor, addSecurityIncident, recordGateAttendanceScan } =
    useSchoolStore();

  const [activeTab, setActiveTab] = useState<'gate' | 'visitors' | 'incidents'>('gate');

  // Visitor form state
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorId, setVisitorId] = useState<string>('');
  const [visitorPhone, setVisitorPhone] = useState<string>('+250 788 ');
  const [hostPerson, setHostPerson] = useState<string>("Dr. Jeanne d'Arc Uwitonze");
  const [purpose, setPurpose] = useState<string>('Official Institution Visit');

  // Incident form state
  const [incidentTitle, setIncidentTitle] = useState<string>('');
  const [incidentLoc, setIncidentLoc] = useState<string>('Gate 1 Main Barrier');
  const [incidentDesc, setIncidentDesc] = useState<string>('');
  const [incidentSeverity, setIncidentSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  // Pickup verification simulator
  const [pickupRegNo, setPickupRegNo] = useState<string>('FGA-2026-0042');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [collectorIdNum, setCollectorIdNum] = useState<string>('');
  const [verificationFeedback, setVerificationFeedback] = useState<{
    status: 'success' | 'denied' | null;
    message: string;
  }>({ status: null, message: '' });

  const handleVerifyPickup = (e: React.FormEvent) => {
    e.preventDefault();
    const student = state.students.find((s) => s.regNumber === pickupRegNo);
    if (!student) {
      setVerificationFeedback({
        status: 'denied',
        message: 'Student Registration Number not found in database.',
      });
      return;
    }

    // Check if collector is authorized
    const isAuthorized = student.authorizedCollectors.length > 0;
    if (isAuthorized) {
      recordGateAttendanceScan(
        student.id,
        'check_out',
        'qr_scanner',
        `${student.authorizedCollectors[0].name} (${student.authorizedCollectors[0].relationship}) - ID: Verified`
      );
      setVerificationFeedback({
        status: 'success',
        message: `Dismissal Approved! ${student.firstName} ${student.lastName} authorized to depart with ${student.authorizedCollectors[0].name}. Parent notified via SMS.`,
      });
    } else {
      addSecurityIncident({
        title: `Unauthorized Pickup Prevented for ${student.firstName} ${student.lastName}`,
        severity: 'high',
        location: 'Gate 1 Turnstile',
        description: `Unverified collector attempted pickup without registered credentials. Child kept securely inside campus.`,
        reportedBy: 'Officer Claude Ndahiro',
      });
      setVerificationFeedback({
        status: 'denied',
        message: `SECURITY ALERT: Individual is NOT on authorized collectors list for ${student.firstName} ${student.lastName}. Child departure blocked.`,
      });
    }
  };

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone) return;

    registerVisitor({
      fullName: visitorName,
      nationalId: visitorId || '1198580098471100',
      phone: visitorPhone,
      hostPerson,
      purpose,
    });

    setVisitorName('');
    setVisitorId('');
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle || !incidentDesc) return;

    addSecurityIncident({
      title: incidentTitle,
      severity: incidentSeverity,
      location: incidentLoc,
      description: incidentDesc,
      reportedBy: 'Officer Claude Ndahiro',
    });

    setIncidentTitle('');
    setIncidentDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Security Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
              Campus Security & Access Control
            </span>
            <span className="text-xs text-slate-400">· Gate 1 Turnstiles</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">
            Perimeter Security & Student Safety Terminal
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Biometric/QR student passage, verified guardian pickup authorization, visitor pass issuance, and rapid incident response.
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-amber-500/10"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch Turnstile Scanner</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('gate')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'gate'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Guardian Pickup Verification</span>
        </button>
        <button
          onClick={() => setActiveTab('visitors')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'visitors'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Visitor Management ({state.visitors.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'incidents'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Incident Reports ({state.incidents.length})</span>
        </button>
      </div>

      {/* Tab 1: Guardian Pickup Verification Terminal */}
      {activeTab === 'gate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Authorized Child Collection Check</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verifies guardian national ID and daily security OTP against registered student profile before campus exit.
              </p>
            </div>

            <form onSubmit={handleVerifyPickup} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Student Registration Number:
                </label>
                <input
                  type="text"
                  required
                  value={pickupRegNo}
                  onChange={(e) => setPickupRegNo(e.target.value)}
                  placeholder="e.g. FGA-2026-0042"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Collector Rwandan National ID Number:
                </label>
                <input
                  type="text"
                  placeholder="1 1982 7 0098472 6 15"
                  value={collectorIdNum}
                  onChange={(e) => setCollectorIdNum(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Daily Parent Pickup OTP PIN (Provided by Parent App):
                </label>
                <input
                  type="text"
                  placeholder="849-210"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-center tracking-widest focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Verify Collector & Authorize Gate Passage</span>
              </button>
            </form>

            {verificationFeedback.status && (
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-fade-in ${
                  verificationFeedback.status === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  {verificationFeedback.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{verificationFeedback.message}</span>
                </div>
              </div>
            )}
          </div>

          {/* Today's Turnstile Passage Feed */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Today's Gate 1 Check-In / Check-Out Log</h3>
            <div className="divide-y divide-slate-800/80 text-xs">
              {state.attendance.map((att) => (
                <div key={att.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{att.studentName}</span>
                    <span className="text-[11px] text-slate-400">
                      {att.className} · {att.verificationMethod.toUpperCase()} · Recorded by {att.recordedBy}
                    </span>
                    {att.pickupAuthorizedCollector && (
                      <span className="text-[10px] text-emerald-400 block mt-0.5">
                        Collector: {att.pickupAuthorizedCollector}
                      </span>
                    )}
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 font-bold block">{att.timeIn || '07:18'}</span>
                    <span className="text-[10px] text-slate-500">{att.timeOut ? `Out: ${att.timeOut}` : 'On Campus'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Visitors Management */}
      {activeTab === 'visitors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Issue Official Visitor Pass</span>
            </h3>

            <form onSubmit={handleRegisterVisitor} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Visitor Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Eric Karekezi"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Rwandan National ID:</label>
                <input
                  type="text"
                  placeholder="1 1980 8 0098471 2 00"
                  value={visitorId}
                  onChange={(e) => setVisitorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Phone Number:</label>
                <input
                  type="tel"
                  required
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Host Official:</label>
                <input
                  type="text"
                  value={hostPerson}
                  onChange={(e) => setHostPerson(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Purpose of Visit:</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Register Visitor & Issue QR Badge
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Registered Visitors Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3">Badge No</th>
                    <th className="pb-3">Visitor Name</th>
                    <th className="pb-3">Host Official</th>
                    <th className="pb-3">Time In</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {state.visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/40">
                      <td className="py-3 font-mono font-bold text-amber-400">{v.badgeNumber}</td>
                      <td className="py-3 font-bold text-white">{v.fullName}</td>
                      <td className="py-3 text-slate-300">{v.hostPerson}</td>
                      <td className="py-3 font-mono text-emerald-400">{v.checkInTime}</td>
                      <td className="py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            v.status === 'checked_in'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {v.status === 'checked_in' ? 'On Campus' : 'Checked Out'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {v.status === 'checked_in' && (
                          <button
                            onClick={() => checkOutVisitor(v.id)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Check-Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Incidents */}
      {activeTab === 'incidents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Log Incident / Security Dispatch</span>
            </h3>

            <form onSubmit={handleReportIncident} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Incident Headline:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unauthorized individual at perimeter"
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Severity Level:</label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="low">Low (Notice)</option>
                  <option value="medium">Medium (Advisory)</option>
                  <option value="high">High (Immediate Response)</option>
                  <option value="critical">Critical (Emergency Broadcast)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Location:</label>
                <input
                  type="text"
                  value={incidentLoc}
                  onChange={(e) => setIncidentLoc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Detailed Description:</label>
                <textarea
                  rows={3}
                  required
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                  placeholder="State exact facts, action taken by guard, and outcome..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Dispatch Security Alert
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Institution Incident History</h3>
            <div className="space-y-3">
              {state.incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{inc.title}</span>
                    <span className="font-mono text-slate-400 text-[11px]">{inc.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{inc.description}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span>Officer: {inc.reportedBy} · {inc.location}</span>
                    <span className="text-emerald-400 font-semibold">
                      {inc.resolved ? 'Resolved' : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
