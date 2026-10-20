import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function Display({
  expression,
  result,
  livePreview,
  isDark = true,
}) {
  const [copied, setCopied] = useState(false);
  const exprScrollRef = useRef(null);

  // Auto-scroll expression container to the right as user types
  useEffect(() => {
    if (exprScrollRef.current) {
      exprScrollRef.current.scrollLeft = exprScrollRef.current.scrollWidth;
    }
  }, [expression]);

  const handleCopy = () => {
    const valueToCopy = result !== null && result !== undefined ? String(result) : expression;
    if (!valueToCopy) return;

    navigator.clipboard.writeText(valueToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Format expression for readability (spacing around operators)
  const formatExpression = (expr) => {
    if (!expr) return '';
    return expr
      .replace(/([+\-*/×÷−])/g, ' $1 ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Display value for primary number
  const displayResult = result !== null && result !== undefined
    ? String(result)
    : (livePreview !== null && livePreview !== undefined ? String(livePreview) : (expression ? '' : '0'));

  // Calculate dynamic font size based on result length
  const getResultFontSize = (val) => {
    const len = String(val).length;
    if (len > 14) return 'text-3xl md:text-4xl';
    if (len > 10) return 'text-4xl md:text-5xl';
    return 'text-5xl md:text-6xl';
  };

  return (
    <div className="relative px-7 pt-4 pb-6 flex flex-col justify-end min-h-[160px] select-text">
      {/* Top status: Expression & Copy Button */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div
          ref={exprScrollRef}
          id="calculator-expression"
          className={`flex-1 overflow-x-auto no-scrollbar font-mono text-base md:text-lg font-normal tracking-wide whitespace-nowrap text-right ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
          title="Current Expression"
        >
          {formatExpression(expression) || <span className="opacity-0">0</span>}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          id="copy-result-btn"
          disabled={!result && !expression}
          className={`p-1.5 rounded-lg transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/10'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          aria-label={copied ? 'Copied' : 'Copy result'}
          title="Copy result"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Large Result & Live Preview */}
      <div className="flex flex-col items-end justify-center w-full overflow-hidden">
        {/* If result is evaluated, show result cleanly. If user is still typing, show live preview if available */}
        <div
          id="calculator-result"
          className={`w-full font-sans font-semibold tracking-tight text-right overflow-x-auto no-scrollbar transition-all duration-150 ${getResultFontSize(displayResult)} ${
            isDark ? 'text-white' : 'text-slate-900'
          } ${result === null && livePreview !== null ? 'opacity-70' : 'opacity-100'}`}
        >
          {displayResult}
        </div>

        {/* Live preview badge when user is still composing an expression */}
        {result === null && livePreview !== null && expression && (
          <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide mt-1 text-orange-500/90 font-mono">
            <span>preview:</span>
            <span>{livePreview}</span>
          </div>
        )}
      </div>
    </div>
  );
}
