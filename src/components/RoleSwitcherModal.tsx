import React from 'react';
import { useSchoolStore } from '../data/store';
import { UserRole } from '../types';
import { getTranslation } from '../utils/translations';
import { X, Check, ShieldCheck, Award, GraduationCap, BookOpen, User, Wallet, UserPlus, Library, HeartPulse, Bus, KeyRound } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  super_admin: <KeyRound className="w-5 h-5 text-indigo-400" />,
  director: <Award className="w-5 h-5 text-amber-400" />,
  headteacher: <GraduationCap className="w-5 h-5 text-sky-400" />,
  teacher: <BookOpen className="w-5 h-5 text-emerald-400" />,
  student: <User className="w-5 h-5 text-purple-400" />,
  parent: <HeartPulse className="w-5 h-5 text-pink-400" />,
  accountant: <Wallet className="w-5 h-5 text-yellow-400" />,
  admissions: <UserPlus className="w-5 h-5 text-teal-400" />,
  librarian: <Library className="w-5 h-5 text-blue-400" />,
  nurse: <HeartPulse className="w-5 h-5 text-red-400" />,
  transport: <Bus className="w-5 h-5 text-orange-400" />,
  security: <ShieldCheck className="w-5 h-5 text-rose-400" />,
};

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { state, switchUser } = useSchoolStore();
  const t = getTranslation(state.language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{t.switchRole}</span>
              <span className="text-xs font-normal text-slate-400">· 12 Institutional Roles</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any persona to inspect their personalized dashboard, authorized permissions, and live workflows.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {state.users.map((account) => {
            const isSelected = state.currentUser.role === account.role;
            return (
              <button
                key={account.id}
                onClick={() => {
                  switchUser(account.role);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/30'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-600"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-slate-900 p-0.5 rounded-full border border-slate-700">
                      {ROLE_ICONS[account.role]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">
                        {account.name}
                      </span>
                      {isSelected && (
                        <span className="flex items-center text-[10px] font-semibold text-amber-400 bg-amber-400/15 px-1.5 py-0.5 rounded">
                          <Check className="w-3 h-3 mr-0.5" /> Active
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-amber-400/90 block truncate mt-0.5">
                      {t.roles[account.role]}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                      {account.title}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-750 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{account.email}</span>
                  <span className="text-[10px] font-mono text-slate-400">{account.phone}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Future Generation Academy · Kigali Multi-Campus Access Control System</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
