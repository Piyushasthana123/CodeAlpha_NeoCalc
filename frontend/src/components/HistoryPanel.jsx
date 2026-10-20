import React, { useState } from 'react';
import { History, Trash2, ArrowUpRight, Clock, X } from 'lucide-react';

export default function HistoryPanel({
  history = [],
  onSelectExpression,
  onSelectResult,
  onClearHistory,
  onClose,
  isDark = true,
}) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearClick = () => {
    if (confirmClear) {
      onClearHistory();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const formatTimestamp = (isoStr) => {
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      id="history-panel"
      className={`flex flex-col h-full transition-colors duration-300 ${
        isDark ? 'text-slate-200' : 'text-slate-800'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDark ? 'border-white/10' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-orange-500" />
          <h2 className="font-semibold text-base tracking-wide">History</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
            isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-600'
          }`}>
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {history.length > 0 && (
            <button
              type="button"
              id="clear-history-btn"
              onClick={handleClearClick}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                confirmClear
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                  : isDark
                  ? 'hover:bg-red-500/20 text-slate-400 hover:text-red-400'
                  : 'hover:bg-red-50 text-slate-500 hover:text-red-600'
              }`}
              title={confirmClear ? 'Click again to confirm clear' : 'Clear History'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{confirmClear ? 'Confirm?' : 'Clear'}</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              id="close-history-btn"
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors ${
                isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
              aria-label="Close history"
              title="Close history panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 opacity-50">
            <Clock className="w-10 h-10 mb-2 stroke-1" />
            <p className="text-sm font-medium">No calculations yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Your calculation history will appear here automatically.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`group p-3.5 rounded-2xl border transition-all duration-200 ${
                isDark
                  ? 'bg-calc-dark-key/50 border-white/5 hover:border-orange-500/30 hover:bg-calc-dark-key'
                  : 'bg-white border-slate-200/80 hover:border-orange-400/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(item.timestamp)}
                </span>
                <span className="opacity-0 group-hover:opacity-100 text-[10px] text-orange-500 transition-opacity">
                  Click to reuse
                </span>
              </div>

              {/* Expression */}
              <button
                type="button"
                onClick={() => onSelectExpression(item.expression)}
                className="w-full text-left font-mono text-xs md:text-sm text-slate-400 hover:text-orange-400 transition-colors truncate block"
                title={`Reuse expression: ${item.expression}`}
              >
                {item.expression} =
              </button>

              {/* Result */}
              <div className="flex items-baseline justify-between mt-1">
                <button
                  type="button"
                  onClick={() => onSelectResult(item.result)}
                  className="font-sans font-semibold text-lg md:text-xl text-left tracking-tight hover:text-orange-500 transition-colors"
                  title={`Reuse result: ${item.result}`}
                >
                  {item.result}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectResult(item.result)}
                  className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                    isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'
                  }`}
                  title="Use result in calculator"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
