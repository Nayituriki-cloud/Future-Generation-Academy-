import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import {
  Library,
  BookOpen,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
} from 'lucide-react';

export const LibrarianDashboard: React.FC = () => {
  const { state, borrowLibraryBook, returnLibraryBook } = useSchoolStore();
  const [selectedBookId, setSelectedBookId] = useState<string>(state.libraryBooks[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(state.students[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const filteredBooks = state.libraryBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery)
  );

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    const success = borrowLibraryBook(selectedBookId, selectedStudentId);
    if (success) {
      const student = state.students.find((s) => s.id === selectedStudentId);
      const book = state.libraryBooks.find((b) => b.id === selectedBookId);
      setFeedback(`Book '${book?.title}' issued successfully to ${student?.firstName} ${student?.lastName}! Due in 14 days.`);
    } else {
      setFeedback('Unable to issue book: No available copies or invalid selection.');
    }
  };

  const handleReturn = (bookId: string, studentId: string) => {
    const success = returnLibraryBook(bookId, studentId);
    if (success) {
      setFeedback('Book checked in and returned to library inventory.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Digital Library & Media Centre
            </span>
            <span className="text-xs text-slate-400">· Future Generation Academy Kigali</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Media Catalogue & Book Circulation</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Barcode/QR loans, automated 14-day due date tracking, NESA curriculum textbooks, and digital reading history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Circulation Desk Form (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Circulation Terminal</span>
          </h3>

          <form onSubmit={handleBorrow} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Select Student:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                {state.students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.className} · {s.regNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Select Book Title:</label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                {state.libraryBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} (Available: {b.availableCopies}/{b.totalCopies})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>Issue Book (14-Day Loan)</span>
            </button>
          </form>

          {feedback && (
            <div className="p-3 bg-slate-950 border border-blue-500/30 rounded-lg text-xs text-blue-300 flex items-start gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {/* Books Catalogue Table (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white">Curriculum Textbooks & Reference Media</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ISBN, title, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 w-56 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Book Title & Author</th>
                  <th className="pb-3">Shelf</th>
                  <th className="pb-3 text-center">Available</th>
                  <th className="pb-3">Active Borrowers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBooks.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="py-3">
                      <span className="font-bold text-white block">{b.title}</span>
                      <span className="text-[11px] text-slate-400">
                        {b.author} · ISBN {b.isbn}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-300">{b.shelfLocation}</td>
                    <td className="py-3 text-center font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          b.availableCopies > 0
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {b.availableCopies} / {b.totalCopies}
                      </span>
                    </td>
                    <td className="py-3">
                      {b.borrowedHistory.filter((h) => h.status === 'borrowed').length > 0 ? (
                        <div className="space-y-1">
                          {b.borrowedHistory
                            .filter((h) => h.status === 'borrowed')
                            .map((bh, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px]">
                                <span className="text-amber-400 font-semibold">{bh.studentName}</span>
                                <button
                                  onClick={() => handleReturn(b.id, bh.studentId)}
                                  className="text-slate-400 hover:text-white underline cursor-pointer"
                                >
                                  Return Book
                                </button>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">None on loan</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
