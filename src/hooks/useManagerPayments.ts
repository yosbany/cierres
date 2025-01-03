import { useState, useEffect } from 'react';
import { managerPayments, ManagerPayment } from '../services/api/managerPayments';

export function useManagerPayments(date: string) {
  const [payments, setPayments] = useState<ManagerPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await managerPayments.fetchDailyPayments(date);
        if (mounted) {
          setPayments(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Error fetching payments'));
          setPayments([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPayments();

    return () => {
      mounted = false;
    };
  }, [date]);

  return { payments, loading, error };
}