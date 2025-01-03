import { Transaction } from '../types';
import { ManagerPayment } from '../services/api/managerPayments';
import { formatCurrency } from './formatters';

export interface PaymentValidationResult {
  isValid: boolean;
  managerPayment?: ManagerPayment;
  message?: string;
}

export function validatePaymentWithManager(
  transaction: Transaction,
  managerPayments: ManagerPayment[]
): PaymentValidationResult {
  // Only validate expense transactions
  if (transaction.amount >= 0) {
    return { isValid: true };
  }

  const transactionAmount = Math.abs(transaction.amount);
  const matchingPayment = managerPayments.find(
    payment => Math.abs(payment.amount.value - transactionAmount) < 0.01
  );

  if (!matchingPayment) {
    return {
      isValid: false,
      message: `No se encontró un pago en Manager.io por ${formatCurrency(transactionAmount)}`
    };
  }

  return {
    isValid: true,
    managerPayment: matchingPayment
  };
}