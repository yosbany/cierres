import React from 'react';
import { DailyClosure } from '../../../types';
import { Clock, Coins, CreditCard } from 'lucide-react';
import { formatShortDate } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/formatters';
import { calculateBalances } from './utils';

interface PreviousClosuresProps {
  closures: DailyClosure[];
  onClick: (closure: DailyClosure) => void;
}

export default function PreviousClosures({ closures, onClick }: PreviousClosuresProps) {
  if (closures.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
        <Clock className="h-5 w-5 text-gray-600 mr-2" />
        Cierres Anteriores
      </h3>
      <div className="bg-white rounded-lg shadow overflow-hidden divide-y divide-gray-200">
        {closures.map((closure) => {
          const { cashBalance, bankBalance, creditBalance } = calculateBalances(closure);
          
          return (
            <button
              key={closure.id}
              onClick={() => onClick(closure)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-lg font-medium text-gray-900">
                    {formatShortDate(closure.date)}
                  </span>
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
                    Balance final: <span className={closure.finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(closure.finalBalance)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}