import React, { useState, useEffect, useCallback } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import ErrorMessage from './ErrorMessage';
import { calculateExpression } from '../services/api';
import { playClickSound } from '../services/sound';

export default function Calculator({
  onCalculationSuccess,
  isDark = true,
  soundEnabled = true,
  externalExpression = null,
  externalResult = null,
  onExternalUsed = () => {},
}) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [livePreview, setLivePreview] = useState(null);
  const [error, setError] = useState(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Play sound if enabled
  const triggerSound = useCallback((type = 'default') => {
    if (soundEnabled) {
      playClickSound(type);
    }
  }, [soundEnabled]);

  // Handle external expression or result injection from history panel
  useEffect(() => {
    if (externalExpression !== null) {
      setExpression(externalExpression);
      setResult(null);
      setIsEvaluated(false);
      setError(null);
      onExternalUsed();
    }
  }, [externalExpression, onExternalUsed]);

  useEffect(() => {
    if (externalResult !== null) {
      setExpression(String(externalResult));
      setResult(externalResult);
      setIsEvaluated(true);
      setError(null);
      onExternalUsed();
    }
  }, [externalResult, onExternalUsed]);

  // Helper: check if last character of string is an operator
  const isOperator = (ch) => ['+', '−', '-', '×', '*', '÷', '/'].includes(ch);

  // Calculate live preview safely on frontend without spamming network
  useEffect(() => {
    if (!expression || isEvaluated) {
      setLivePreview(null);
      return;
    }

    const clean = expression.trim();
    const lastChar = clean[clean.length - 1];

    // Don't preview if ends with operator or decimal
    if (isOperator(lastChar) || lastChar === '.') {
      setLivePreview(null);
      return;
    }

    // Only preview if there's at least one operator
    const hasOp = /[+\-−×*÷/]/.test(clean.slice(1));
    if (!hasOp) {
      setLivePreview(null);
      return;
    }

    try {
      // Normalize symbols for preview
      const sanitized = clean
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      // Check for division by zero before evaluation
      if (/\/0(?![.\d])/.test(sanitized)) {
        setLivePreview(null);
        return;
      }

      // Safe arithmetic evaluator for basic expressions
      if (/^[0-9+\-*/().\s]+$/.test(sanitized)) {
        // eslint-disable-next-line no-new-func
        const res = Function(`"use strict"; return (${sanitized})`)();
        if (typeof res === 'number' && isFinite(res)) {
          const rounded = Math.round(res * 1e10) / 1e10;
          setLivePreview(rounded);
        } else {
          setLivePreview(null);
        }
      } else {
        setLivePreview(null);
      }
    } catch {
      setLivePreview(null);
    }
  }, [expression, isEvaluated]);

  // Digit Input
  const handleDigit = useCallback((digit) => {
    triggerSound('default');
    setError(null);

    if (isEvaluated) {
      // Begin new calculation
      setExpression(digit);
      setResult(null);
      setIsEvaluated(false);
      return;
    }

    setExpression((prev) => {
      // If current expression is just "0", replace with digit
      if (prev === '0') return digit;
      return prev + digit;
    });
  }, [isEvaluated, triggerSound]);

  // Operator Input (+, −, ×, ÷)
  const handleOperator = useCallback((op) => {
    triggerSound('operator');
    setError(null);

    // If previous calculation evaluated, continue calculating with its result
    if (isEvaluated && result !== null) {
      setExpression(`${result}${op}`);
      setResult(null);
      setIsEvaluated(false);
      return;
    }

    setExpression((prev) => {
      if (!prev) {
        // Allow leading minus for negative numbers
        if (op === '−' || op === '-') return '−';
        return `0${op}`;
      }

      const lastChar = prev[prev.length - 1];

      // If last char is an operator, replace it to avoid consecutive operators
      if (isOperator(lastChar)) {
        return prev.slice(0, -1) + op;
      }

      return prev + op;
    });
  }, [isEvaluated, result, triggerSound]);

  // Decimal Point Input
  const handleDecimal = useCallback(() => {
    triggerSound('default');
    setError(null);

    if (isEvaluated) {
      setExpression('0.');
      setResult(null);
      setIsEvaluated(false);
      return;
    }

    setExpression((prev) => {
      if (!prev) return '0.';

      const lastChar = prev[prev.length - 1];
      if (isOperator(lastChar)) {
        return prev + '0.';
      }

      // Find the last number token
      const tokens = prev.split(/[+\-−×*÷/]/);
      const currentToken = tokens[tokens.length - 1];

      // If current token already has a decimal, reject additional decimal points
      if (currentToken.includes('.')) {
        return prev;
      }

      return prev + '.';
    });
  }, [isEvaluated, triggerSound]);

  // Backspace (⌫)
  const handleBackspace = useCallback(() => {
    triggerSound('default');
    setError(null);

    if (isEvaluated) {
      setExpression('');
      setResult(null);
      setIsEvaluated(false);
      return;
    }

    setExpression((prev) => {
      if (!prev) return '';
      return prev.slice(0, -1);
    });
  }, [isEvaluated, triggerSound]);

  // Clear All (AC)
  const handleClear = useCallback(() => {
    triggerSound('clear');
    setExpression('');
    setResult(null);
    setLivePreview(null);
    setError(null);
    setIsEvaluated(false);
  }, [triggerSound]);

  // Percentage (%)
  const handlePercentage = useCallback(() => {
    triggerSound('default');
    setError(null);

    if (!expression) return;

    // Check if ending with operator
    const lastChar = expression[expression.length - 1];
    if (isOperator(lastChar)) return;

    // Split tokens to find last operand
    const tokens = expression.split(/([+\-−×*÷/])/);
    const lastToken = tokens[tokens.length - 1];
    const num = parseFloat(lastToken);

    if (!isNaN(num)) {
      const percentVal = String(num / 100);
      tokens[tokens.length - 1] = percentVal;
      setExpression(tokens.join(''));
    }
  }, [expression, triggerSound]);

  // Equals Calculation (=)
  const handleEquals = useCallback(async () => {
    triggerSound('equals');

    if (!expression || !expression.trim()) {
      return;
    }

    const clean = expression.trim();
    const lastChar = clean[clean.length - 1];

    // Validation: incomplete expression
    if (isOperator(lastChar)) {
      setError('Incomplete expression');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await calculateExpression(clean);
      setResult(data.result);
      setIsEvaluated(true);
      setLivePreview(null);
      if (onCalculationSuccess) {
        onCalculationSuccess();
      }
    } catch (err) {
      setError(err.message || 'Calculation error');
    } finally {
      setIsLoading(false);
    }
  }, [expression, onCalculationSuccess, triggerSound]);

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if focus is inside an input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key;

      if (['Enter', '=', 'Backspace', 'Escape', '/'].includes(key)) {
        e.preventDefault();
      }

      setActiveKey(key);

      if (key >= '0' && key <= '9') {
        handleDigit(key);
      } else if (key === '+') {
        handleOperator('+');
      } else if (key === '-') {
        handleOperator('−');
      } else if (key === '*' || key === 'x' || key === 'X') {
        handleOperator('×');
      } else if (key === '/') {
        handleOperator('÷');
      } else if (key === '.') {
        handleDecimal();
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
      } else if (key === '%') {
        handlePercentage();
      }
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    handleDigit,
    handleOperator,
    handleDecimal,
    handleEquals,
    handleBackspace,
    handleClear,
    handlePercentage,
  ]);

  return (
    <div
      id="calculator-card"
      className={`relative w-full max-w-[390px] rounded-[44px] transition-all duration-300 backdrop-blur-xl border ${
        isDark
          ? 'bg-[#151922]/95 border-white/10 calc-shadow-dark'
          : 'bg-[#ffffff]/95 border-slate-200/80 calc-shadow-light'
      }`}
    >
      {/* Top subtle acoustic bar / speaker grill accent matching reference */}
      <div className="pt-4 pb-1 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-orange-500 animate-ping' : 'bg-orange-500/80'}`} />
          <span className={`text-[11px] font-mono tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            NeoCalc
          </span>
        </div>
        <div className={`text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {isEvaluated ? 'READY' : (expression ? 'INPUT' : 'STANDBY')}
        </div>
      </div>

      {/* Screen Display */}
      <Display
        expression={expression}
        result={result}
        livePreview={livePreview}
        isDark={isDark}
      />

      {/* Error Message if any */}
      <ErrorMessage
        message={error}
        onDismiss={() => setError(null)}
        isDark={isDark}
      />

      {/* Keypad */}
      <Keypad
        onDigit={handleDigit}
        onOperator={handleOperator}
        onDecimal={handleDecimal}
        onEquals={handleEquals}
        onClear={handleClear}
        onBackspace={handleBackspace}
        onPercentage={handlePercentage}
        activeKey={activeKey}
        isDark={isDark}
      />
    </div>
  );
}
