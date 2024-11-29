import React from 'react';
import { PredefinedAccount } from '../../../types';
import AccountBalanceInput from './AccountBalanceInput';
import DateSelector from './DateSelector';

interface NewClosureFormProps {
  date: string;
  onDateChange: (date: string) => void;
  accounts: PredefinedAccount[];
  selectedAccounts: Array<{
    accountId: string;
    initialBalance: string;
  }>;
  onAccountChange: (index: number, field: 'accountId' | 'initialBalance', value: string) => void;
  isSubmitting: boolean;
  lastClosureDate: string | null;
  previousBalances: Record<string, number>;
}

export default function NewClosureForm({
  date,
  onDateChange,
  accounts,
  selectedAccounts,
  onAccountChange,
  isSubmitting,
  lastClosureDate,
  previousBalances
}: NewClosureFormProps) {
  const totalBalance = selectedAccounts.reduce((sum, account) => {
    const balance = parseFloat(account.initialBalance) || 0;
    return sum + balance;
  }, 0);

  const cashAccounts = accounts.filter(account => account.type === 'efectivo');
  const bankAccounts = accounts.filter(account => account.type === 'banco');

  return (
    <div className="space-y-6">
      <DateSelector
        date={date}
        onDateChange={onDateChange}
        isSubmitting={isSubmitting}
        lastClosureDate={lastClosureDate}
      />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h4 className="text-lg font-medium text-gray-900">Saldos Iniciales</h4>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-500">Balance Total:</span>{' '}
            <span className={`font-medium ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalBalance.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {cashAccounts.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-3">Efectivo</h5>
              <div className="space-y-3">
                {cashAccounts.map((account, index) => (
                  <AccountBalanceInput
                    key={account.id}
                    account={account}
                    value={selectedAccounts[index]?.initialBalance || ''}
                    previousBalance={previousBalances[account.id] || 0}
                    onChange={(value) => onAccountChange(index, 'initialBalance', value)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>
          )}

          {bankAccounts.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-3">Banco</h5>
              <div className="space-y-3">
                {bankAccounts.map((account, index) => (
                  <AccountBalanceInput
                    key={account.id}
                    account={account}
                    value={selectedAccounts[cashAccounts.length + index]?.initialBalance || ''}
                    previousBalance={previousBalances[account.id] || 0}
                    onChange={(value) => onAccountChange(cashAccounts.length + index, 'initialBalance', value)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}