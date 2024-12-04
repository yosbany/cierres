import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  maxAmount: number;
  isSubmitting: boolean;
}

export default function AmountInput({
  value,
  onChange,
  maxAmount,
  isSubmitting
}: AmountInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Monto
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500">$</span>
        </div>
        <input
          type="number"
          step="0.01"
          min="0.01"
          max={maxAmount}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input pl-8"
          placeholder="Ingrese el monto a transferir"
          required
          disabled={isSubmitting}
        />
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Saldo disponible: {formatCurrency(maxAmount)}
      </p>
    </div>
  );
}