import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import CashCalculatorModal from './CashCalculatorModal';

interface CashAmountInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function CashAmountInput({
  value,
  onChange,
  disabled = false,
  placeholder = "Ingrese el monto"
}: CashAmountInputProps) {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <div className="relative">
      <input
        type="number"
        step="0.01"
        min="0"
        value={value === undefined ? '' : value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="input pl-8 pr-12 w-full"
        placeholder={placeholder}
        disabled={disabled}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500">$</span>
      </div>
      <button
        type="button"
        onClick={() => setShowCalculator(true)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        disabled={disabled}
      >
        <Calculator className="h-5 w-5" />
      </button>

      <CashCalculatorModal
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onConfirm={(amount) => {
          onChange(amount);
          setShowCalculator(false);
        }}
        initialAmount={value}
      />
    </div>
  );
}