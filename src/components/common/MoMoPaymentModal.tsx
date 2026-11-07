import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import { FeeInvoice, PaymentRecord } from '../../types';
import { X, Smartphone, CheckCircle2, ShieldCheck, Printer, ArrowRight } from 'lucide-react';

interface MoMoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetInvoice?: FeeInvoice;
}

export const MoMoPaymentModal: React.FC<MoMoPaymentModalProps> = ({
  isOpen,
  onClose,
  targetInvoice,
}) => {
  const { state, processMoMoPayment } = useSchoolStore();
  const invoices = state.invoices.filter((i) => i.balanceDue > 0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    targetInvoice ? targetInvoice.id : invoices[0]?.id || ''
  );
  const [provider, setProvider] = useState<'MTN MoMo' | 'Airtel Money'>('MTN MoMo');
  const [phoneNumber, setPhoneNumber] = useState<string>('0788667788');
  const [amount, setAmount] = useState<number>(() => {
    const inv = invoices.find((i) => i.id === selectedInvoiceId) || targetInvoice;
    return inv ? inv.balanceDue : 150000;
  });

  const [step, setStep] = useState<'form' | 'push_prompt' | 'success'>('form');
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [completedPayment, setCompletedPayment] = useState<PaymentRecord | null>(null);

  if (!isOpen) return null;

  const currentInvoice = state.invoices.find((i) => i.id === selectedInvoiceId) || targetInvoice;

  const handleInitiatePush = () => {
    if (!currentInvoice || amount <= 0) return;
    setStep('push_prompt');
  };

  const handleConfirmPin = () => {
    if (enteredPin.length < 4) return;
    const payment = processMoMoPayment(currentInvoice!.id, amount, phoneNumber, provider);
    if (payment) {
      setCompletedPayment(payment);
      setStep('success');
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${provider === 'MTN MoMo' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Mobile Money School Fee Gateway
              </h2>
              <p className="text-xs text-slate-400">
                Direct Integration · MTN MoMo (*182#) & Airtel Money (*500#)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setStep('form');
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'form' && (
            <div className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Mobile Payment Network:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProvider('MTN MoMo')}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      provider === 'MTN MoMo'
                        ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/30'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block text-amber-400">MTN MoMo</span>
                      <span className="text-[11px] text-slate-400">Rwanda · *182#</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-amber-400 flex items-center justify-center">
                      {provider === 'MTN MoMo' && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('Airtel Money')}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      provider === 'Airtel Money'
                        ? 'bg-red-500/10 border-red-500 text-white ring-1 ring-red-500/30'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block text-red-400">Airtel Money</span>
                      <span className="text-[11px] text-slate-400">Rwanda · *500#</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-red-400 flex items-center justify-center">
                      {provider === 'Airtel Money' && <div className="w-2 h-2 rounded-full bg-red-400" />}
                    </div>
                  </button>
                </div>
              </div>

              {/* Student Invoice Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Target Fee Invoice:
                </label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => {
                    setSelectedInvoiceId(e.target.value);
                    const inv = state.invoices.find((i) => i.id === e.target.value);
                    if (inv) setAmount(inv.balanceDue);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {state.invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} · {inv.studentName} ({inv.className}) — Balance: RWF{' '}
                      {inv.balanceDue.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Rwandan Phone Number (Registered for MoMo):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-mono text-slate-400">
                    +250
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber.replace(/^\+?250/, '')}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="788 123 456"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-16 pr-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Example: 0788 667 788 or 0738 901 234
                </span>
              </div>

              {/* Payment Amount */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Amount to Pay (RWF):
                  </label>
                  {currentInvoice && (
                    <button
                      type="button"
                      onClick={() => setAmount(currentInvoice.balanceDue)}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Pay Full Balance (RWF {currentInvoice.balanceDue.toLocaleString()})
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">
                    RWF
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-14 pr-3.5 py-2.5 text-xs font-bold font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleInitiatePush}
                disabled={amount <= 0}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 mt-2"
              >
                <span>Send USSD Push Notification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'push_prompt' && (
            <div className="space-y-4 py-2">
              <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 text-center space-y-3">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono">
                  {provider} PUSH SIMULATION (*182#)
                </div>
                <p className="text-sm text-slate-200">
                  A payment authorization prompt has been pushed to:
                </p>
                <p className="text-base font-bold font-mono text-white">
                  +250 {phoneNumber}
                </p>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payee:</span>
                    <span className="font-semibold text-white">Future Generation Academy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student:</span>
                    <span className="text-white">{currentInvoice?.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount:</span>
                    <span className="font-bold text-amber-400">
                      RWF {amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Enter your 4-digit MoMo PIN to authorize:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="••••"
                    className="w-36 mx-auto text-center tracking-widest text-lg font-bold bg-slate-900 border border-slate-700 rounded-xl py-2 text-white focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPin}
                  disabled={enteredPin.length < 4}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Pay</span>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && completedPayment && (
            <div className="space-y-4 py-2 text-center animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Payment Approved & Recorded
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  RWF {completedPayment.amount.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-400">
                  Invoice settled for {completedPayment.studentName}
                </p>
              </div>

              {/* Official Electronic Receipt Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Receipt No:</span>
                  <span className="text-white font-bold">{completedPayment.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MoMo Ref:</span>
                  <span className="text-amber-400">{completedPayment.momoTransactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Network:</span>
                  <span className="text-white">{completedPayment.paymentMethod} Rwanda</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-white">{completedPayment.date}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-white">
                  <span>Balance Remaining:</span>
                  <span className="text-emerald-400">
                    RWF {(currentInvoice?.balanceDue || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
