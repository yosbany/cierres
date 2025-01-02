import { useState, useEffect, useCallback } from 'react';
import { managerApi, ManagerPurchaseInvoice } from '../services/api/managerApi';
import toast from 'react-hot-toast';

interface UseManagerInvoicesResult {
  invoices: ManagerPurchaseInvoice[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useManagerInvoices(date: string): UseManagerInvoicesResult {
  const [invoices, setInvoices] = useState<ManagerPurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: unknown) => {
    const error = err instanceof Error ? err : new Error('Failed to fetch invoices');
    setError(error);
    setInvoices([]);

    if (error.name === 'ManagerApiError') {
      switch ((error as any).code) {
        case 'AUTH_ERROR':
          toast.error('Error de autenticación con Manager.io. Por favor, verifique las credenciales.');
          break;
        case 'NETWORK_ERROR':
          toast.error('Error de conexión con Manager.io. Por favor, verifique su conexión a internet.');
          break;
        default:
          toast.error('Error al obtener facturas de Manager.io. Por favor, intente nuevamente.');
      }
    } else {
      toast.error('Error al obtener facturas de Manager.io. Por favor, intente nuevamente.');
    }
  }, []);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await managerApi.fetchDailyPurchaseInvoices(date);
      setInvoices(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [date, handleError]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await managerApi.fetchDailyPurchaseInvoices(date);
        if (mounted) {
          setInvoices(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          handleError(err);
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
  }, [date, handleError]);

  return {
    invoices,
    loading,
    error,
    refetch: fetchInvoices
  };
}