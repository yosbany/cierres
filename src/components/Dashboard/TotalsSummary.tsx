import React, { useMemo } from 'react';
import { Account, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Wallet, CreditCard, Coins, TrendingUp } from 'lucide-react';

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
  const { cashTotal, bankTotal, creditTotal } = useMemo(() => {
    const totals = accounts.reduce(
      (acc, account) => {
        if (account.type === 'efectivo') {
          acc.cashTotal += account.currentBalance;
        } else if (account.type === 'banco') {
          acc.bankTotal += account.currentBalance;
        } else if (account.type === 'credito') {
          acc.creditTotal += account.currentBalance;
        }
        return acc;
      },
      { cashTotal: 0, bankTotal: 0, creditTotal: 0 }
    );

    return totals;
  }, [accounts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm border border-green-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Coins className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-800">Total Efectivo</h4>
            <p className={`text-2xl font-bold ${cashTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(cashTotal)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-purple-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <CreditCard className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-purple-800">Total Banco</h4>
            <p className={`text-2xl font-bold ${bankTotal >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
              {formatCurrency(bankTotal)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm border border-orange-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Wallet className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-orange-800">Total Crédito</h4>
            <p className={`text-2xl font-bold ${creditTotal >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
              {formatCurrency(creditTotal)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 rounded-lg shadow-sm border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Balance Total</h4>
            <p className={`text-2xl font-bold ${finalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(finalBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}