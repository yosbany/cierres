import { Transaction } from '../types';
import { DEFAULT_CONCEPTS } from '../constants';
import { formatCurrency } from './formatters';

interface ValidateTransactionParams {
  concept: string;
  accountId: string;
  amount?: number;
  currentBalance?: number;
}

export function validateTransaction({ 
  concept, 
  accountId, 
  amount,
  currentBalance = 0
}: ValidateTransactionParams): string | null {
  if (!concept) {
    return 'El concepto es requerido';
  }

  if (!accountId) {
    return 'La cuenta es requerida';
  }

  if (amount === undefined || amount === null) {
    return 'El monto es requerido';
  }

  if (amount === 0) {
    return 'El monto debe ser diferente de cero';
  }

  const conceptDef = Object.values(DEFAULT_CONCEPTS).find(c => c.name === concept);
  if (!conceptDef) {
    return 'Concepto inválido';
  }

  // Validate amount sign based on concept type
  if (conceptDef.type === 'ingreso' && amount < 0) {
    return 'El monto debe ser positivo para ingresos';
  }

  if (conceptDef.type === 'egreso' && amount > 0) {
    return 'El monto debe ser negativo para egresos';
  }

  // Check if transaction would result in negative balance
  if (conceptDef.type === 'egreso') {
    const finalBalance = currentBalance + amount;
    if (finalBalance < 0) {
      return `Saldo insuficiente. El saldo actual es ${formatCurrency(currentBalance)} y la operación requiere ${formatCurrency(Math.abs(amount))}`;
    }
  }

  return null;
}

export function getInitialTransactionState(concept: string): string {
  const conceptDef = Object.values(DEFAULT_CONCEPTS).find(c => c.name === concept);
  return conceptDef?.states[0]?.name || '';
}

export function formatTransactionAmount(amount: number, conceptType: 'ingreso' | 'egreso'): number {
  if (conceptType === 'ingreso') {
    return Math.abs(amount);
  }
  if (conceptType === 'egreso') {
    return -Math.abs(amount);
  }
  return amount;
}