import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DailyClosure, Transaction } from '../../types';
import { ref, update, remove } from 'firebase/database';
import { db } from '../../lib/firebase';
import { usePredefinedData } from '../../hooks/usePredefinedData';
import { useClosureAlerts } from '../../hooks/useClosureAlerts';
import toast from 'react-hot-toast';

import DashboardLayout from './DashboardLayout';
import ClosureHeader from './ClosureDetail/ClosureHeader';
import AlertsSection from './ClosureDetail/AlertsSection';
import AccountsSummary from './AccountsSummary';
import TransactionSection from './ClosureDetail/TransactionSection';
import TotalsSummary from './TotalsSummary';
import ObservationsSection from './ClosureDetail/ObservationsSection';

import { useTransaction } from '../../hooks/useTransaction';
import { useTransfer } from '../../hooks/useTransfer';
import { getPendingTransactions } from '../../utils/transactionUtils';

import FinalizeClosureModal from './FinalizeClosure/FinalizeClosureModal';
import PendingTransactionsModal from './FinalizeClosure/PendingTransactionsModal';

interface ClosureDetailProps {
  closure: DailyClosure;
  onBack: () => void;
}

export default function ClosureDetail({ closure: initialClosure, onBack }: ClosureDetailProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { concepts } = usePredefinedData();
  const { alerts, loading: alertsLoading } = useClosureAlerts(initialClosure);
  
  const [closure, setClosure] = useState<DailyClosure>(initialClosure);
  const [observations, setObservations] = useState(initialClosure.observations || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    concept: '',
    description: '',
    accountId: initialClosure.accounts[0]?.id,
    paymentType: 'efectivo'
  });

  const { executeTransfer, isSubmitting: isTransferSubmitting } = useTransfer();
  const { addTransaction, isSubmitting: isAddingTransaction } = useTransaction();

  const handleAddTransaction = async () => {
    try {
      const result = await addTransaction({
        closureId: closure.id,
        transaction: newTransaction,
        accounts: closure.accounts,
        currentTransactions: closure.transactions || []
      });

      setClosure(prev => ({
        ...prev,
        accounts: result.accounts,
        transactions: [...(prev.transactions || []), result.transaction],
        finalBalance: result.finalBalance
      }));

      setNewTransaction({
        concept: '',
        description: '',
        accountId: closure.accounts[0]?.id,
        paymentType: 'efectivo'
      });
      setShowTransactionModal(false);
      toast.success('Transacción agregada exitosamente');
    } catch (error) {
      console.error('Error al agregar la transacción:', error);
      toast.error(error instanceof Error ? error.message : 'Error al agregar la transacción');
    }
  };

  const handleUpdateTransactionDescription = async (transaction: Transaction, description: string) => {
    setIsSubmitting(true);
    try {
      const updatedTransactions = closure.transactions.map(t =>
        t.id === transaction.id ? { ...t, description } : t
      );

      await update(ref(db, `closures/${closure.id}`), {
        transactions: updatedTransactions,
        updatedAt: Date.now()
      });

      setClosure(prev => ({
        ...prev,
        transactions: updatedTransactions
      }));

      toast.success('Descripción actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la descripción:', error);
      toast.error('Error al actualizar la descripción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (transaction: Transaction) => {
    if (!concepts) return;
    
    const concept = concepts.find(c => c.name === transaction.concept);
    if (!concept) return;

    const currentState = concept.states.find(s => s.name === transaction.status);
    if (!currentState) return;

    const nextState = concept.states[concept.states.indexOf(currentState) + 1];
    if (!nextState) return;

    setIsSubmitting(true);
    try {
      const updatedTransaction = {
        ...transaction,
        status: nextState.name
      };

      const updatedTransactions = closure.transactions.map(t =>
        t.id === transaction.id ? updatedTransaction : t
      );

      await update(ref(db, `closures/${closure.id}`), {
        transactions: updatedTransactions,
        updatedAt: Date.now()
      });

      setClosure(prev => ({
        ...prev,
        transactions: updatedTransactions
      }));

      toast.success('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransfer = async (transfer: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description: string;
  }) => {
    try {
      const result = await executeTransfer({
        ...transfer,
        closureId: closure.id,
        accounts: closure.accounts,
        transactions: closure.transactions || []
      });

      if (result) {
        setClosure(prev => ({
          ...prev,
          accounts: result.updatedAccounts,
          transactions: result.updatedTransactions,
          finalBalance: result.finalBalance
        }));

        toast.success('Transferencia realizada exitosamente');
        setShowTransferModal(false);
      }
    } catch (error) {
      console.error('Error en la transferencia:', error);
      toast.error(error instanceof Error ? error.message : 'Error al realizar la transferencia');
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    setIsSubmitting(true);
    try {
      const transaction = closure.transactions.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error('Transacción no encontrada');
      }

      // Find related transfer transaction if exists
      let transactionsToDelete = [transactionId];
      if (transaction.transferId) {
        const relatedTransaction = closure.transactions.find(t => 
          t.transferId === transaction.transferId && t.id !== transactionId
        );
        if (relatedTransaction) {
          transactionsToDelete.push(relatedTransaction.id);
        }
      }

      // Update account balances
      const updatedAccounts = closure.accounts.map(account => {
        const accountTransactions = closure.transactions.filter(t => 
          transactionsToDelete.includes(t.id) && t.accountId === account.id
        );
        
        if (accountTransactions.length > 0) {
          const totalAmount = accountTransactions.reduce((sum, t) => sum + t.amount, 0);
          return {
            ...account,
            currentBalance: account.currentBalance - totalAmount
          };
        }
        return account;
      });

      const updatedTransactions = closure.transactions.filter(t => 
        !transactionsToDelete.includes(t.id)
      );
      
      const finalBalance = updatedAccounts.reduce((sum, account) => 
        sum + account.currentBalance, 0
      );

      await update(ref(db, `closures/${closure.id}`), {
        accounts: updatedAccounts,
        transactions: updatedTransactions,
        finalBalance,
        updatedAt: Date.now()
      });

      setClosure(prev => ({
        ...prev,
        accounts: updatedAccounts,
        transactions: updatedTransactions,
        finalBalance
      }));

      toast.success('Transacción eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la transacción:', error);
      toast.error('Error al eliminar la transacción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalizeClosure = () => {
    const pendingTransactions = getPendingTransactions(closure.transactions || []);
    
    if (pendingTransactions.length > 0) {
      setShowPendingModal(true);
    } else {
      setShowFinalizeModal(true);
    }
  };

  const handleConfirmFinalize = async () => {
    setIsSubmitting(true);
    try {
      await update(ref(db, `closures/${closure.id}`), {
        status: 'closed',
        updatedAt: Date.now()
      });

      setClosure(prev => ({
        ...prev,
        status: 'closed'
      }));

      setShowFinalizeModal(false);
      toast.success('Cierre finalizado exitosamente');
    } catch (error) {
      console.error('Error al finalizar el cierre:', error);
      toast.error('Error al finalizar el cierre');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClosure = async () => {
    setIsSubmitting(true);
    try {
      await remove(ref(db, `closures/${closure.id}`));
      toast.success('Cierre eliminado exitosamente');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al eliminar el cierre:', error);
      toast.error('Error al eliminar el cierre');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveObservations = async () => {
    setIsSubmitting(true);
    try {
      await update(ref(db, `closures/${closure.id}`), {
        observations,
        updatedAt: Date.now()
      });
      toast.success('Observaciones guardadas exitosamente');
    } catch (error) {
      console.error('Error al guardar las observaciones:', error);
      toast.error('Error al guardar las observaciones');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = currentUser?.uid === closure.userId;

  return (
    <DashboardLayout>
      <ClosureHeader
        closure={closure}
        onBack={onBack}
        onFinalize={handleFinalizeClosure}
        onDelete={handleDeleteClosure}
        isSubmitting={isSubmitting}
        isOwner={isOwner}
      />

      <div className="space-y-6">
        <AlertsSection alerts={alerts} loading={alertsLoading} />

        <AccountsSummary 
          accounts={closure.accounts} 
          finalBalance={closure.finalBalance} 
        />

        <TransactionSection
          closure={closure}
          accounts={closure.accounts}
          concepts={concepts || []}
          isSubmitting={isSubmitting}
          onStatusUpdate={handleStatusUpdate}
          onDescriptionUpdate={handleUpdateTransactionDescription}
          onAddTransaction={handleAddTransaction}
          onTransfer={handleTransfer}
          onDeleteTransaction={handleDeleteTransaction}
          showTransactionModal={showTransactionModal}
          setShowTransactionModal={setShowTransactionModal}
          showTransferModal={showTransferModal}
          setShowTransferModal={setShowTransferModal}
          newTransaction={newTransaction}
          setNewTransaction={setNewTransaction}
          isAddingTransaction={isAddingTransaction}
          isTransferSubmitting={isTransferSubmitting}
          isOwner={isOwner}
        />

        <TotalsSummary
          accounts={closure.accounts}
          transactions={closure.transactions}
          finalBalance={closure.finalBalance}
        />

        <ObservationsSection
          observations={observations}
          setObservations={setObservations}
          onSave={handleSaveObservations}
          isSubmitting={isSubmitting}
          isClosureOpen={closure.status === 'open' && isOwner}
        />
      </div>

      <FinalizeClosureModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        onConfirm={handleConfirmFinalize}
        isSubmitting={isSubmitting}
      />

      <PendingTransactionsModal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        transactions={getPendingTransactions(closure.transactions || [])}
      />
    </DashboardLayout>
  );
}