import { useState, useEffect } from 'react';
import { DailyClosure, Transaction } from '../types';
import { useManagerOrders } from './useManagerOrders';
import { formatCurrency } from '../utils/formatters';

export interface ClosureAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  details?: {
    transaction?: Transaction;
    orderAmount?: number;
    difference?: number;
    supplier?: string;
    reference?: string;
  };
}

export function useClosureAlerts(closure: DailyClosure) {
  const [alerts, setAlerts] = useState<ClosureAlert[]>([]);
  const { orders, loading, error } = useManagerOrders(closure.date);

  useEffect(() => {
    if (!closure || loading) return;

    const newAlerts: ClosureAlert[] = [];

    if (error) {
      newAlerts.push({
        id: 'api-error',
        type: 'error',
        title: 'Error de Conexión',
        message: 'No se pudo verificar las órdenes de compra en Manager.io. Por favor, intente nuevamente.'
      });
    }

    const supplierPayments = closure.transactions?.filter(t => 
      t.concept === '(-) Pago a Proveedores' && 
      Math.abs(t.amount) > 0
    ) || [];

    if (supplierPayments.length > 0) {
      supplierPayments.forEach(payment => {
        const paymentAmount = Math.abs(payment.amount);
        const matchingOrder = orders.find(order => 
          Math.abs(order.amount - paymentAmount) < 0.01
        );

        if (!matchingOrder) {
          newAlerts.push({
            id: `payment-${payment.id}`,
            type: 'warning',
            title: 'Pago sin Orden de Compra',
            message: `El pago de ${formatCurrency(paymentAmount)} no coincide con ninguna orden de compra registrada en Manager.io`,
            details: {
              transaction: payment
            }
          });
        } else if (Math.abs(matchingOrder.amount - paymentAmount) > 0) {
          const difference = Math.abs(matchingOrder.amount - paymentAmount);
          if (difference > 0.01) {
            newAlerts.push({
              id: `mismatch-${payment.id}`,
              type: 'error',
              title: 'Diferencia en Montos',
              message: `El monto del pago no coincide con la orden de compra registrada en Manager.io`,
              details: {
                transaction: payment,
                orderAmount: matchingOrder.amount,
                difference,
                supplier: matchingOrder.supplier?.name,
                reference: matchingOrder.reference
              }
            });
          }
        }
      });
    }

    setAlerts(newAlerts);
  }, [closure, orders, loading, error]);

  return { alerts, loading };
}