import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import {
  Wallet,
  Smartphone,
  Plus,
  Printer,
  CheckCircle2,
  Users,
  DollarSign,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';

interface AccountantDashboardProps {
  onOpenMoMo: (invoiceId?: string) => void;
}

export const AccountantDashboard: React.FC<AccountantDashboardProps> = ({ onOpenMoMo }) => {
  const { state } = useSchoolStore();
  const [activeTab, setActiveTab] = useState<'invoices' | 'momo_ledger' | 'payroll'>('invoices');

  const totalCollected = state.invoices.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const totalBalanceDue = state.invoices.reduce((acc, curr) => acc + curr.balanceDue, 0);
  const totalPayroll = state.payroll.reduce((acc, curr) => acc + curr.netSalary, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Accountant Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Bursar & Finance Office
            </span>
            <span className="text-xs text-slate-400">· Future Generation Academy Kigali</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">
            Institutional Financial Administration
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Tuition fee invoicing, MTN MoMo / Airtel Money real-time settlements, staff payroll, and expenditure audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenMoMo()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-amber-500/10"
          >
            <Smartphone className="w-4 h-4" />
            <span>Process MoMo Payment</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-700"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Export Financial Report</span>
          </button>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Tuition Revenue (Term 1)</span>
          <span className="text-xl font-black font-mono text-emerald-400 mt-1 block">
            RWF {totalCollected.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            {state.payments.length} Mobile Money & Bank Transactions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block">Outstanding Balance Due</span>
          <span className="text-xl font-black font-mono text-amber-400 mt-1 block">
            RWF {totalBalanceDue.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Automated SMS Reminders Scheduled
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block">Monthly Faculty Payroll</span>
          <span className="text-xl font-black font-mono text-white mt-1 block">
            RWF {totalPayroll.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            {state.payroll.length} Staff Records Disbursed
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'invoices'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Student Fee Invoices</span>
        </button>
        <button
          onClick={() => setActiveTab('momo_ledger')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'momo_ledger'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>MoMo & Airtel Money Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'payroll'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Payroll Ledger</span>
        </button>
      </div>

      {/* Tab 1: Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Active Student Invoices</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Invoice No</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Class</th>
                  <th className="pb-3 text-right">Total (RWF)</th>
                  <th className="pb-3 text-right">Paid (RWF)</th>
                  <th className="pb-3 text-right">Balance Due</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {state.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 font-semibold text-white">{inv.studentName}</td>
                    <td className="py-3 text-slate-400">{inv.className}</td>
                    <td className="py-3 text-right font-mono text-slate-300">
                      {inv.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-emerald-400">
                      {inv.amountPaid.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-amber-400">
                      {inv.balanceDue.toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {inv.balanceDue > 0 ? (
                        <button
                          onClick={() => onOpenMoMo(inv.id)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Collect MoMo
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold">Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: MoMo Transaction Feed */}
      {activeTab === 'momo_ledger' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">
            Mobile Money Direct Transaction Settlement Journal
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Receipt No</th>
                  <th className="pb-3">Transaction Ref</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Provider</th>
                  <th className="pb-3">Payer Phone</th>
                  <th className="pb-3 text-right">Amount (RWF)</th>
                  <th className="pb-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {state.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-white">{p.receiptNumber}</td>
                    <td className="py-3 font-mono text-amber-400">{p.momoTransactionRef}</td>
                    <td className="py-3 font-semibold text-white">{p.studentName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px] font-bold">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-300">{p.phoneNumber || 'N/A'}</td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-400">
                      RWF {p.amount.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-400">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payroll */}
      {activeTab === 'payroll' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Staff Monthly Payroll Journal</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Employee Name</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Month</th>
                  <th className="pb-3 text-right">Base (RWF)</th>
                  <th className="pb-3 text-right">Allowances</th>
                  <th className="pb-3 text-right">Deductions</th>
                  <th className="pb-3 text-right">Net Salary</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {state.payroll.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-white">{pr.employeeName}</td>
                    <td className="py-3 text-slate-400">{pr.role}</td>
                    <td className="py-3 font-mono text-slate-300">{pr.month}</td>
                    <td className="py-3 text-right font-mono text-slate-300">
                      {pr.baseSalary.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-emerald-400">
                      +{pr.allowances.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-rose-400">
                      -{pr.deductions.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      RWF {pr.netSalary.toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                        {pr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
