import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Account } from '../../types';
import { validateTransfer } from '../../utils/transferValidation';
import { formatCurrency } from '../../utils/formatters';
import TransferForm from './Transfers/TransferForm';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onTransfer: (transfer: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function TransferModal({
  isOpen,
  onClose,
  accounts,
  onTransfer,
  isSubmitting
}: TransferModalProps) {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    if (!fromAccount) {
      throw new Error('Cuenta de origen no encontrada');
    }

    const transferAmount = parseFloat(amount);
    const validationError = validateTransfer({
      fromAccount,
      toAccountId,
      amount: transferAmount
    });

    if (validationError) {
      throw new Error(validationError);
    }

    try {
      await onTransfer({
        fromAccountId,
        toAccountId,
        amount: transferAmount,
        description: description.trim() || 'Transferencia entre cuentas'
      });

      // Reset form
      setFromAccountId('');
      setToAccountId('');
      setAmount('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error en la transferencia:', error);
      throw error;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Nueva Transferencia</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <TransferForm
              accounts={accounts}
              fromAccountId={fromAccountId}
              toAccountId={toAccountId}
              amount={amount}
              description={description}
              isSubmitting={isSubmitting}
              onFromAccountChange={setFromAccountId}
              onToAccountChange={setToAccountId}
              onAmountChange={setAmount}
              onDescriptionChange={setDescription}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}