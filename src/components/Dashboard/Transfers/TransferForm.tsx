import React, { useState } from 'react';
import { Account } from '../../../types';
import { ArrowRight } from 'lucide-react';
import { validateTransfer } from '../../../utils/transferValidation';
import AccountSelect from './AccountSelect';
import AmountInput from './AmountInput';
import TransferError from './TransferError';
import DescriptionInput from '../../common/DescriptionInput';

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  const maxAmount = fromAccount?.currentBalance || 0;

  React.useEffect(() => {
    if (fromAccountId && toAccountId && amount) {
      const error = validateTransfer({
        fromAccount,
        toAccountId,
        amount: parseFloat(amount)
      });
      setValidationError(error);
    } else {
      setValidationError(null);
    }
  }, [fromAccountId, toAccountId, amount, fromAccount]);

  const isValid = Boolean(
    fromAccountId &&
    toAccountId &&
    amount &&
    parseFloat(amount) > 0 &&
    description.trim() &&
    !validationError
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AccountSelect
        label="Cuenta Origen"
        accounts={accounts}
        value={fromAccountId}
        onChange={onFromAccountChange}
        disabledId={toAccountId}
        isSubmitting={isSubmitting}
      />

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-gray-400" />
      </div>

      <AccountSelect
        label="Cuenta Destino"
        accounts={accounts}
        value={toAccountId}
        onChange={onToAccountChange}
        disabledId={fromAccountId}
        isSubmitting={isSubmitting}
      />

      <AmountInput
        value={amount}
        onChange={onAmountChange}
        maxAmount={maxAmount}
        isSubmitting={isSubmitting}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <DescriptionInput
          value={description}
          onChange={onDescriptionChange}
          disabled={isSubmitting}
          placeholder="Escriba o seleccione una descripción"
        />
      </div>

      <TransferError error={validationError || ''} />

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
          disabled={isSubmitting || !isValid}
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