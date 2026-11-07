import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import {
  HeartPulse,
  Droplet,
  Plus,
  AlertCircle,
  CheckCircle2,
  Phone,
  ShieldAlert,
} from 'lucide-react';

export const NurseDashboard: React.FC = () => {
  const { state, logClinicVisit } = useSchoolStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(state.students[0]?.id || '');
  const [symptoms, setSymptoms] = useState<string>('');
  const [treatment, setTreatment] = useState<string>('');
  const [medication, setMedication] = useState<string>('');
  const [status, setStatus] = useState<'treated_returned_to_class' | 'sent_home' | 'transferred_to_hospital'>('treated_returned_to_class');
  const [parentNotified, setParentNotified] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = state.students.find((s) => s.id === selectedStudentId);
    if (!student || !symptoms) return;

    logClinicVisit({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      className: student.className,
      symptoms,
      treatment: treatment || 'Observation in clinic bay with hydration',
      medicationGiven: medication || 'None required',
      parentNotified,
      status,
    });

    setSymptoms('');
    setTreatment('');
    setMedication('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
              School Health & First Aid Clinic
            </span>
            <span className="text-xs text-slate-400">· Future Generation Academy Kigali</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Student Health & Emergency Records</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Authorized student medical profiles, asthma/allergy alerts, treatment journals, and automated parent notifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Log Clinic Visit Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span>Log Clinic Attendance</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Select Student:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              >
                {state.students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.className}) · Blood: {s.bloodType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Observed Symptoms / Complaint:</label>
              <input
                type="text"
                required
                placeholder="e.g. Mild sports sprain, headache, fever"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Treatment Administered:</label>
              <input
                type="text"
                placeholder="e.g. Cold compress and 30m rest in observation bed"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Medication Given:</label>
              <input
                type="text"
                placeholder="e.g. Paracetamol 500mg, ORS, Salbutamol"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Outcome Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="treated_returned_to_class">Returned to Class</option>
                  <option value="sent_home">Sent Home with Guardian</option>
                  <option value="transferred_to_hospital">Transferred to CHUK / King Faisal</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Parent Notified?</label>
                <select
                  value={parentNotified ? 'true' : 'false'}
                  onChange={(e) => setParentNotified(e.target.value === 'true')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="true">Yes (SMS Dispatched)</option>
                  <option value="false">No (Minor Case)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Record Clinical Encounter</span>
            </button>
          </form>
        </div>

        {/* Clinical History & Allergy Alerts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Medical Records Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Recent Clinical Visits</h3>
            <div className="space-y-3">
              {state.clinicVisits.map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      {v.studentName} ({v.className})
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{v.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    <strong className="text-rose-400">Complaint:</strong> {v.symptoms}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">Treatment:</strong> {v.treatment} · Med: {v.medicationGiven}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                    <span className="text-emerald-400 font-semibold capitalize">
                      {v.status.replace(/_/g, ' ')}
                    </span>
                    <span>{v.parentNotified ? '✓ Guardian Notified' : 'Guardian Not Notified'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
