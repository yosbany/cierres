import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DailyClosure, Transaction } from '../../types';
import { X, Plus, Download, CheckCircle, Clock } from 'lucide-react';
import { ref, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import { usePredefinedData } from '../../hooks/usePredefinedData';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

interface ClosureDetailProps {
  closure: DailyClosure;
  onClose: () => void;
  onUpdate: () => void;
}

const PAYMENT_TYPES = [
  { id: 'efectivo', name: 'Efectivo' },
  { id: 'banco', name: 'Banco' }
] as const;

export default function ClosureDetail({ closure, onClose, onUpdate }: ClosureDetailProps) {
  const { concepts } = usePredefinedData();
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    concept: '',
    description: '',
    amount: 0,
    status: 'pending',
    accountId: closure.accounts[0]?.id,
    paymentType: 'efectivo'
  });

  const handleAddTransaction = async () => {
    if (!newTransaction.concept || !newTransaction.accountId) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      concept: newTransaction.concept,
      description: newTransaction.description || '',
      amount: newTransaction.amount || 0,
      status: newTransaction.status as 'pending' | 'completed',
      accountId: newTransaction.accountId,
      timestamp: Date.now(),
      paymentType: newTransaction.paymentType as 'efectivo' | 'banco'
    };

    const updatedAccounts = closure.accounts.map(account => {
      if (account.id === transaction.accountId) {
        return {
          ...account,
          currentBalance: account.currentBalance + (transaction.amount || 0)
        };
      }
      return account;
    });

    const updatedTransactions = [...(closure.transactions || []), transaction];
    const finalBalance = updatedAccounts.reduce((sum, account) => sum + account.currentBalance, 0);

    try {
      await update(ref(db, `closures/${closure.id}`), {
        accounts: updatedAccounts,
        transactions: updatedTransactions,
        finalBalance,
        updatedAt: Date.now()
      });
      
      setNewTransaction({
        concept: '',
        description: '',
        amount: 0,
        status: 'pending',
        accountId: closure.accounts[0]?.id,
        paymentType: 'efectivo'
      });
      
      onUpdate();
      toast.success('Transacción agregada exitosamente');
    } catch (error) {
      toast.error('Error al agregar la transacción');
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Cierre Diario', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(format(new Date(closure.date), "d 'de' MMMM, yyyy", { locale: es }), 105, 30, { align: 'center' });

    // Accounts Summary
    doc.setFontSize(16);
    doc.text('Resumen de Cuentas', 14, 45);
    
    const accountsData = closure.accounts.map(account => [
      account.name,
      `$${account.initialBalance.toLocaleString('es-AR')}`,
      `$${account.currentBalance.toLocaleString('es-AR')}`
    ]);

    (doc as any).autoTable({
      startY: 50,
      head: [['Cuenta', 'Saldo Inicial', 'Saldo Actual']],
      body: accountsData,
      theme: 'grid'
    });

    // Transactions
    doc.setFontSize(16);
    doc.text('Movimientos', 14, (doc as any).lastAutoTable.finalY + 15);

    const transactionsData = (closure.transactions || []).map(transaction => [
      format(new Date(transaction.timestamp), 'dd/MM/yyyy HH:mm'),
      transaction.concept,
      transaction.description,
      PAYMENT_TYPES.find(t => t.id === transaction.paymentType)?.name,
      `$${transaction.amount.toLocaleString('es-AR')}`,
      transaction.status === 'completed' ? 'Finalizado' : 'Pendiente'
    ]);

    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Fecha', 'Concepto', 'Descripción', 'Tipo', 'Monto', 'Estado']],
      body: transactionsData,
      theme: 'grid'
    });

    // Final Balance
    doc.setFontSize(16);
    doc.text(
      `Saldo Final: $${closure.finalBalance.toLocaleString('es-AR')}`,
      14,
      (doc as any).lastAutoTable.finalY + 15
    );

    doc.save(`cierre-${closure.date}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center p-4 sm:items-center">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Detalle del Cierre - {format(new Date(closure.date), "d 'de' MMMM, yyyy", { locale: es })}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Estado: {closure.status === 'open' ? 'Abierto' : 'Cerrado'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGeneratePDF}
                className="btn btn-secondary inline-flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Accounts Summary */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Resumen de Cuentas</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saldo Inicial
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saldo Actual
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {closure.accounts.map((account) => (
                      <tr key={account.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {account.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${account.initialBalance.toLocaleString('es-AR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${account.currentBalance.toLocaleString('es-AR')}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${closure.accounts.reduce((sum, account) => sum + account.initialBalance, 0).toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${closure.finalBalance.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transactions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Movimientos</h4>
                {closure.status === 'open' && (
                  <button
                    onClick={handleAddTransaction}
                    className="btn btn-primary inline-flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Movimiento
                  </button>
                )}
              </div>

              {closure.status === 'open' && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <select
                      value={newTransaction.concept}
                      onChange={e => setNewTransaction(prev => ({ ...prev, concept: e.target.value }))}
                      className="input"
                    >
                      <option value="">Seleccionar concepto</option>
                      {concepts.map(concept => (
                        <option key={concept.id} value={concept.name}>
                          {concept.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Descripción"
                      value={newTransaction.description}
                      onChange={e => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                      className="input"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Monto"
                      value={newTransaction.amount}
                      onChange={e => setNewTransaction(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      className="input"
                    />
                    <select
                      value={newTransaction.accountId}
                      onChange={e => setNewTransaction(prev => ({ ...prev, accountId: e.target.value }))}
                      className="input"
                    >
                      {closure.accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newTransaction.paymentType}
                      onChange={e => setNewTransaction(prev => ({ ...prev, paymentType: e.target.value as 'efectivo' | 'banco' }))}
                      className="input"
                    >
                      {PAYMENT_TYPES.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newTransaction.status}
                      onChange={e => setNewTransaction(prev => ({ ...prev, status: e.target.value as 'pending' | 'completed' }))}
                      className="input"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="completed">Finalizado</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concepto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(closure.transactions || []).map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(transaction.timestamp), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.concept}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {PAYMENT_TYPES.find(t => t.id === transaction.paymentType)?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                            ${Math.abs(transaction.amount).toLocaleString('es-AR')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {transaction.status === 'completed' ? (
                            <span className="inline-flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Finalizado
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-yellow-600">
                              <Clock className="h-4 w-4 mr-1" />
                              Pendiente
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}