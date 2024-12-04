import React from 'react';
import { DailyClosure } from '../../../types';
import { Calendar, Coins, CreditCard, ChevronRight } from 'lucide-react';
import { formatShortDate } from '../../../utils/dateUtils';
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
        className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 hover:from-blue-100 hover:via-indigo-100 hover:to-blue-100 transition-all duration-300 rounded-lg border-l-4 border-blue-500 shadow-sm"
      >
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-xl font-semibold text-blue-900">
                  {formatShortDate(closure.date)}
                </span>
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {closure.status === 'open' ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-sm">
                  <div className="p-1.5 bg-green-100 rounded-lg mr-2">
                    <Coins className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <span className="text-gray-600">Efectivo</span>
                    <p className={`font-medium ${cashBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(cashBalance)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-gray-600">Banco</span>
                    <p className={`font-medium ${bankBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(bankBalance)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <div className="p-1.5 bg-orange-100 rounded-lg mr-2">
                    <CreditCard className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <span className="text-gray-600">Crédito</span>
                    <p className={`font-medium ${creditBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(creditBalance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-sm text-gray-600">Balance Total</span>
                <p className={`text-lg font-bold ${closure.finalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(closure.finalBalance)}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}