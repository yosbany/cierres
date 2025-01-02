import { useState, useEffect, useCallback } from 'react';
import { managerApi, ManagerPurchaseOrder } from '../services/api/managerApi';

interface UseManagerOrdersResult {
  orders: ManagerPurchaseOrder[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useManagerOrders(date: string): UseManagerOrdersResult {
  const [orders, setOrders] = useState<ManagerPurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!date) return;

    try {
      setLoading(true);
      setError(null);
      const data = await managerApi.fetchDailyPurchaseOrders(date);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching orders'));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await managerApi.fetchDailyPurchaseOrders(date);
        if (mounted) {
          setOrders(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Error fetching orders'));
          setOrders([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [date]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders
  };
}