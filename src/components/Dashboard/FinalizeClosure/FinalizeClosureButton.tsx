import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Transaction } from '../../../types';
import FinalizeClosureModal from './FinalizeClosureModal';
import PendingTransactionsModal from './PendingTransactionsModal';
import { getPendingTransactions } from '../../../utils/transactionUtils';

interface FinalizeClosureButtonProps {
  transactions: Transaction[];
  onFinalize: () => Promise<void>;
  isSubmitting: boolean;
}

export default function FinalizeClosureButton({
  transactions,
  onFinalize,
  isSubmitting
}: FinalizeClosureButtonProps) {
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const handleClick = () => {
    const pendingTransactions = getPendingTransactions(transactions);
    
    if (pendingTransactions.length > 0) {
      setShowPendingModal(true);
    } else {
      setShowFinalizeModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-8 right-8 btn btn-primary shadow-lg flex items-center gap-2 z-50"
        disabled={isSubmitting}
      >
        <Lock className="h-5 w-5" />
        Finalizar Cierre
      </button>

      <FinalizeClosureModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        onConfirm={onFinalize}
        isSubmitting={isSubmitting}
      />

      <PendingTransactionsModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        transactions={getPendingTransactions(transactions)}
      />
    </>
  );
}