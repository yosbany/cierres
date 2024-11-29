import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface DenominationInputProps {
  value: number;
  quantity: number;
  onChange: (quantity: number) => void;
  type: 'bill' | 'coin';
  onEnterPress?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function DenominationInput({
  value,
  quantity,
  onChange,
  type,
  onEnterPress,
  inputRef
}: DenominationInputProps) {
  const subtotal = value * quantity;
  const bgColor = type === 'bill' ? 'bg-green-100' : 'bg-blue-100';
  const textColor = type === 'bill' ? 'text-green-700' : 'text-blue-700';
  const borderColor = type === 'bill' ? 'focus:border-green-500' : 'focus:border-blue-500';
  const ringColor = type === 'bill' ? 'focus:ring-green-500' : 'focus:ring-blue-500';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0);
    onChange(value === '' ? 0 : value);
  };

  return (
    <div className={`grid grid-cols-[1fr_120px] items-center gap-4 p-4 ${bgColor} rounded-lg`}>
      <div className="flex flex-col">
        <span className={`text-xl font-semibold ${textColor}`}>
          {formatCurrency(value)}
        </span>
        <span className={`text-sm ${textColor} opacity-75`}>
          Subtotal: {formatCurrency(subtotal)}
        </span>
      </div>
      <div>
        <input
          ref={inputRef}
          type="number"
          min="0"
          value={quantity === 0 ? '' : quantity}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-3 text-lg border rounded-md shadow-sm ${borderColor} ${ringColor} focus:ring-2 focus:ring-opacity-50 bg-white text-center font-medium`}
          placeholder="0"
        />
      </div>
    </div>
  );
}