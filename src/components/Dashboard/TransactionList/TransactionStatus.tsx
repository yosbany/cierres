import React, { useState } from 'react';
import { HourglassIcon, CheckCircle, HelpCircle } from 'lucide-react';
import { Transaction, PredefinedConcept } from '../../../types';
import StatusHelpModal from '../StatusHelpModal';
import StatusChangeModal from '../StatusChangeModal';
import { getStateDescription } from '../../../utils/transactionUtils';

interface TransactionStatusProps {
  transaction: Transaction;
  concept?: PredefinedConcept;
  isClosureOpen: boolean;
  isSubmitting: boolean;
  onStatusUpdate?: (transaction: Transaction) => Promise<void>;
}

export default function TransactionStatus({
  transaction,
  concept,
  isClosureOpen,
  isSubmitting,
  onStatusUpdate
}: TransactionStatusProps) {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  const currentState = concept?.states.find(s => s.name === transaction.status);
  const isLastState = currentState && concept?.states.indexOf(currentState) === concept.states.length - 1;
  const isTransfer = transaction.paymentType === 'transferencia';

  const getStateTooltip = () => {
    if (!concept || !currentState) return '';
    
    const nextState = concept.states[concept.states.indexOf(currentState) + 1];
    
    if (currentState.isFinal) {
      return 'Este movimiento está finalizado y no puede cambiar de estado';
    }

    return `Click para cambiar a "${nextState?.name}"`;
  };

  const handleStatusClick = () => {
    if (!onStatusUpdate || !concept || !currentState) return;

    const nextState = concept.states[concept.states.indexOf(currentState) + 1];
    if (!nextState) return;

    setShowChangeModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (onStatusUpdate) {
      await onStatusUpdate(transaction);
      setShowChangeModal(false);
    }
  };

  const getNextStatus = () => {
    if (!concept || !currentState) return '';
    const nextState = concept.states[concept.states.indexOf(currentState) + 1];
    return nextState?.name || '';
  };

  return (
    <div className="inline-flex items-center">
      {isClosureOpen && !isLastState && !isTransfer ? (
        <button
          onClick={handleStatusClick}
          className="inline-flex items-center text-orange-600 hover:text-orange-800"
          disabled={isSubmitting}
          title={getStateTooltip()}
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
        onClick={() => setShowHelpModal(true)}
        className="ml-1 text-gray-400 hover:text-gray-600"
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      <StatusHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        status={transaction.status}
        description={getStateDescription(transaction.status)}
      />

      <StatusChangeModal
        isOpen={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        onConfirm={handleConfirmStatusChange}
        currentStatus={transaction.status}
        nextStatus={getNextStatus()}
        isLoading={isSubmitting}
      />
    </div>
  );
}