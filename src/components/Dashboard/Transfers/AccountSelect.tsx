import React from 'react';
import { Account } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { Wallet, CreditCard } from 'lucide-react';

interface AccountSelectProps {
  label: string;
  accounts: Account[];
  value: string;
  onChange: (value: string) => void;
  disabledId?: string;
  isSubmitting: boolean;
}

export default function AccountSelect({
  label,
  accounts,
  value,
  onChange,
  disabledId,
  isSubmitting
}: AccountSelectProps) {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'efectivo':
        return <Wallet className="h-4 w-4 text-green-600" />;
      case 'banco':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      case 'credito':
        return <CreditCard className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input pl-8"
          required
          disabled={isSubmitting}
        >
          <option value="">Seleccionar cuenta</option>
          {accounts.map(account => (
            <option 
              key={account.id} 
              value={account.id}
              disabled={account.id === disabledId}
            >
              {account.name} ({formatCurrency(account.currentBalance)})
            </option>
          ))}
        </select>
        {value && (
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            {getAccountIcon(accounts.find(acc => acc.id === value)?.type || '')}
          </div>
        )}
      </div>
    </div>
  );
}