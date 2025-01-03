import { useState, useEffect } from 'react';
import { DailyClosure, Transaction } from '../types';
import { useManagerPayments } from './useManagerPayments';
import { validatePaymentWithManager } from '../utils/paymentValidation';
import { formatCurrency } from '../utils/formatters';

export interface ClosureAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  details?: {
    transaction?: Transaction;
    paymentAmount?: number;
    difference?: number;
    payee?: string;
    paidFrom?: string;
  };
}

export function useClosureAlerts(closure: DailyClosure) {
  const [alerts, setAlerts] = useState<ClosureAlert[]>([]);
  const { payments, loading, error } = useManagerPayments(closure.date);

  useEffect(() => {
    if (!closure || loading) return;

    const newAlerts: ClosureAlert[] = [];

    if (error) {
      newAlerts.push({
        id: 'api-error',
        type: 'error',
        title: 'Error de Conexión',
        message: 'No se pudo verificar los pagos en Manager.io. Por favor, intente nuevamente.'
      });
    }

    // Filter expense transactions
    const expenseTransactions = closure.transactions?.filter(t => 
      t.amount < 0 && 
      Math.abs(t.amount) > 0
    ) || [];

    if (expenseTransactions.length > 0) {
      expenseTransactions.forEach(transaction => {
        const validation = validatePaymentWithManager(transaction, payments);
        
        if (!validation.isValid) {
          newAlerts.push({
            id: `payment-${transaction.id}`,
            type: 'warning',
            title: 'Pago no encontrado en Manager',
            message: validation.message || 'El pago no fue encontrado en Manager.io',
            details: {
              transaction
            }
          });
        } else if (validation.managerPayment) {
          const difference = Math.abs(validation.managerPayment.amount.value - Math.abs(transaction.amount));
          if (difference > 0.01) {
            newAlerts.push({
              id: `mismatch-${transaction.id}`,
              type: 'error',
              title: 'Diferencia en Montos',
              message: 'El monto del pago no coincide con el registrado en Manager.io',
              details: {
                transaction,
                paymentAmount: validation.managerPayment.amount.value,
                difference,
                payee: validation.managerPayment.payee,
                paidFrom: validation.managerPayment.paidFrom
              }
            });
          }
        }
      });
    }

    setAlerts(newAlerts);
  }, [closure, payments, loading, error]);

  return { alerts, loading };
}