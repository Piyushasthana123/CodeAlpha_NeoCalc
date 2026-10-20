import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={onToggle}
      className={`relative p-2.5 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
        isDark
          ? 'bg-calc-dark-key text-yellow-400 hover:bg-calc-dark-keyHover shadow-btn-dark'
          : 'bg-white text-orange-500 hover:bg-slate-50 shadow-btn-light'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>
    </button>
  );
}
