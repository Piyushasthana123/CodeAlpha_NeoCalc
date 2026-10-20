import React from 'react';

export default function CalculatorButton({
  label,
  onClick,
  variant = 'number',
  span = 1,
  ariaLabel,
  isPressed = false,
  isDark = true,
  testId,
}) {
  // Determine variant-specific styling
  let variantStyles = '';
  if (variant === 'operator' || variant === 'equals') {
    variantStyles = 'operator-btn text-white text-2xl font-medium';
  } else if (variant === 'function') {
    variantStyles = isDark
      ? 'func-btn-dark text-slate-300 font-medium text-lg'
      : 'func-btn-light text-slate-700 font-medium text-lg';
  } else {
    // number
    variantStyles = isDark
      ? 'neumorph-btn-dark text-white font-medium text-xl'
      : 'neumorph-btn-light text-slate-800 font-medium text-xl';
  }

  const spanClass = span === 2 ? 'col-span-2 aspect-[2.1/1]' : 'aspect-square';
  const pressedClass = isPressed ? 'btn-pressed scale-[0.96]' : '';

  return (
    <button
      id={testId}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || (typeof label === 'string' ? label : 'Calculator button')}
      className={`relative select-none flex items-center justify-center rounded-[22px] transition-all duration-150 active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${spanClass} ${variantStyles} ${pressedClass}`}
    >
      <span className="relative z-10 flex items-center justify-center pointer-events-none">
        {label}
      </span>
    </button>
  );
}
