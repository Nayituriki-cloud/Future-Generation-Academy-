import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import {
  KeyRound,
  Users,
  Building,
  ShieldAlert,
  Database,
  RefreshCw,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { state, resetAllData } = useSchoolStore();
  const [resetMessage, setResetMessage] = useState<string>('');

  const handleReset = () => {
    if (window.confirm('Reset all demo school data to initial Kigali campus seed state?')) {
      resetAllData();
      setResetMessage('Database restored to official Future Generation Academy seed state.');
      setTimeout(() => setResetMessage(''), 4000);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'fga_kigali_database_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
              System Administration & Core Infrastructure
            </span>
            <span className="text-xs text-slate-400">· Future Generation Academy</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Super Administrator Control Console</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Role-Based Access Control (RBAC), multi-branch campus network, security logs, and database backups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-700"
          >
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Export JSON Database</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Database</span>
          </button>
        </div>
      </div>

      {resetMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Users & Accounts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Institutional User Accounts & Role Permissions ({state.users.length} Active Accounts)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">User</th>
                <th className="pb-3">Assigned Role</th>
                <th className="pb-3">Official Title</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {state.users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="py-3 flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="font-bold text-white">{u.name}</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-indigo-500/20 text-indigo-400">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{u.title}</td>
                  <td className="py-3 font-mono text-slate-400">{u.email}</td>
                  <td className="py-3 font-mono text-slate-300">{u.phone}</td>
                  <td className="py-3 text-center">
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Campus Administration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-amber-400" />
          <span>Multi-Campus Network Administration</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {state.campuses.map((camp) => (
            <div key={camp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white block">{camp.name}</span>
              <p className="text-[11px] text-slate-400">{camp.address}</p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 flex justify-between">
                <span>Principal: {camp.principal}</span>
                <span className="font-mono text-emerald-400 font-bold">{camp.studentCount} Students</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
