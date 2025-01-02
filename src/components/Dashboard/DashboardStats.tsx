import React from 'react';
import { Wallet, CreditCard, Coins } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface DashboardStatsProps {
  totalBalance: number;
  cashBalance: number;
  bankBalance: number;
  creditBalance: number;
}

export default function DashboardStats({
  totalBalance,
  cashBalance,
  bankBalance,
  creditBalance
}: DashboardStatsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Saldo General</h3>
              <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Coins className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Saldo Efectivo</h3>
              <p className={`text-2xl font-bold ${cashBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(cashBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Saldo Banco</h3>
              <p className={`text-2xl font-bold ${bankBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(bankBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Saldo Crédito</h3>
              <p className={`text-2xl font-bold ${creditBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(creditBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}