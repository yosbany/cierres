import React from 'react';
import { DailyClosure } from '../../../types';
import { Calendar, Coins, CreditCard } from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/formatters';
import { calculateBalances } from './utils';

interface CurrentClosureProps {
  closure: DailyClosure;
  onClick: (closure: DailyClosure) => void;
}

export default function CurrentClosure({ closure, onClick }: CurrentClosureProps) {
  const { cashBalance, bankBalance, creditBalance } = calculateBalances(closure);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
        Cierre Actual
      </h3>
      <button
        onClick={() => onClick(closure)}
        className="w-full px-6 py-4 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg border-l-4 border-blue-500"
      >
        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-lg font-medium text-blue-900">
              {formatDate(closure.date)}
            </span>
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
        <div className="text-blue-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  );
}