import React from 'react';
import { useSchoolStore } from '../../data/store';
import { Student } from '../../types';
import { X, Printer, Award, FileCheck, CheckCircle } from 'lucide-react';

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { state } = useSchoolStore();

  if (!isOpen) return null;

  // Get student's grades
  const studentGrades = state.grades.filter((g) => g.studentId === student.id);
  const subjects = studentGrades.length > 0 ? studentGrades : state.grades.slice(0, 6);

  const totalScore = subjects.reduce((sum, s) => sum + s.score, 0);
  const averageScore = Math.round(totalScore / (subjects.length || 1));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl my-4">
        {/* Header toolbar */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Official Academic Bulletin · Rwanda NESA Standard</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 bg-white text-slate-900 font-sans print-container">
          {/* Institution Header Lockup */}
          <div className="border-b-2 border-slate-900 pb-5 mb-5 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/src/assets/images/fga_academy_crest_1794084879975.jpg"
                alt="FGA Crest"
                className="w-18 h-18 rounded-full border border-slate-900 object-cover"
              />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                  Republic of Rwanda · Ministry of Education (NESA Aligned)
                </span>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  FUTURE GENERATION ACADEMY
                </h1>
                <p className="text-xs text-slate-600 font-serif italic">
                  "Educating Today, Leading Tomorrow" · Kigali Main Campus (Gishushu)
                </p>
                <p className="text-[11px] text-slate-500">
                  PO Box 4812 Kigali, Rwanda · admissions@fga.rw · +250 788 112 233
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border border-slate-900 px-3 py-1 rounded text-center">
                <span className="text-[10px] font-mono uppercase block text-slate-500">Academic Term</span>
                <span className="text-xs font-bold text-slate-900">Term 1 · 2026</span>
              </div>
            </div>
          </div>

          {/* Student Profile Info Bar */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs mb-6">
            <div>
              <span className="text-slate-500 block text-[10px]">Student Full Name:</span>
              <span className="font-bold text-slate-900">
                {student.firstName} {student.lastName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Registration No:</span>
              <span className="font-mono font-bold text-slate-900">{student.regNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Class / Stream:</span>
              <span className="font-bold text-slate-900">{student.className}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Term Attendance:</span>
              <span className="font-bold text-emerald-700">{student.attendanceRate}% (Exemplary)</span>
            </div>
          </div>

          {/* Grades Table */}
          <table className="w-full text-xs border-collapse border border-slate-300 mb-6">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 text-left font-bold">
                <th className="p-2 border-r border-slate-300">Subject Name</th>
                <th className="p-2 text-center border-r border-slate-300">Marks (/100)</th>
                <th className="p-2 text-center border-r border-slate-300">Grade</th>
                <th className="p-2 text-center border-r border-slate-300">Classification</th>
                <th className="p-2">Educator Remarks</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((item, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-2 font-medium border-r border-slate-200">{item.subjectName}</td>
                  <td className="p-2 text-center font-mono font-bold border-r border-slate-200">
                    {item.score}
                  </td>
                  <td className="p-2 text-center font-bold border-r border-slate-200">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                        item.score >= 80
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {item.gradeLetter}
                    </span>
                  </td>
                  <td className="p-2 text-center text-[11px] text-slate-600 border-r border-slate-200">
                    {item.score >= 80 ? 'Distinction' : item.score >= 70 ? 'Very Good' : 'Credit'}
                  </td>
                  <td className="p-2 text-slate-700 text-[11px]">{item.teacherRemarks}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <td className="p-2 border-r border-slate-300">Overall Term Average</td>
                <td className="p-2 text-center font-mono text-emerald-800 text-sm border-r border-slate-300">
                  {averageScore}%
                </td>
                <td className="p-2 text-center border-r border-slate-300">
                  {averageScore >= 80 ? 'A' : 'B'}
                </td>
                <td className="p-2 text-center border-r border-slate-300">
                  {averageScore >= 80 ? 'Distinction I' : 'Division II'}
                </td>
                <td className="p-2 text-slate-800">
                  Class Standing: Rank 2 / 30 Students
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Conduct & Dean Remarks */}
          <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-lg p-3 text-xs mb-6">
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase mb-1">
                Class Teacher Remarks:
              </span>
              <p className="text-slate-800 leading-relaxed italic">
                "{student.firstName} continues to exhibit superior intellect, self-discipline, and peer leadership. An asset to the Future Generation Academy community."
              </p>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase mb-1">
                Headteacher Certification:
              </span>
              <p className="text-slate-800 leading-relaxed italic">
                "Promoted in full academic standing. Commended for academic excellence in alignment with national education criteria."
              </p>
            </div>
          </div>

          {/* Signature & Seal Area */}
          <div className="flex items-end justify-between pt-6 border-t border-slate-200 text-xs">
            <div className="text-center">
              <div className="h-10 border-b border-slate-400 w-44 mx-auto mb-1 flex items-center justify-center font-serif text-slate-600 italic">
                Ms. Divine Mukamana
              </div>
              <span className="text-[11px] text-slate-500">Class Dean Signature</span>
            </div>

            <div className="text-center">
              <div className="w-18 h-18 border-2 border-amber-600/60 rounded-full mx-auto flex flex-col items-center justify-center text-[8px] font-mono text-amber-800 uppercase tracking-tighter transform -rotate-12">
                <span>★ FGA KIGALI ★</span>
                <span className="font-bold">OFFICIAL</span>
                <span>SEAL · 2026</span>
              </div>
            </div>

            <div className="text-center">
              <div className="h-10 border-b border-slate-400 w-44 mx-auto mb-1 flex items-center justify-center font-serif text-slate-600 italic">
                Mr. Patrick Nshimiyimana
              </div>
              <span className="text-[11px] text-slate-500">Headteacher & Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
