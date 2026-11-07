import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import { EducationLevel, Student } from '../../types';
import {
  UserPlus,
  CreditCard,
  CheckCircle2,
  Users,
  Building,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

interface AdmissionsDashboardProps {
  onOpenIdCard: (student: Student) => void;
}

export const AdmissionsDashboard: React.FC<AdmissionsDashboardProps> = ({ onOpenIdCard }) => {
  const { state, admitStudent } = useSchoolStore();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [level, setLevel] = useState<EducationLevel>('secondary');
  const [className, setClassName] = useState<string>('S4 PCB');
  const [dateOfBirth, setDateOfBirth] = useState<string>('2009-05-12');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [parentName, setParentName] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('+250 788 ');
  const [parentEmail, setParentEmail] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [bloodType, setBloodType] = useState<string>('O+');
  const [medicalNotes, setMedicalNotes] = useState<string>('No known allergies');

  const [admittedStudent, setAdmittedStudent] = useState<Student | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !parentPhone) return;

    const newStudent = admitStudent({
      firstName,
      lastName,
      level,
      className,
      dateOfBirth,
      gender,
      parentName: parentName || 'Guardian',
      parentPhone,
      parentEmail: parentEmail || 'guardian@fga.rw',
      nationalId: nationalId || '1200980098472811',
      avatar:
        gender === 'M'
          ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      campusId: 'camp-main',
      bloodType,
      medicalNotes,
      authorizedCollectors: [
        {
          name: parentName || 'Primary Guardian',
          relationship: 'Parent',
          phone: parentPhone,
          nationalId: nationalId || '1198270098472615',
        },
      ],
    });

    setAdmittedStudent(newStudent);
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
              Office of Admissions & Registrar
            </span>
            <span className="text-xs text-slate-400">· Future Generation Academy Kigali</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Student Registration & Enrolment</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Admission workflow, student ID badge generation with encrypted QR tokens, and grade stream allocation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registration Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-teal-400" />
            <span>New Student Registration Form</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">First Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thierry"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Last Name / Family Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mugabo"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Education Level:</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as EducationLevel)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="kindergarten">Kindergarten</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Class / Stream:</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="KG 3">KG 3</option>
                  <option value="P6 A">P6 A (Primary Leaving)</option>
                  <option value="S3 A">S3 A (Ordinary Level)</option>
                  <option value="S4 PCB">S4 PCB (Physics, Chem, Bio)</option>
                  <option value="S5 PCM">S5 PCM (Physics, Chem, Math)</option>
                  <option value="S6 MCB">S6 MCB (Math, Chem, Bio)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Date of Birth:</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Blood Group:</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block mb-2">
                Parent / Guardian Credentials
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Guardian Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Alice Mugabo"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Guardian Phone (MoMo):</label>
                  <input
                    type="tel"
                    required
                    placeholder="+250 788 123 456"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Medical Observations & Allergies:</label>
              <input
                type="text"
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="e.g. Mild asthma, peanut allergy, clear health"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Complete Admission & Generate Student ID Badge</span>
            </button>
          </form>
        </div>

        {/* Right Column: Admission Success & Capacity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {admittedStudent ? (
            <div className="bg-slate-900 border border-teal-500/50 rounded-xl p-5 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-teal-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Student Admitted Successfully!</h3>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student Name:</span>
                  <span className="font-bold text-white">
                    {admittedStudent.firstName} {admittedStudent.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Reg No:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {admittedStudent.regNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Class Allocated:</span>
                  <span className="font-semibold text-white">{admittedStudent.className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">RFID Smart UID:</span>
                  <span className="font-mono text-slate-300">{admittedStudent.rfidUid}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenIdCard(admittedStudent)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>View & Print Official Student ID Badge</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" />
                <span>Multi-Campus Capacity Overview</span>
              </h3>
              <p className="text-xs text-slate-400">
                Real-time quota distribution across Kigali branches
              </p>

              <div className="space-y-3 text-xs">
                {state.campuses.map((camp) => (
                  <div key={camp.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="flex justify-between font-bold text-white mb-1">
                      <span>{camp.name}</span>
                      <span className="text-emerald-400 font-mono">
                        {camp.studentCount} Students
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">{camp.address}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
