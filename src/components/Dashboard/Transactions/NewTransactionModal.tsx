import React from 'react';
import { X } from 'lucide-react';
import { Transaction } from '../../../types';
import TransactionForm from '../TransactionForm';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  transaction: Partial<Transaction>;
  onUpdate: (transaction: Partial<Transaction>) => void;
  isSubmitting: boolean;
  accounts: Array<{ id: string; name: string; type: string; currentBalance: number }>;
}

export default function NewTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  onUpdate,
  isSubmitting,
  accounts
}: NewTransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Nuevo Movimiento</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <TransactionForm
              transaction={transaction}
              onUpdate={onUpdate}
              onSubmit={onSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
              isEditing={false}
              accounts={accounts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}