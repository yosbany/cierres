import React from 'react';
import { Account } from '../../types';
import { Wallet, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface AccountsSummaryProps {
  accounts: Account[];
  finalBalance: number;
}

export default function AccountsSummary({ accounts, finalBalance }: AccountsSummaryProps) {
  const initialTotal = accounts.reduce((sum, account) => sum + account.initialBalance, 0);
  const difference = finalBalance - initialTotal;

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'efectivo':
        return <Wallet className="h-5 w-5 text-green-600" />;
      case 'banco':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'credito':
        return <CreditCard className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'efectivo':
        return 'bg-green-100';
      case 'banco':
        return 'bg-purple-100';
      case 'credito':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'efectivo':
        return 'Efectivo';
      case 'banco':
        return 'Banco';
      case 'credito':
        return 'Crédito';
      default:
        return type;
    }
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Resumen de Cuentas</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuenta
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saldo Inicial
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                Saldo Actual
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diferencia
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => {
              const accountDiff = account.currentBalance - account.initialBalance;
              return (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${getAccountTypeColor(account.type)}`}>
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{account.name}</p>
                        <p className="text-xs text-gray-500">{getAccountTypeName(account.type)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {formatCurrency(account.initialBalance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm bg-blue-50">
                    <span className={`text-base font-semibold ${account.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(account.currentBalance)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className={`font-medium ${accountDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {accountDiff > 0 && '+'}
                      {formatCurrency(accountDiff)}
                    </span>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-gray-900 font-medium">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                Balance Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-100">
                {formatCurrency(initialTotal)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm bg-gray-800">
                <span className={`text-lg font-bold ${finalBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(finalBalance)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <span className={`font-bold ${difference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {difference > 0 && '+'}
                  {formatCurrency(difference)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}