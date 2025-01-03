import { Account } from '../types';
import { formatCurrency } from './formatters';

interface TransferValidationParams {
  fromAccount: Account | undefined;
  toAccountId: string;
  amount: number;
}

export function validateTransfer({ 
  fromAccount, 
  toAccountId, 
  amount 
}: TransferValidationParams): string | null {
  if (!fromAccount) {
    return 'La cuenta de origen es requerida';
  }

  if (!toAccountId) {
    return 'La cuenta de destino es requerida';
  }

  if (!amount || amount <= 0) {
    return 'El monto debe ser mayor a cero';
  }

  if (fromAccount.id === toAccountId) {
    return 'Las cuentas de origen y destino deben ser diferentes';
  }

  if (fromAccount.currentBalance < amount) {
    return `Saldo insuficiente en la cuenta de origen. Saldo actual: ${formatCurrency(fromAccount.currentBalance)}`;
  }

  return null;
}