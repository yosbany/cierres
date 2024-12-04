import React, { useState } from 'react';
import { Transaction, PredefinedConcept } from '../../types';
import { Edit, Trash2, CheckCircle, HourglassIcon, HelpCircle, PencilIcon } from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils';
import { TRANSACTION_STATES } from '../../constants';
import StatusHelpModal from './StatusHelpModal';
import StatusChangeModal from './StatusChangeModal';
import { formatCurrency } from '../../utils/formatters';
import EditTransactionModal from './Transactions/EditTransactionModal';

interface TransactionListProps {
  transactions?: Transaction[];
  accounts: Array<{ id: string; name: string }>;
  concepts: PredefinedConcept[];
  isClosureOpen: boolean;
  isSubmitting: boolean;
  onStatusUpdate?: (transaction: Transaction) => void;
  onDescriptionUpdate?: (transaction: Transaction, description: string) => Promise<void>;
  onDelete: (transactionId: string) => void;
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
  const [selectedStatus, setSelectedStatus] = useState<{ name: string; description: string } | null>(null);
  const [statusChangeTransaction, setStatusChangeTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const getStateTooltip = (concept: PredefinedConcept, stateName: string) => {
    const state = concept.states.find(s => s.name === stateName);
    if (!state) return '';

    const nextState = concept.states[concept.states.indexOf(state) + 1];
    
    if (state.isFinal) {
      return 'Este movimiento está finalizado y no puede cambiar de estado';
    }

    return `Click para cambiar a "${nextState?.name}"`;
  };

  const getStateDescription = (stateName: string) => {
    const state = Object.values(TRANSACTION_STATES).find(s => s.name === stateName);
    return state?.description || 'Estado del movimiento';
  };

  const handleShowHelp = (status: string) => {
    const description = getStateDescription(status);
    setSelectedStatus({ name: status, description });
  };

  const handleStatusUpdateClick = (transaction: Transaction) => {
    if (!onStatusUpdate) return;

    const concept = concepts.find(c => c.name === transaction.concept);
    if (!concept) return;

    const currentState = concept.states.find(s => s.name === transaction.status);
    if (!currentState) return;

    const nextState = concept.states[concept.states.indexOf(currentState) + 1];
    if (!nextState) return;

    setStatusChangeTransaction(transaction);
  };

  const handleConfirmStatusChange = () => {
    if (statusChangeTransaction && onStatusUpdate) {
      onStatusUpdate(statusChangeTransaction);
      setStatusChangeTransaction(null);
    }
  };

  const getNextStatus = (transaction: Transaction | null) => {
    if (!transaction) return '';
    
    const concept = concepts.find(c => c.name === transaction.concept);
    if (!concept) return '';

    const currentState = concept.states.find(s => s.name === transaction.status);
    if (!currentState) return '';

    const nextState = concept.states[concept.states.indexOf(currentState) + 1];
    return nextState?.name || '';
  };

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
                  const currentState = concept?.states.find(s => s.name === transaction.status);
                  const isLastState = currentState && concept?.states.indexOf(currentState) === concept.states.length - 1;
                  const isTransfer = transaction.paymentType === 'transferencia';

                  return (
                    <tr key={`${transaction.id}-${transaction.timestamp}`} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                        {formatDateTime(transaction.timestamp)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {transaction.concept}
                      </td>
                      <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-500 max-w-xs truncate group relative">
                        <div className="flex items-center">
                          <span className="truncate">{transaction.description}</span>
                          {isClosureOpen && (
                            <button
                              onClick={() => setEditingTransaction(transaction)}
                              className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Editar descripción"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
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
                        <div className="inline-flex items-center">
                          {isClosureOpen && !isLastState && !isTransfer ? (
                            <button
                              onClick={() => handleStatusUpdateClick(transaction)}
                              className="inline-flex items-center text-orange-600 hover:text-orange-800"
                              disabled={isSubmitting}
                              title={concept ? getStateTooltip(concept, transaction.status) : ''}
                            >
                              <HourglassIcon className="h-4 w-4 mr-1" />
                              {transaction.status}
                            </button>
                          ) : (
                            <span className={`inline-flex items-center ${
                              isLastState || isTransfer ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {isLastState || isTransfer ? (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              ) : (
                                <HourglassIcon className="h-4 w-4 mr-1" />
                              )}
                              {transaction.status}
                            </span>
                          )}
                          <button
                            onClick={() => handleShowHelp(transaction.status)}
                            className="ml-1 text-gray-400 hover:text-gray-600"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      {isClosureOpen && (
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => onDelete(transaction.id)}
                              className="text-gray-600 hover:text-red-600 transition-colors duration-200"
                              disabled={isSubmitting}
                              title="Eliminar movimiento"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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

      <StatusHelpModal
        isOpen={!!selectedStatus}
        onClose={() => setSelectedStatus(null)}
        status={selectedStatus?.name || ''}
        description={selectedStatus?.description || ''}
      />

      <StatusChangeModal
        isOpen={!!statusChangeTransaction}
        onClose={() => setStatusChangeTransaction(null)}
        onConfirm={handleConfirmStatusChange}
        currentStatus={statusChangeTransaction?.status || ''}
        nextStatus={getNextStatus(statusChangeTransaction)}
        isLoading={isSubmitting}
      />

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