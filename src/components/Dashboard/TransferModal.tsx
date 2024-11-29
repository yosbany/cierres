import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Account } from '../../types';
import toast from 'react-hot-toast';

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

    if (!fromAccountId || !toAccountId) {
      toast.error('Por favor seleccione las cuentas de origen y destino');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast.error('El monto debe ser mayor a cero');
      return;
    }

    if (fromAccountId === toAccountId) {
      toast.error('Las cuentas de origen y destino deben ser diferentes');
      return;
    }

    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    if (!fromAccount || fromAccount.currentBalance < transferAmount) {
      toast.error('Saldo insuficiente en la cuenta de origen');
      return;
    }

    try {
      await onTransfer({
        fromAccountId,
        toAccountId,
        amount: transferAmount,
        description: description.trim() || 'Transferencia entre cuentas'
      });

      setFromAccountId('');
      setToAccountId('');
      setAmount('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error en la transferencia:', error);
      toast.error('Error al realizar la transferencia');
    }
  };

  if (!isOpen) return null;

  const fromAccount = accounts.find(acc => acc.id === fromAccountId);

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

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta Origen
              </label>
              <select
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="input"
                required
                disabled={isSubmitting}
              >
                <option value="">Seleccionar cuenta</option>
                {accounts.map(account => (
                  <option 
                    key={account.id} 
                    value={account.id}
                    disabled={account.id === toAccountId}
                  >
                    {account.name} (${account.currentBalance.toLocaleString('es-AR')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta Destino
              </label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="input"
                required
                disabled={isSubmitting}
              >
                <option value="">Seleccionar cuenta</option>
                {accounts.map(account => (
                  <option 
                    key={account.id} 
                    value={account.id}
                    disabled={account.id === fromAccountId}
                  >
                    {account.name} (${account.currentBalance.toLocaleString('es-AR')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={fromAccount?.currentBalance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input pl-8"
                  placeholder="Ingrese el monto a transferir"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {fromAccount && (
                <p className="mt-1 text-sm text-gray-500">
                  Saldo disponible: ${fromAccount.currentBalance.toLocaleString('es-AR')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                placeholder="Agregar una descripción"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  isSubmitting || 
                  !fromAccountId || 
                  !toAccountId || 
                  !amount || 
                  parseFloat(amount) <= 0 || 
                  (fromAccount && parseFloat(amount) > fromAccount.currentBalance)
                }
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Transfiriendo...
                  </div>
                ) : (
                  'Transferir'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}