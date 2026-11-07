import React from 'react';
import { useSchoolStore } from '../data/store';
import { getTranslation } from '../utils/translations';
import { ShieldCheck, QrCode, Globe, Users, Bell, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  onOpenRoleSwitcher: () => void;
  onOpenScanner: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAi: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRoleSwitcher,
  onOpenScanner,
  activeTab,
  setActiveTab,
  onOpenAi,
}) => {
  const { state, setLanguage } = useSchoolStore();
  const t = getTranslation(state.language);
  const user = state.currentUser;

  const urgentIncidentCount = state.incidents.filter((i) => !i.resolved && i.severity === 'high').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element with Crest) */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/src/assets/images/fga_academy_crest_1794084879975.jpg"
            alt="Future Generation Academy Crest"
            className="w-10 h-10 rounded-full border border-amber-500/40 object-cover shadow-sm shadow-amber-500/10"
          />
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
              FUTURE GENERATION ACADEMY
            </span>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide">
              Kigali · Rwanda
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            {t.commandCenter}
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'students' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Students & ID Cards
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'finance' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Finance & MoMo
          </button>
          <button
            onClick={() => setActiveTab('gate')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'gate' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Gate & Security
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'transport' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Fleet Radar
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/25 transition-colors cursor-pointer"
            title="Open AI Pedagogical & Tutor Assistant"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>AI Assistant</span>
          </button>

          {/* Quick QR Badge Scanner */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-500/25 transition-colors cursor-pointer"
            title="Scan Student or Visitor QR Badge"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.liveGateScan}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
            {(['EN', 'RW', 'FR'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                  state.language === lang
                    ? 'bg-slate-700 text-amber-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Role Switcher Button */}
          <button
            onClick={onOpenRoleSwitcher}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors text-left cursor-pointer group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-600 group-hover:border-amber-400/60"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white max-w-[110px] sm:max-w-[140px] truncate leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-amber-400/90 font-medium truncate leading-tight">
                {t.roles[user.role]}
              </span>
            </div>
            <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 ml-1" />
          </button>
        </div>
      </div>
    </header>
  );
};
