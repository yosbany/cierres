import React, { useState } from 'react';
import { PredefinedAccount } from '../../../types';
import { Wallet, CreditCard, Calculator } from 'lucide-react';
import CashCalculatorModal from '../../CashCalculator/CashCalculatorModal';
import { formatCurrency } from '../../../utils/formatters';

interface AccountBalanceInputProps {
  account: PredefinedAccount;
  value: string;
  previousBalance: number;
  onChange: (value: string) => void;
  disabled: boolean;
}

export default function AccountBalanceInput({
  account,
  value,
  previousBalance,
  onChange,
  disabled
}: AccountBalanceInputProps) {
  const [showCalculator, setShowCalculator] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || parseFloat(newValue) >= 0) {
      // Format to 2 decimal places
      const formattedValue = newValue === '' ? '' : Number(parseFloat(newValue).toFixed(2)).toString();
      onChange(formattedValue);
    }
  };

  const getAccountIcon = () => {
    switch (account.type) {
      case 'efectivo':
        return <Wallet className="h-5 w-5 text-green-500" />;
      case 'banco':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case 'credito':
        return <CreditCard className="h-5 w-5 text-orange-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              {getAccountIcon()}
              <label className="text-sm font-medium text-gray-700">
                {account.name}
              </label>
            </div>
            <span className={`text-sm ${previousBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              (Saldo anterior: {formatCurrency(previousBalance)})
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ingrese el saldo inicial"
              value={value}
              onChange={handleChange}
              className="input pl-8 pr-12 w-full"
              required
              disabled={disabled}
            />
            {account.type === 'efectivo' && (
              <button
                type="button"
                onClick={() => setShowCalculator(true)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={disabled}
              >
                <Calculator className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <CashCalculatorModal
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onConfirm={(amount) => {
          onChange(amount.toFixed(2));
          setShowCalculator(false);
        }}
        initialAmount={value ? parseFloat(value) : undefined}
      />
    </div>
  );
}