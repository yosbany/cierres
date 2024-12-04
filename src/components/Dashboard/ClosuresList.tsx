import React from 'react';
import { DailyClosure } from '../../types';
import { ChevronRight, Coins, CreditCard, Calendar } from 'lucide-react';
import { formatDate, getCurrentDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatters';

interface ClosuresListProps {
  closures: DailyClosure[];
  onClosureClick: (closure: DailyClosure) => void;
}

export default function ClosuresList({ closures, onClosureClick }: ClosuresListProps) {
  const today = getCurrentDate();

  const calculateBalances = (closure: DailyClosure) => {
    return closure.accounts.reduce(
      (acc, account) => {
        if (account.type === 'efectivo') {
          acc.cashBalance += account.currentBalance;
        } else if (account.type === 'banco') {
          acc.bankBalance += account.currentBalance;
        } else if (account.type === 'credito') {
          acc.creditBalance += account.currentBalance;
        }
        return acc;
      },
      { cashBalance: 0, bankBalance: 0, creditBalance: 0 }
    );
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {closures.map((closure, index) => {
          const { cashBalance, bankBalance, creditBalance } = calculateBalances(closure);
          const isToday = closure.date === today;
          const isFirstClosure = index === 0;
          
          return (
            <button
              key={closure.id}
              onClick={() => onClosureClick(closure)}
              className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                isToday ? 'bg-blue-50 hover:bg-blue-100' : ''
              } ${isFirstClosure ? 'border-b-4 border-gray-200' : ''}`}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {isToday && (
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    )}
                    <span className={`text-lg font-medium ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                      {formatDate(closure.date)}
                    </span>
                  </div>
                  <span
                    className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      closure.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {closure.status === 'open' ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Coins className="h-4 w-4 text-green-500 mr-1" />
                    <span className={cashBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(cashBalance)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CreditCard className="h-4 w-4 text-purple-500 mr-1" />
                    <span className={bankBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(bankBalance)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CreditCard className="h-4 w-4 text-orange-500 mr-1" />
                    <span className={creditBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(creditBalance)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Saldo final: <span className={closure.finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(closure.finalBalance)}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 ${isToday ? 'text-blue-400' : 'text-gray-400'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}