import React from 'react';
import {
  Activity,
  Cpu,
  Keyboard,
  History,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  Layers,
  Heart,
  Sparkles,
  Terminal,
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({
  isDark = true,
  onOpenKeyboardHelp,
  soundEnabled = true,
  onToggleSound,
  historyCount = 0,
  onOpenHistory,
  onToggleTheme,
}) {
  return (
    <footer
      id="site-footer"
      className={`relative z-10 w-full mt-16 border-t transition-colors duration-300 ${
        isDark
          ? 'bg-[#0e121a]/80 border-white/10 text-slate-400'
          : 'bg-white/70 border-slate-200/80 text-slate-600'
      } backdrop-blur-xl`}
    >
      {/* Decorative top ambient line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-8">
        {/* Top Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/5 dark:border-white/5 border-slate-200">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/25 text-white font-bold text-lg">
                =
              </div>
              <div>
                <span className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  NeoCalc
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 font-mono font-medium border border-orange-500/20">
                    v1.0
                  </span>
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 dark:text-slate-400">
              High-precision scientific & standard calculator combining tactile neumorphic aesthetics with a lightning-fast FastAPI mathematical computation engine.
            </p>

            {/* Live Engine Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>API Engine Online</span>
            </div>
          </div>

          {/* Column 2: Tech Stack / Architecture */}
          <div className="space-y-3">
            <h4 className={`text-xs font-mono font-semibold tracking-wider uppercase ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>FastAPI Python Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>SQLite Local History DB</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                <span>React 19 + Vite HMR</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Tailwind CSS Neumorphism</span>
              </li>
              <li className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Web Audio Synthesizer</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Tools & Controls */}
          <div className="space-y-3">
            <h4 className={`text-xs font-mono font-semibold tracking-wider uppercase ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Quick Tools
            </h4>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={onOpenKeyboardHelp}
                className={`text-left text-xs py-1.5 px-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Keyboard className="w-3.5 h-3.5 text-orange-500" />
                  Shortcuts Guide
                </span>
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10">?</kbd>
              </button>

              <button
                type="button"
                onClick={onOpenHistory}
                className={`text-left text-xs py-1.5 px-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-orange-500" />
                  Calculation History
                </span>
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-orange-500 text-white font-bold">
                    {historyCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onToggleSound}
                className={`text-left text-xs py-1.5 px-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-orange-500" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 opacity-50" />
                  )}
                  Tactile Audio Click
                </span>
                <span className={`text-[10px] font-mono ${soundEnabled ? 'text-orange-500 font-semibold' : 'opacity-60'}`}>
                  {soundEnabled ? 'ON' : 'MUTED'}
                </span>
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                className={`text-left text-xs py-1.5 px-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isDark ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  )}
                  Theme Appearance
                </span>
                <span className="text-[10px] font-mono uppercase opacity-75">
                  {isDark ? 'Dark' : 'Light'}
                </span>
              </button>
            </div>
          </div>

          {/* Column 4: Engine Capabilities & Specs */}
          <div className="space-y-3">
            <h4 className={`text-xs font-mono font-semibold tracking-wider uppercase ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Engine Specs
            </h4>
            <div className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
              isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Precision</span>
                <span className="font-mono font-medium text-orange-500">IEEE 754 64-bit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Preview</span>
                <span className="font-mono font-medium">Real-time AST</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Persistence</span>
                <span className="font-mono font-medium">SQLite WAL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Keypad</span>
                <span className="font-mono font-medium">Full Keyboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges Strip */}
        <div className="py-6 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-white/5 dark:border-white/5 border-slate-200">
          <div className="flex items-center gap-2.5 text-xs">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Ultra-Fast</p>
              <p className="text-[11px] text-slate-400">Instant evaluation</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Safe Arithmetic</p>
              <p className="text-[11px] text-slate-400">Zero-division guard</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <History className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Auto-Saved</p>
              <p className="text-[11px] text-slate-400">Local history records</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Full Control</p>
              <p className="text-[11px] text-slate-400">Keyboard shortcuts</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>&copy; {CURRENT_YEAR} NeoCalc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline animate-pulse" />
            <span>by</span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Piyush Asthana
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
