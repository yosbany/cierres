import React from 'react';
import { PencilIcon } from 'lucide-react';
import { Transaction } from '../../../types';

interface TransactionDescriptionProps {
  transaction: Transaction;
  isClosureOpen: boolean;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionDescription({
  transaction,
  isClosureOpen,
  onEdit
}: TransactionDescriptionProps) {
  return (
    <div className="flex items-center">
      <span className="truncate">{transaction.description}</span>
      {isClosureOpen && (
        <button
          onClick={() => onEdit(transaction)}
          className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Editar descripción"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}