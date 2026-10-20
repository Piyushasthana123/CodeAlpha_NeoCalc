import React from 'react';
import { Delete } from 'lucide-react';
import CalculatorButton from './CalculatorButton';

export default function Keypad({
  onDigit,
  onOperator,
  onDecimal,
  onEquals,
  onClear,
  onBackspace,
  onPercentage,
  activeKey = null,
  isDark = true,
}) {
  return (
    <div className="grid grid-cols-4 gap-3 px-6 pb-6">
      {/* Row 1 */}
      <CalculatorButton
        label="AC"
        onClick={onClear}
        variant="function"
        isDark={isDark}
        isPressed={activeKey === 'Escape' || activeKey === 'c' || activeKey === 'C'}
        ariaLabel="Clear All"
        testId="btn-ac"
      />
      <CalculatorButton
        label={<Delete className="w-5 h-5" />}
        onClick={onBackspace}
        variant="function"
        isDark={isDark}
        isPressed={activeKey === 'Backspace'}
        ariaLabel="Backspace"
        testId="btn-backspace"
      />
      <CalculatorButton
        label="%"
        onClick={onPercentage}
        variant="function"
        isDark={isDark}
        isPressed={activeKey === '%'}
        ariaLabel="Percentage"
        testId="btn-percentage"
      />
      <CalculatorButton
        label="÷"
        onClick={() => onOperator('÷')}
        variant="operator"
        isDark={isDark}
        isPressed={activeKey === '/'}
        ariaLabel="Divide"
        testId="btn-divide"
      />

      {/* Row 2 */}
      <CalculatorButton
        label="7"
        onClick={() => onDigit('7')}
        variant="number"
        isDark={isDark}
        isPressed={activeKey === '7'}
        ariaLabel="7"
        testId="btn-7"
      />
      <CalculatorButton
        label="8"
        onClick={() => onDigit('8')}
        variant="number"
        isDark={isDark}
        isPressed={activeKey === '8'}
        ariaLabel="8"
        testId="btn-8"
      />
      <CalculatorButton
        label="9"
        onClick={() => onDigit('9')}
        variant="number"
        isDark={isDark}
        isPressed={activeKey === '9'}
        ariaLabel="9"
        testId="btn-9"
      />
      <CalculatorButton
        label="×"
        onClick={() => onOperator('×')}
        variant="operator"
        isDark={isDark}
        isPressed={activeKey === '*' || activeKey === 'x' || activeKey === 'X'}
        ariaLabel="Multiply"
        testId="btn-multiply"
      />

      {/* Row 3 */}
      <CalculatorButton
        label="4"
        onClick={() => onDigit('4')}
        variant="number"
        isDark={isDark}
        isPressed={activeKey === '4'}
        ariaLabel="4"
        testId="btn-4"
      />
      <CalculatorButton
        label="5"
        onClick={() => onDigit('5')}
        variant="number"
        isDark={isDark}
        isPressed={activeKey === '5'}
        ariaLabel="5"
        testId="btn-5"
      />
      <CalculatorButton
        label="6"
        onClick={() => onDigit('6')}
        variant="number"
        isDark={isDark}
        isPressed={activeKey === '6'}
        ariaLabel="6"
        testId="btn-6"
      />
      <CalculatorButton
        label="−"
        onClick={() => onOperator('−')}
        variant="operator"
        isDark={isDark}
        isPressed={activeKey === '-'}
        ariaLabel="Subtract"
        testId="btn-subtract"
      />

      {/* Row 4 */}
      <CalculatorButton
        label="1"
        onClick={() => onDigit('1')}
        variant="number"
        isDark={isDark}
        isPressed={activeKey === '1'}
        ariaLabel="1"
        testId="btn-1"
      />
      <CalculatorButton
        label="2"
        onClick={() => onDigit('2')}
        variant="number"
        isDark={isDark}
        isPressed={activeKey === '2'}
        ariaLabel="2"
        testId="btn-2"
      />
      <CalculatorButton
        label="3"
        onClick={() => onDigit('3')}
        variant="number"
        isDark={isDark}
        isPressed={activeKey === '3'}
        ariaLabel="3"
        testId="btn-3"
      />
      <CalculatorButton
        label="+"
        onClick={() => onOperator('+')}
        variant="operator"
        isDark={isDark}
        isPressed={activeKey === '+'}
        ariaLabel="Add"
        testId="btn-add"
      />

      {/* Row 5 */}
      <CalculatorButton
        label="0"
        onClick={() => onDigit('0')}
        variant="number"
        span={2}
        isDark={isDark}
        isPressed={activeKey === '0'}
        ariaLabel="0"
        testId="btn-0"
      />
      <CalculatorButton
        label="."
        onClick={onDecimal}
        variant="number"
        isDark={isDark}
        isPressed={activeKey === '.'}
        ariaLabel="Decimal Point"
        testId="btn-decimal"
      />
      <CalculatorButton
        label="="
        onClick={onEquals}
        variant="equals"
        isDark={isDark}
        isPressed={activeKey === 'Enter' || activeKey === '='}
        ariaLabel="Equals"
        testId="btn-equals"
      />
    </div>
  );
}
