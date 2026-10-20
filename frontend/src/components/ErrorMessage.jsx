import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorMessage({ message, onDismiss, isDark }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      id="calculator-error-banner"
      className={`mx-6 mb-3 p-3 rounded-2xl flex items-center justify-between gap-2.5 text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-top-2 border ${
        isDark
          ? 'bg-red-950/60 text-red-200 border-red-500/30 backdrop-blur-md'
          : 'bg-red-50 text-red-800 border-red-200 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
        <span className="truncate text-xs md:text-sm">{message}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className={`p-1 rounded-lg shrink-0 transition-colors ${
          isDark ? 'hover:bg-red-900/50 text-red-300' : 'hover:bg-red-100 text-red-600'
        }`}
        aria-label="Dismiss error"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
