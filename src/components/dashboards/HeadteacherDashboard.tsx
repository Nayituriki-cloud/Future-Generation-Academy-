import React from 'react';
import { useSchoolStore } from '../../data/store';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  Users,
} from 'lucide-react';

export const HeadteacherDashboard: React.FC = () => {
  const { state } = useSchoolStore();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
              Office of the Headteacher & Director of Studies
            </span>
            <span className="text-xs text-slate-400">· Future Generation Academy</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Academic Affairs & NESA Compliance</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Curriculum oversight across Kindergarten, Primary (P1-P6) and Secondary (S1-S6), examination integrity, and teacher appraisals.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-xs text-emerald-400 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>NESA Accreditation Audit: 100% Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Classes & Enrolment Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span>Class Stream Enrolment & Faculty Allocations</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Stream Name</th>
                  <th className="pb-3">Level</th>
                  <th className="pb-3">Class Teacher</th>
                  <th className="pb-3 text-center">Room</th>
                  <th className="pb-3 text-right">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {state.classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-white">{cls.name}</td>
                    <td className="py-3 capitalize text-slate-400">{cls.level}</td>
                    <td className="py-3 text-slate-300">{cls.classTeacher}</td>
                    <td className="py-3 text-center font-mono text-amber-400">{cls.roomNumber}</td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-400">
                      {cls.enrolledCount} / {cls.capacity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NESA Compliance Documentation (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>NESA Rwanda Educational Compliance Checklist</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { title: 'NESA School Accreditation Documentation', status: 'Certified Valid', date: 'Valid through 2028' },
              { title: 'Authorized National Examination Records', status: 'Approved', date: 'Term 1 Schedule Filed' },
              { title: 'Rwanda Data Protection & Privacy Act Compliance', status: 'Compliant', date: 'Encrypted Records' },
              { title: 'Competence-Based Curriculum (CBC) Rubrics', status: 'Active', date: 'Reviewed Weekly' },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">{doc.title}</span>
                  <span className="text-[10px] text-slate-500">{doc.date}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
