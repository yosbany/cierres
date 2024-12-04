import React from 'react';
import { ArrowLeftRight, Plus } from 'lucide-react';
import { DailyClosure, Transaction, PredefinedConcept } from '../../../types';
import TransactionList from '../TransactionList';
import NewTransactionModal from '../Transactions/NewTransactionModal';
import TransferModal from '../Transfers/TransferModal';

interface TransactionSectionProps {
  closure: DailyClosure;
  accounts: Array<{ id: string; name: string; type: string }>;
  concepts: PredefinedConcept[];
  isSubmitting: boolean;
  onStatusUpdate: (transaction: Transaction) => Promise<void>;
  onDescriptionUpdate: (transaction: Transaction, description: string) => Promise<void>;
  onAddTransaction: () => Promise<void>;
  onTransfer: (transfer: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description: string;
  }) => Promise<void>;
  onDeleteTransaction: (transactionId: string) => Promise<void>;
  showTransactionModal: boolean;
  setShowTransactionModal: (show: boolean) => void;
  showTransferModal: boolean;
  setShowTransferModal: (show: boolean) => void;
  newTransaction: Partial<Transaction>;
  setNewTransaction: (transaction: Partial<Transaction>) => void;
  isAddingTransaction: boolean;
  isTransferSubmitting: boolean;
}

export default function TransactionSection({
  closure,
  accounts,
  concepts,
  isSubmitting,
  onStatusUpdate,
  onDescriptionUpdate,
  onAddTransaction,
  onTransfer,
  onDeleteTransaction,
  showTransactionModal,
  setShowTransactionModal,
  showTransferModal,
  setShowTransferModal,
  newTransaction,
  setNewTransaction,
  isAddingTransaction,
  isTransferSubmitting
}: TransactionSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Movimientos</h3>
        {closure.status === 'open' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTransferModal(true)}
              className="btn btn-secondary inline-flex items-center"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Nueva Transferencia
            </button>
            <button
              onClick={() => setShowTransactionModal(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Movimiento
            </button>
          </div>
        )}
      </div>

      <TransactionList
        transactions={closure.transactions}
        accounts={accounts}
        concepts={concepts}
        isClosureOpen={closure.status === 'open'}
        isSubmitting={isSubmitting}
        onStatusUpdate={onStatusUpdate}
        onDescriptionUpdate={onDescriptionUpdate}
        onDelete={onDeleteTransaction}
      />

      <NewTransactionModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setNewTransaction({
            concept: '',
            description: '',
            accountId: closure.accounts[0]?.id,
            paymentType: 'efectivo'
          });
        }}
        onSubmit={onAddTransaction}
        transaction={newTransaction}
        onUpdate={setNewTransaction}
        isSubmitting={isAddingTransaction}
        accounts={accounts}
      />

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        accounts={accounts}
        onTransfer={onTransfer}
        isSubmitting={isTransferSubmitting}
      />
    </div>
  );
}