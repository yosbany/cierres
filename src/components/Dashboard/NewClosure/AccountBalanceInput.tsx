import React from 'react';
import { PredefinedAccount } from '../../../types';
import { Wallet, CreditCard } from 'lucide-react';

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || parseFloat(newValue) >= 0) {
      onChange(newValue);
    }
  };

  const getAccountIcon = () => {
    return account.type === 'efectivo' ? (
      <Wallet className="h-5 w-5 text-green-500" />
    ) : (
      <CreditCard className="h-5 w-5 text-purple-500" />
    );
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
              (Saldo anterior: ${previousBalance.toLocaleString('es-AR')})
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
              className="input pl-8 w-full"
              required
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}