import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import { GradeRecord, Student } from '../../types';
import {
  BookOpen,
  CheckCircle,
  Plus,
  GraduationCap,
  Calendar,
  Sparkles,
  ClipboardList,
  Clock,
  UserCheck,
} from 'lucide-react';

interface TeacherDashboardProps {
  onOpenAi: () => void;
  onOpenReportCard: (student: Student) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onOpenAi,
  onOpenReportCard,
}) => {
  const { state, addStudentGrade, recordGateAttendanceScan } = useSchoolStore();
  const teacher = state.currentUser;

  // Filter students in S5 PCM
  const classStudents = state.students.filter(
    (s) => s.className.includes('S5') || s.className.includes('S4') || s.className.includes('S6')
  );

  const [activeTab, setActiveTab] = useState<'gradebook' | 'attendance' | 'lessons'>('gradebook');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(classStudents[0]?.id || '');
  const [subjectName, setSubjectName] = useState<string>('Physics & Applied Mechanics');
  const [score, setScore] = useState<number>(88);
  const [remarks, setRemarks] = useState<string>('Strong conceptual grasp and analytical rigor.');

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || score < 0 || score > 100) return;

    let gradeLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' = 'A';
    if (score < 40) gradeLetter = 'F';
    else if (score < 50) gradeLetter = 'E';
    else if (score < 60) gradeLetter = 'D';
    else if (score < 70) gradeLetter = 'C';
    else if (score < 80) gradeLetter = 'B';

    addStudentGrade({
      studentId: selectedStudentId,
      examId: 'exm-term1',
      subjectId: 'sub-phy',
      subjectName,
      score,
      gradeLetter,
      teacherRemarks: remarks,
    });

    setRemarks('Consistent effort in lab work.');
  };

  return (
    <div className="space-y-6">
      {/* Teacher Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Academic Faculty Portal
              </span>
              <span className="text-xs text-slate-400">· Senior STEM Department</span>
            </div>
            <h1 className="text-xl font-extrabold text-white">{teacher.name}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Assigned Class: S5 PCM (30 Students) · Advanced Physics & Calculus
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAi}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-500/10"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Student Analysis</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('gradebook')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'gradebook'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Class Gradebook (NESA Standard)</span>
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Daily Classroom Register</span>
        </button>
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'lessons'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curriculum & Assignments</span>
        </button>
      </div>

      {/* Gradebook View */}
      {activeTab === 'gradebook' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Grade Entry Form (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Record Student Marks</span>
            </h3>

            <form onSubmit={handleSaveGrade} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Select Student:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {classStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Subject Name:
                </label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Score (/100):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Educator Remarks:
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Save Official Grade
              </button>
            </form>
          </div>

          {/* Grades Table (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Class Examination Marks Ledger</h3>
                <p className="text-xs text-slate-400">
                  Term 1 Assessment Records · Rwandan Grading Rubric (A = 80-100%)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Subject</th>
                    <th className="pb-3 text-center">Score</th>
                    <th className="pb-3 text-center">Grade</th>
                    <th className="pb-3">Remarks</th>
                    <th className="pb-3 text-right">Bulletin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {state.grades.map((g) => {
                    const student = state.students.find((s) => s.id === g.studentId);
                    return (
                      <tr key={g.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 font-bold text-white">
                          {student?.firstName} {student?.lastName}
                        </td>
                        <td className="py-2.5 text-slate-300">{g.subjectName}</td>
                        <td className="py-2.5 text-center font-mono font-bold text-white">
                          {g.score}
                        </td>
                        <td className="py-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              g.gradeLetter === 'A'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {g.gradeLetter}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-400 max-w-xs truncate">
                          {g.teacherRemarks}
                        </td>
                        <td className="py-2.5 text-right">
                          {student && (
                            <button
                              onClick={() => onOpenReportCard(student)}
                              className="text-amber-400 hover:underline font-semibold cursor-pointer"
                            >
                              Report Card
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Register View */}
      {activeTab === 'attendance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Daily Classroom Attendance Register · S5 PCM
              </h3>
              <p className="text-xs text-slate-400">
                Synchronized with Gate 1 biometric turnstiles
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              Date: 2026-02-07
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">ID Reg Number</th>
                  <th className="pb-3 text-center">Gate Arrival</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {classStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="py-3 flex items-center gap-2.5">
                      <img
                        src={s.avatar}
                        alt={s.firstName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="font-bold text-white">
                        {s.firstName} {s.lastName}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-400">{s.regNumber}</td>
                    <td className="py-3 text-center font-mono text-emerald-400">07:18 AM</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-400">
                        Present
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => recordGateAttendanceScan(s.id, 'check_in')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Confirm Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Curriculum & Assignments View */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">Term 1 STEM Syllabus Progress</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Unit 4: Mechanics & Rotational Dynamics</span>
                  <span className="text-emerald-400 font-mono">Completed</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Angular momentum, moments of inertia, and real torque calculations.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Unit 5: Electromagnetism & Induction</span>
                  <span className="text-amber-400 font-mono">In Progress (Week 6)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Faraday's laws, Lenz's law, and Kigali power grid transformer design.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Unit 6: Optics & Wave Interference</span>
                  <span className="text-slate-500 font-mono">Upcoming</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Young's double slit experiments and optical fiber physics.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">Active Assignments Due</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Assignment 03: Calculus Differential Models</span>
                  <span className="text-rose-400 font-mono">Due Feb 12</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Solve problem sets 14 through 28 in Tranter Mathematics.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Physics Lab Report: Pendulum Gravitational Constant</span>
                  <span className="text-amber-400 font-mono">Due Feb 15</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Submit formal laboratory notebook with error bar calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
