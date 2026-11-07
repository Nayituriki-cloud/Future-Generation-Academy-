import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import { getTranslation } from '../../utils/translations';
import {
  Users,
  GraduationCap,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Bus,
  AlertTriangle,
  QrCode,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  Printer,
  ChevronRight,
  Radio,
} from 'lucide-react';

interface DirectorCommandCenterProps {
  onOpenScanner: () => void;
  onOpenMoMo: () => void;
  onOpenAi: () => void;
  onSelectStudent: (studentId: string) => void;
}

export const DirectorCommandCenter: React.FC<DirectorCommandCenterProps> = ({
  onOpenScanner,
  onOpenMoMo,
  onOpenAi,
  onSelectStudent,
}) => {
  const { state } = useSchoolStore();
  const t = getTranslation(state.language);

  // Financial aggregates
  const totalFeesExpected = state.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalFeesCollected = state.invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalOutstanding = state.invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const collectionPercentage = Math.round((totalFeesCollected / (totalFeesExpected || 1)) * 100);

  // Live bus selected
  const [selectedBusId, setSelectedBusId] = useState<string>(state.buses[0]?.id || '');
  const activeBus = state.buses.find((b) => b.id === selectedBusId) || state.buses[0];

  return (
    <div className="space-y-6">
      {/* Executive Command Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-xl">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/src/assets/images/fga_kigali_campus_1794084880174.jpg"
            alt="FGA Kigali Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Live Campus Telemetry Active
              </span>
              <span className="text-xs text-slate-400">· Kigali Main & 2 Satellite Campuses</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Future Generation Academy Command Centre
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
              Institutional executive oversight of 1,000+ student capacity, academic rigor (NESA), real-time Gate 1 QR turnstiles, MTN MoMo fee collections, and Kigali bus transit routes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAi}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/10"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Academic Insights</span>
            </button>
            <button
              onClick={onOpenMoMo}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/10"
            >
              <Wallet className="w-4 h-4" />
              <span>Collect via MoMo</span>
            </button>
            <button
              onClick={onOpenScanner}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-600 rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Open Gate Scanner</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Enrolled Students</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-white tabular-nums">
                {state.students.length + 738}
              </span>
              <span className="text-xs text-emerald-400 font-semibold font-mono">/ 1,000 Capacity</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Kindergarten · Primary · Secondary
            </span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Daily Attendance Rate */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Today's Attendance Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                97.6%
              </span>
              <span className="text-xs text-slate-400 font-mono">Verified Entry</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {state.attendance.length} Turnstile Scans Today
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Fees Collected */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Fees Collected (RWF)</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-lg font-black font-mono text-amber-400 tabular-nums">
                RWF {(totalFeesCollected + 84500000).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-emerald-400 font-bold">{collectionPercentage}% settled</span>
              <span className="text-slate-500">· MoMo & Bank</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Active Bus Fleet */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Fleet Radar in Kigali</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-white tabular-nums">
                {state.buses.filter((b) => b.status === 'in_transit').length} / {state.buses.length}
              </span>
              <span className="text-xs text-sky-400 font-medium">Active Transit</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              GPS Tracking & Parent SMS
            </span>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Bus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Live Gate Stream & Transport Fleet Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Gate Check-ins & Security Alerts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gate 1 Turnstile Stream */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Gate 1 Turnstile & Attendance Stream</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time optical QR badge and RFID student passage log
                </p>
              </div>
              <button
                onClick={onOpenScanner}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                Scan Badge
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {state.attendance.slice(0, 5).map((att) => (
                <div key={att.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400 shrink-0">
                      {att.studentName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {att.studentName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {att.className}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate block">
                        Verified via {att.verificationMethod.toUpperCase()} · Recorded by {att.recordedBy}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      {att.timeIn || '07:30'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium capitalize">
                      {att.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Access Incidents */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Security & Gate Access Log</span>
              </h3>
              <span className="text-xs text-slate-400">Restricted Dispatch</span>
            </div>

            <div className="space-y-3">
              {state.incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      {incident.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{incident.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {incident.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-400">
                    <span>Location: {incident.location}</span>
                    <span className="text-emerald-400 font-semibold">
                      {incident.resolved ? '✓ Prevented & Resolved' : 'Active Investigation'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fleet GPS Radar & Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Kigali Bus Fleet Radar */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bus className="w-4 h-4 text-sky-400" />
                  <span>Kigali Transport Radar</span>
                </h3>
                <p className="text-xs text-slate-400">Real-time student bus tracking</p>
              </div>
              <span className="text-xs font-mono text-emerald-400">GPS LIVE</span>
            </div>

            {/* Bus Selectors */}
            <div className="space-y-2.5">
              {state.buses.map((bus) => (
                <button
                  key={bus.id}
                  onClick={() => setSelectedBusId(bus.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedBusId === bus.id
                      ? 'bg-sky-500/10 border-sky-500/50 ring-1 ring-sky-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{bus.plateNumber}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-mono">
                        {bus.model}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      {bus.currentSpeed} km/h
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Current Location: {bus.currentStop}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-800/60">
                    <span>Driver: {bus.driverName}</span>
                    <span>{bus.driverPhone}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Radar Mini Visual Map */}
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Route: Kicukiro ➔ Sonatubes ➔ Remera ➔ Gishushu</span>
                <span className="text-emerald-400 font-bold font-mono">ETA 8 mins</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
                <div className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full w-3/4 rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Kicukiro (06:45)</span>
                <span>Sonatubes (07:05)</span>
                <span>Main Campus Gate (07:25)</span>
              </div>
            </div>
          </div>

          {/* Quick Student Dossier Spotlight */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">Student Academic Roster</h3>
            <p className="text-xs text-slate-400">
              Quick access to digital profiles, QR badges, and official report cards
            </p>

            <div className="space-y-2">
              {state.students.slice(0, 4).map((student) => (
                <div
                  key={student.id}
                  onClick={() => onSelectStudent(student.id)}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.firstName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 truncate block">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block">
                        {student.className} · {student.regNumber}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
