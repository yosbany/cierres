import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Transaction } from '../../../types';

interface TransferInfoProps {
  transaction: Transaction;
  accounts: Array<{ id: string; name: string }>;
}

export default function TransferInfo({ transaction, accounts }: TransferInfoProps) {
  if (!transaction.transferId || !transaction.relatedAccountId) {
    return null;
  }

  const fromAccount = accounts.find(a => a.id === transaction.accountId);
  const toAccount = accounts.find(a => a.id === transaction.relatedAccountId);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span>{fromAccount?.name}</span>
      <ArrowRight className="h-4 w-4" />
      <span>{toAccount?.name}</span>
    </div>
  );
}