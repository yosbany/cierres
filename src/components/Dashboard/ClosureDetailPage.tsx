import React, { useState } from 'react';
import { ref, update, remove } from 'firebase/database';
import { db } from '../../lib/firebase';
import { DailyClosure, Transaction } from '../../types';
import { ArrowLeft, Download, Trash2, Plus, ArrowLeftRight } from 'lucide-react';
import { usePredefinedData } from '../../hooks/usePredefinedData';
import toast from 'react-hot-toast';
import DashboardLayout from './DashboardLayout';
import DeleteClosureModal from './DeleteClosureModal';
import DeleteTransactionModal from './DeleteTransactionModal';
import AccountsSummary from './AccountsSummary';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TotalsSummary from './TotalsSummary';
import TransferModal from './Transfers/TransferModal';
import { useTransfer } from '../../hooks/useTransfer';
import { generateClosurePDF } from '../../utils/pdfGenerator';

interface ClosureDetailPageProps {
  closure: DailyClosure;
  onBack: () => void;
}

export default function ClosureDetailPage({ closure: initialClosure, onBack }: ClosureDetailPageProps) {
  const [closure, setClosure] = useState<DailyClosure>(initialClosure);
  const [observations, setObservations] = useState(initialClosure.observations || '');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingClosure, setIsDeletingClosure] = useState(false);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    concept: '',
    description: '',
    accountId: initialClosure.accounts[0]?.id,
    paymentType: 'efectivo'
  });

  const { concepts } = usePredefinedData();
  const { executeTransfer, isSubmitting: isTransferSubmitting } = useTransfer();

  const handleAddTransaction = async () => {
    if (!newTransaction.concept || !newTransaction.accountId || newTransaction.amount === undefined) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      const concept = concepts?.find(c => c.name === newTransaction.concept);
      if (!concept) {
        throw new Error('Concepto no encontrado');
      }

      const transaction: Transaction = {
        id: Date.now().toString(),
        concept: newTransaction.concept,
        description: newTransaction.description || '',
        amount: newTransaction.amount,
        status: concept.states[0].name,
        accountId: newTransaction.accountId,
        timestamp: Date.now(),
        paymentType: newTransaction.paymentType as 'efectivo' | 'banco'
      };

      const updatedAccounts = closure.accounts.map(account => {
        if (account.id === transaction.accountId) {
          return {
            ...account,
            currentBalance: account.currentBalance + transaction.amount
          };
        }
        return account;
      });

      const updatedTransactions = [...closure.transactions, transaction];
      const finalBalance = updatedAccounts.reduce((sum, account) => sum + account.currentBalance, 0);

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

      setNewTransaction({
        concept: '',
        description: '',
        accountId: closure.accounts[0]?.id,
        paymentType: 'efectivo'
      });
      setShowTransactionForm(false);
      toast.success('Transacción agregada exitosamente');
    } catch (error) {
      toast.error('Error al agregar la transacción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deleteTransactionId) return;

    setIsDeletingTransaction(true);
    try {
      const transaction = closure.transactions.find(t => t.id === deleteTransactionId);
      if (!transaction) return;

      let transactionsToDelete = [deleteTransactionId];
      
      // If it's a transfer, delete both transactions
      if (transaction.transferId) {
        transactionsToDelete = closure.transactions
          .filter(t => t.transferId === transaction.transferId)
          .map(t => t.id);
      }

      const updatedTransactions = closure.transactions.filter(t => 
        !transactionsToDelete.includes(t.id)
      );

      const updatedAccounts = closure.accounts.map(account => {
        const accountTransactions = closure.transactions
          .filter(t => t.accountId === account.id && transactionsToDelete.includes(t.id));
        
        if (accountTransactions.length > 0) {
          const totalAmount = accountTransactions.reduce((sum, t) => sum + t.amount, 0);
          return {
            ...account,
            currentBalance: account.currentBalance - totalAmount
          };
        }
        return account;
      });

      const finalBalance = updatedAccounts.reduce((sum, account) => sum + account.currentBalance, 0);

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
      setDeleteTransactionId(null);
    } catch (error) {
      toast.error('Error al eliminar la transacción');
    } finally {
      setIsDeletingTransaction(false);
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
        transactions: closure.transactions
      });

      if (result) {
        setClosure(prev => ({
          ...prev,
          accounts: result.updatedAccounts,
          transactions: result.updatedTransactions,
          finalBalance: result.finalBalance
        }));

        toast.success('Transferencia realizada exitosamente');
        setIsTransferModalOpen(false);
      }
    } catch (error) {
      console.error('Error en la transferencia:', error);
      toast.error('Error al realizar la transferencia');
    }
  };

  const handleGeneratePDF = () => {
    const doc = generateClosurePDF({
      closure,
      accounts: closure.accounts,
      transactions: closure.transactions,
      observations
    });
    doc.save(`cierre-${closure.date}.pdf`);
  };

  const handleDeleteClosure = async () => {
    setIsDeletingClosure(true);
    try {
      await remove(ref(db, `closures/${closure.id}`));
      toast.success('Cierre eliminado exitosamente');
      onBack();
    } catch (error) {
      toast.error('Error al eliminar el cierre');
      setIsDeletingClosure(false);
    }
  };

  const handleStatusUpdate = async (transaction: Transaction) => {
    const concept = concepts?.find(c => c.name === transaction.concept);
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
      toast.error('Error al actualizar el estado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Cierre del {closure.date}
            </h2>
            <p className="text-sm text-gray-500">
              Estado: {closure.status === 'open' ? 'Abierto' : 'Cerrado'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGeneratePDF}
            className="btn btn-secondary inline-flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="btn bg-red-600 text-white hover:bg-red-700 inline-flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Cierre
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Accounts Summary */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Cuentas</h3>
          <AccountsSummary accounts={closure.accounts} finalBalance={closure.finalBalance} />
        </div>

        {/* Transactions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Movimientos</h3>
            {closure.status === 'open' && !showTransactionForm && (
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  className="btn btn-secondary inline-flex items-center"
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Nueva Transferencia
                </button>
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg inline-flex items-center shadow-sm transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nuevo Movimiento
                </button>
              </div>
            )}
          </div>

          {closure.status === 'open' && showTransactionForm && (
            <TransactionForm
              transaction={newTransaction}
              onUpdate={setNewTransaction}
              onSubmit={handleAddTransaction}
              onCancel={() => {
                setShowTransactionForm(false);
                setEditingTransaction(null);
                setNewTransaction({
                  concept: '',
                  description: '',
                  accountId: closure.accounts[0]?.id,
                  paymentType: 'efectivo'
                });
              }}
              isSubmitting={isSubmitting}
              isEditing={!!editingTransaction}
              accounts={closure.accounts}
            />
          )}

          <TransactionList
            transactions={closure.transactions}
            accounts={closure.accounts}
            concepts={concepts}
            isClosureOpen={closure.status === 'open'}
            isSubmitting={isSubmitting}
            onStatusUpdate={handleStatusUpdate}
            onDelete={(transactionId) => setDeleteTransactionId(transactionId)}
          />
        </div>

        {/* Totals Summary */}
        <TotalsSummary
          accounts={closure.accounts}
          transactions={closure.transactions}
          finalBalance={closure.finalBalance}
        />

        {/* Observations */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Observaciones</h3>
          <div className="space-y-4">
            <textarea
              value={observations}
              onChange={e => setObservations(e.target.value)}
              className="input h-32 resize-none"
              placeholder="Agregar observaciones..."
              disabled={closure.status === 'closed' || isSubmitting}
            />
            {closure.status === 'open' && (
              <div className="flex justify-end">
                <button
                  onClick={async () => {
                    setIsSubmitting(true);
                    try {
                      await update(ref(db, `closures/${closure.id}`), {
                        observations,
                        updatedAt: Date.now()
                      });
                      toast.success('Observaciones guardadas exitosamente');
                    } catch (error) {
                      toast.error('Error al guardar las observaciones');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Guardar Observaciones
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        accounts={closure.accounts}
        onTransfer={handleTransfer}
        isSubmitting={isTransferSubmitting}
      />

      <DeleteClosureModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteClosure}
        isLoading={isDeletingClosure}
      />

      <DeleteTransactionModal
        isOpen={!!deleteTransactionId}
        onClose={() => setDeleteTransactionId(null)}
        onConfirm={handleDeleteTransaction}
        isLoading={isDeletingTransaction}
      />
    </DashboardLayout>
  );
}