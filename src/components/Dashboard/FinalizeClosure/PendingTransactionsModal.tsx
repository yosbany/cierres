import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Transaction } from '../../../types';
import { formatDateTime } from '../../../utils/dateUtils';

interface PendingTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export default function PendingTransactionsModal({
  isOpen,
  onClose,
  transactions
}: PendingTransactionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-xl font-semibold">No es posible finalizar el cierre</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Existen {transactions.length} movimientos pendientes que deben ser completados:
            </p>

            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-yellow-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700">Fecha</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700">Concepto</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-yellow-200">
                    {transactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-2 text-sm text-yellow-700">
                          {formatDateTime(transaction.timestamp)}
                        </td>
                        <td className="px-4 py-2 text-sm text-yellow-700">
                          {transaction.concept}
                        </td>
                        <td className="px-4 py-2 text-sm text-yellow-700">
                          {transaction.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}