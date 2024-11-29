import React from 'react';
import { Transaction } from '../../types';
import { usePredefinedData } from '../../hooks/usePredefinedData';
import { useTransactionTags } from '../../hooks/useTransactionTags';
import { PlusCircle, MinusCircle } from 'lucide-react';
import TagInput from './TagInput';

interface TransactionFormProps {
  transaction: Partial<Transaction>;
  onUpdate: (transaction: Partial<Transaction>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
  accounts: Array<{ id: string; name: string; type: string }>;
}

export default function TransactionForm({
  transaction,
  onUpdate,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing,
  accounts
}: TransactionFormProps) {
  const { concepts } = usePredefinedData();
  const { tags, addTags } = useTransactionTags();

  const selectedConcept = concepts?.find(c => c.name === transaction.concept);

  const isValid = transaction.concept && 
                 transaction.accountId && 
                 transaction.amount !== undefined && 
                 transaction.amount !== null && 
                 !isNaN(transaction.amount);

  const toggleAmountSign = () => {
    if (transaction.amount !== undefined && transaction.amount !== null) {
      onUpdate({
        ...transaction,
        amount: -transaction.amount
      });
    }
  };

  const handleConceptChange = (conceptName: string) => {
    const concept = concepts?.find(c => c.name === conceptName);
    if (concept) {
      onUpdate({
        ...transaction,
        concept: conceptName,
        amount: undefined
      });
    }
  };

  const handleAmountChange = (value: string) => {
    const numericValue = value === '' ? undefined : parseFloat(value);
    
    if (numericValue === undefined) {
      onUpdate({
        ...transaction,
        amount: undefined
      });
      return;
    }

    if (isNaN(numericValue)) return;
    
    const concept = concepts?.find(c => c.name === transaction.concept);
    let newAmount = numericValue;

    if (concept?.type === 'egreso') {
      newAmount = -Math.abs(numericValue);
    } else if (concept?.type === 'ingreso') {
      newAmount = Math.abs(numericValue);
    }
    
    onUpdate({
      ...transaction,
      amount: newAmount
    });
  };

  const handleTagsChange = (newTags: string[]) => {
    onUpdate({
      ...transaction,
      description: newTags.join(', ')
    });
    addTags(newTags);
  };

  const currentTags = transaction.description ? 
    transaction.description.split(',').map(tag => tag.trim()).filter(Boolean) : 
    [];

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Editar Movimiento' : 'Nuevo Movimiento'}
        </h4>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="sr-only">Cerrar</span>
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <select
          value={transaction.concept || ''}
          onChange={e => handleConceptChange(e.target.value)}
          className="input"
          disabled={isSubmitting}
        >
          <option value="">Seleccionar concepto</option>
          {concepts?.map(concept => (
            <option key={concept.id} value={concept.name}>
              {concept.name}
            </option>
          ))}
        </select>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <TagInput
            tags={currentTags}
            suggestions={tags}
            onTagsChange={handleTagsChange}
            disabled={isSubmitting}
            placeholder="Agregar etiquetas (presione Enter para agregar)"
          />
        </div>

        <select
          value={transaction.accountId || ''}
          onChange={e => onUpdate({ ...transaction, accountId: e.target.value })}
          className="input"
          disabled={isSubmitting}
        >
          <option value="">Seleccionar cuenta</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>

        <div className="relative">
          <input
            type="number"
            step="0.01"
            placeholder="Monto"
            value={transaction.amount !== undefined ? Math.abs(transaction.amount).toString() : ''}
            onChange={e => handleAmountChange(e.target.value)}
            className="input pl-12"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={toggleAmountSign}
            className={`absolute left-2 top-1/2 -translate-y-1/2 ${
              transaction.amount && transaction.amount < 0 
                ? 'text-red-500 hover:text-red-700' 
                : 'text-green-500 hover:text-green-700'
            }`}
            disabled={isSubmitting || transaction.amount === undefined || transaction.amount === null}
            title={transaction.amount && transaction.amount < 0 ? "Cambiar a positivo" : "Cambiar a negativo"}
          >
            {transaction.amount && transaction.amount < 0 ? (
              <MinusCircle className="h-5 w-5" />
            ) : (
              <PlusCircle className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          className="btn btn-primary"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}