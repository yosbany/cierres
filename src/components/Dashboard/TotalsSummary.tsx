import React, { useMemo } from 'react';
import { Account, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface TotalsSummaryProps {
  accounts: Account[];
  transactions?: Transaction[];
  finalBalance: number;
}

export default function TotalsSummary({ 
  accounts, 
  transactions = [], 
  finalBalance 
}: TotalsSummaryProps) {
  const { cashTotal, bankTotal } = useMemo(() => {
    // Create a map of account types for faster lookup
    const accountTypes = new Map(accounts.map(account => [account.id, account.type]));
    
    // Initialize totals with initial balances
    const totals = accounts.reduce(
      (acc, account) => {
        if (account.type === 'efectivo') {
          acc.cashTotal += account.currentBalance;
        } else if (account.type === 'banco') {
          acc.bankTotal += account.currentBalance;
        }
        return acc;
      },
      { cashTotal: 0, bankTotal: 0 }
    );

    return totals;
  }, [accounts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Total Efectivo</h4>
        <p className={`text-2xl font-semibold ${cashTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(cashTotal)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Total Banco</h4>
        <p className={`text-2xl font-semibold ${bankTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(bankTotal)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Saldo Final</h4>
        <p className={`text-2xl font-semibold ${finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(finalBalance)}
        </p>
      </div>
    </div>
  );
}