import React from 'react';
import { Account } from '../../../types';
import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

interface TransferFormProps {
  accounts: Account[];
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  description: string;
  isSubmitting: boolean;
  onFromAccountChange: (id: string) => void;
  onToAccountChange: (id: string) => void;
  onAmountChange: (amount: string) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function TransferForm({
  accounts,
  fromAccountId,
  toAccountId,
  amount,
  description,
  isSubmitting,
  onFromAccountChange,
  onToAccountChange,
  onAmountChange,
  onDescriptionChange,
  onSubmit,
  onCancel
}: TransferFormProps) {
  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  const maxAmount = fromAccount?.currentBalance || 0;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cuenta Origen
        </label>
        <select
          value={fromAccountId}
          onChange={(e) => onFromAccountChange(e.target.value)}
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
              {account.name} ({formatCurrency(account.currentBalance)})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-gray-400" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cuenta Destino
        </label>
        <select
          value={toAccountId}
          onChange={(e) => onToAccountChange(e.target.value)}
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
              {account.name} ({formatCurrency(account.currentBalance)})
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
            max={maxAmount}
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="input pl-8"
            placeholder="Ingrese el monto a transferir"
            required
            disabled={isSubmitting}
          />
        </div>
        {fromAccount && (
          <p className="mt-1 text-sm text-gray-500">
            Saldo disponible: {formatCurrency(maxAmount)}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="input"
          placeholder="Agregar una descripción"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
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
            parseFloat(amount) > maxAmount
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
  );
}