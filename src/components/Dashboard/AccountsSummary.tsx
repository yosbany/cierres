import React from 'react';
import { Account } from '../../types';

interface AccountsSummaryProps {
  accounts: Account[];
  finalBalance: number;
}

export default function AccountsSummary({ accounts, finalBalance }: AccountsSummaryProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cuenta
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Saldo Inicial
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Saldo Actual
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {account.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                ${account.initialBalance.toLocaleString('es-AR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                ${account.currentBalance.toLocaleString('es-AR')}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-medium">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Total
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
              ${accounts.reduce((sum, account) => sum + account.initialBalance, 0).toLocaleString('es-AR')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
              ${finalBalance.toLocaleString('es-AR')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}