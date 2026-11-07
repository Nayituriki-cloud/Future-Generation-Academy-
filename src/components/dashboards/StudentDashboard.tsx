import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import { Student } from '../../types';
import {
  User,
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  CreditCard,
  Sparkles,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface StudentDashboardProps {
  onOpenReportCard: (student: Student) => void;
  onOpenIdCard: (student: Student) => void;
  onOpenAi: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenReportCard,
  onOpenIdCard,
  onOpenAi,
}) => {
  const { state } = useSchoolStore();
  const student = state.students[0]; // Kevin Habimana
  const myGrades = state.grades.filter((g) => g.studentId === student.id);

  // My borrowed books
  const myBorrowedBooks = state.libraryBooks.filter((b) =>
    b.borrowedHistory.some((h) => h.studentId === student.id && h.status === 'borrowed')
  );

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.firstName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Student Learning Portal
              </span>
              <span className="text-xs text-slate-400">· Future Generation Academy</span>
            </div>
            <h1 className="text-xl font-extrabold text-white">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Class: {student.className} · Reg: {student.regNumber} · Campus: Kigali Main (Gishushu)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAi}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-500/10"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Umwigisha AI Tutor</span>
          </button>
          <button
            onClick={() => onOpenReportCard(student)}
            className="px-3.5 py-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>My Term 1 Report Card</span>
          </button>
          <button
            onClick={() => onOpenIdCard(student)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>My Digital Student ID</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Timetable & Academic Marks (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Class Timetable Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>Today's Academic Schedule · S5 PCM</span>
                </h3>
                <p className="text-xs text-slate-400">Classroom: Sci-Lab-B (Main Wing)</p>
              </div>
              <span className="text-xs font-mono text-emerald-400">Term 1 · Week 6</span>
            </div>

            <div className="space-y-2.5">
              {[
                { time: '08:00 - 09:30', subject: 'Advanced Mathematics (Calculus)', teacher: 'Ms. Divine Mukamana', room: 'Sci-Lab-B', active: false },
                { time: '09:45 - 11:15', subject: 'Physics Laboratory (Mechanics)', teacher: 'Ms. Divine Mukamana', room: 'Physics Lab 1', active: true },
                { time: '11:30 - 13:00', subject: 'Organic Chemistry Practical', teacher: 'Dr. Fabrice Nkurunziza', room: 'Chemistry Lab', active: false },
                { time: '14:00 - 15:30', subject: 'Computer Science & AI Robotics', teacher: 'Eng. Emmanuel Mugisha', room: 'Tech Lab 2', active: false },
                { time: '15:45 - 16:30', subject: 'Ikinyarwanda & Umuco Nyarwanda', teacher: 'Mr. David Karemera', room: 'Room 204', active: false },
              ].map((period, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-4 text-xs transition-colors ${
                    period.active
                      ? 'bg-sky-500/10 border-sky-500/50 text-white ring-1 ring-sky-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-[11px] font-bold text-amber-400 w-24">
                      {period.time}
                    </div>
                    <div>
                      <span className="font-bold text-white block">{period.subject}</span>
                      <span className="text-[11px] text-slate-400">
                        {period.teacher} · {period.room}
                      </span>
                    </div>
                  </div>

                  {period.active && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-sky-500 text-slate-950">
                      NOW
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Academic Assessment Marks Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>My Assessment Marks (NESA Rwandan Scale)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {myGrades.map((g) => (
                <div
                  key={g.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white block">{g.subjectName}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[170px] block">
                      {g.teacherRemarks}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-base text-amber-400 block">
                      {g.score}/100
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                      Grade {g.gradeLetter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Library Books & Smart Tutor (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Library Borrowed Books Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>My Library Loans</span>
              </h3>
              <span className="text-xs text-slate-400">FGA Main Media Centre</span>
            </div>

            {myBorrowedBooks.length > 0 ? (
              <div className="space-y-2.5">
                {myBorrowedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex justify-between font-bold text-white">
                      <span>{book.title}</span>
                      <span className="text-amber-400 font-mono text-[11px]">Due Feb 15</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      Author: {book.author} · {book.shelfLocation}
                    </span>
                    <div className="flex justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                      <span>ISBN: {book.isbn}</span>
                      <span className="text-emerald-400">In Good Standing</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No books currently on loan.</p>
            )}
          </div>

          {/* AI Learning Assistant Teaser Card */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Need help with Physics or Math?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Umwigisha AI explains challenging concepts step-by-step in English, Kinyarwanda, or French with real Rwandan engineering examples.
            </p>
            <button
              onClick={onOpenAi}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Open Umwigisha AI Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
