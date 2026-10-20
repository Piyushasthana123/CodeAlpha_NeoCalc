import React, { useState, useEffect, useCallback, useRef } from 'react';
import { History, Volume2, VolumeX, Keyboard, X } from 'lucide-react';
import Calculator from './components/Calculator';
import HistoryPanel from './components/HistoryPanel';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import { getHistory, clearHistory } from './services/api';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('neocalc_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('neocalc_sound');
    return saved !== null ? saved === 'true' : true;
  });

  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const historyPanelRef = useRef(null);

  // States to pass historical data to calculator
  const [externalExpression, setExternalExpression] = useState(null);
  const [externalResult, setExternalResult] = useState(null);

  // Sync theme with document class and localStorage
  useEffect(() => {
    localStorage.setItem('neocalc_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Sync sound preference
  useEffect(() => {
    localStorage.setItem('neocalc_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Close modals or history on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showKeyboardHelp) {
          setShowKeyboardHelp(false);
        } else if (isHistoryOpen) {
          setIsHistoryOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showKeyboardHelp, isHistoryOpen]);

  // Smooth scroll into view when history opens on mobile screens
  useEffect(() => {
    if (isHistoryOpen && window.innerWidth < 1024) {
      const timer = setTimeout(() => {
        historyPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isHistoryOpen]);

  // Load history on mount
  const refreshHistory = useCallback(async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const handleSelectExpression = (expr) => {
    setExternalExpression(expr);
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectResult = (res) => {
    setExternalResult(res);
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden flex flex-col justify-between selection:bg-orange-500 selection:text-white transition-colors duration-500 ${
        isDark ? 'bg-[#0b0e14] text-slate-100' : 'bg-[#eef2f8] text-slate-900'
      }`}
    >
      {/* Ambient background glow elements (matches glowing orange rings in reference image) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] transition-opacity duration-1000 ${
            isDark ? 'bg-orange-600/15' : 'bg-orange-400/20'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-28 w-80 h-80 rounded-full blur-[100px] transition-opacity duration-1000 ${
            isDark ? 'bg-orange-500/10' : 'bg-orange-300/25'
          }`}
        />
        <div
          className={`absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-[140px] transition-opacity duration-1000 ${
            isDark ? 'bg-blue-600/10' : 'bg-blue-300/20'
          }`}
        />
        {/* Soft decorative accent outline rings matching prompt mockup */}
        <div className="absolute top-12 -right-16 w-64 h-64 rounded-full border-4 border-orange-500/20 pointer-events-none hidden lg:block" />
        <div className="absolute -bottom-10 left-12 w-48 h-48 rounded-full border-4 border-orange-500/20 pointer-events-none hidden lg:block" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white font-bold text-lg">
            =
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              NeoCalc
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 font-mono font-medium border border-orange-500/20">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              FastAPI + React Math Engine
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            id="sound-toggle-btn"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-2.5 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
              isDark
                ? 'bg-calc-dark-key text-slate-300 hover:bg-calc-dark-keyHover hover:text-white shadow-btn-dark'
                : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-black shadow-btn-light'
            }`}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            title={soundEnabled ? 'Mute click sound' : 'Enable tactile click sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-orange-500" /> : <VolumeX className="w-5 h-5 opacity-60" />}
          </button>

          {/* Keyboard Help Toggle */}
          <button
            type="button"
            id="keyboard-help-btn"
            onClick={() => setShowKeyboardHelp(true)}
            className={`p-2.5 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
              isDark
                ? 'bg-calc-dark-key text-slate-300 hover:bg-calc-dark-keyHover hover:text-white shadow-btn-dark'
                : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-black shadow-btn-light'
            }`}
            aria-label="Keyboard Shortcuts"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-5 h-5" />
          </button>

          {/* History Panel Toggle Button */}
          <button
            type="button"
            id="toggle-history-btn"
            onClick={() => setIsHistoryOpen((prev) => !prev)}
            className={`relative p-2.5 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
              isHistoryOpen
                ? 'bg-orange-500 text-white shadow-glow-orange-light'
                : isDark
                ? 'bg-calc-dark-key text-slate-300 hover:bg-calc-dark-keyHover hover:text-white shadow-btn-dark'
                : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-black shadow-btn-light'
            }`}
            aria-expanded={isHistoryOpen}
            aria-label={isHistoryOpen ? 'Close calculation history' : 'Open calculation history'}
            title={isHistoryOpen ? 'Close History' : 'View History'}
          >
            <History className="w-5 h-5" />
            {history.length > 0 && !isHistoryOpen && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {history.length}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 my-auto transition-all duration-300">
        {/* Centered Calculator Section */}
        <div className="flex flex-col items-center justify-center w-full max-w-[390px] transition-all duration-300">
          <Calculator
            onCalculationSuccess={refreshHistory}
            isDark={isDark}
            soundEnabled={soundEnabled}
            externalExpression={externalExpression}
            externalResult={externalResult}
            onExternalUsed={() => {
              setExternalExpression(null);
              setExternalResult(null);
            }}
          />
        </div>

        {/* History Panel: Visible ONLY when isHistoryOpen is true (desktop and mobile) */}
        {isHistoryOpen && (
          <div
            ref={historyPanelRef}
            className={`history-card-animate w-full max-w-sm rounded-[36px] transition-all duration-300 backdrop-blur-xl border flex flex-col h-[650px] ${
              isDark
                ? 'bg-[#151922]/90 border-white/10 calc-shadow-dark'
                : 'bg-white/90 border-slate-200/80 calc-shadow-light'
            }`}
          >
            <HistoryPanel
              history={history}
              onSelectExpression={handleSelectExpression}
              onSelectResult={handleSelectResult}
              onClearHistory={handleClearHistory}
              onClose={() => setIsHistoryOpen(false)}
              isDark={isDark}
            />
          </div>
        )}
      </main>

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardHelp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowKeyboardHelp(false)}
        >
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all ${
              isDark ? 'bg-[#181c26] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-lg">Keyboard Shortcuts</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyboardHelp(false)}
                className={`p-1.5 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className={`p-2.5 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="font-sans text-slate-400">Numbers</span>
                <kbd className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">0 – 9</kbd>
              </div>
              <div className={`p-2.5 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="font-sans text-slate-400">Addition</span>
                <kbd className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">+</kbd>
              </div>
              <div className={`p-2.5 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="font-sans text-slate-400">Subtraction</span>
                <kbd className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">-</kbd>
              </div>
              <div className={`p-2.5 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="font-sans text-slate-400">Multiply</span>
                <kbd className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">* or x</kbd>
              </div>
              <div className={`p-2.5 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="font-sans text-slate-400">Divide</span>
                <kbd className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">/</kbd>
              </div>
              <div className={`p-2.5 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="font-sans text-slate-400">Decimal</span>
                <kbd className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">.</kbd>
              </div>
              <div className={`p-2.5 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="font-sans text-slate-400">Calculate</span>
                <kbd className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">Enter or =</kbd>
              </div>
              <div className={`p-2.5 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="font-sans text-slate-400">Backspace</span>
                <kbd className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">⌫</kbd>
              </div>
              <div className={`p-2.5 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="font-sans text-slate-400">Clear All</span>
                <kbd className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">Esc</kbd>
              </div>
              <div className={`p-2.5 rounded-xl flex items-center justify-between ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="font-sans text-slate-400">Percent</span>
                <kbd className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">%</kbd>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowKeyboardHelp(false)}
                className="px-5 py-2 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-glow-orange-light"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rich Interactive Footer */}
      <Footer
        isDark={isDark}
        onOpenKeyboardHelp={() => setShowKeyboardHelp(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen((prev) => !prev)}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />
    </div>
  );
}
