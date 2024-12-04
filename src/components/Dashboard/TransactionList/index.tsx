import React, { useState } from 'react';
import { Transaction, PredefinedConcept } from '../../../types';
import { formatDateTime } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/formatters';
import EditTransactionModal from '../Transactions/EditTransactionModal';
import TransactionStatus from './TransactionStatus';
import TransactionDescription from './TransactionDescription';
import DeleteTransactionButton from './DeleteTransactionButton';
import TransferInfo from './TransferInfo';

interface TransactionListProps {
  transactions?: Transaction[];
  accounts: Array<{ id: string; name: string }>;
  concepts: PredefinedConcept[];
  isClosureOpen: boolean;
  isSubmitting: boolean;
  onStatusUpdate?: (transaction: Transaction) => Promise<void>;
  onDescriptionUpdate?: (transaction: Transaction, description: string) => Promise<void>;
  onDelete: (transactionId: string) => Promise<void>;
}

export default function TransactionList({
  transactions = [],
  accounts,
  concepts,
  isClosureOpen,
  isSubmitting,
  onStatusUpdate,
  onDescriptionUpdate,
  onDelete
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  if (!transactions.length) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No hay movimientos registrados</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto -mx-6 lg:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-6">
                    Fecha
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuenta
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  {isClosureOpen && (
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => {
                  const concept = concepts?.find(c => c.name === transaction.concept);
                  const isTransfer = transaction.paymentType === 'transferencia';

                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                        {formatDateTime(transaction.timestamp)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        <div className="space-y-1">
                          <div>{transaction.concept}</div>
                          {isTransfer && (
                            <TransferInfo
                              transaction={transaction}
                              accounts={accounts}
                            />
                          )}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-500 max-w-xs truncate group relative">
                        <TransactionDescription
                          transaction={transaction}
                          isClosureOpen={isClosureOpen}
                          onEdit={setEditingTransaction}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {accounts.find(a => a.id === transaction.accountId)?.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium">
                        <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(Math.abs(transaction.amount))}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <TransactionStatus
                          transaction={transaction}
                          concept={concept}
                          isClosureOpen={isClosureOpen}
                          isSubmitting={isSubmitting}
                          onStatusUpdate={onStatusUpdate}
                        />
                      </td>
                      {isClosureOpen && (
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-3">
                            <DeleteTransactionButton
                              transactionId={transaction.id}
                              onDelete={onDelete}
                              isSubmitting={isSubmitting}
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingTransaction && onDescriptionUpdate && (
        <EditTransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onSave={async (description) => {
            await onDescriptionUpdate(editingTransaction, description);
            setEditingTransaction(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}