import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ref, push, serverTimestamp, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { usePredefinedData } from '../../../hooks/usePredefinedData';
import toast from 'react-hot-toast';
import { formatDateForDB, getCurrentDate } from '../../../utils/dateUtils';
import NewClosureForm from './NewClosureForm';

interface NewClosureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccountInput {
  accountId: string;
  initialBalance: string;
}

export const NewClosureModal = ({ isOpen, onClose }: NewClosureModalProps) => {
  const { currentUser } = useAuth();
  const { accounts, loading, error } = usePredefinedData();
  const [date, setDate] = useState(getCurrentDate());
  const [selectedAccounts, setSelectedAccounts] = useState<AccountInput[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastClosureDate, setLastClosureDate] = useState<string | null>(null);
  const [previousBalances, setPreviousBalances] = useState<Record<string, number>>({});
  const [hasActiveClosures, setHasActiveClosures] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (!currentUser || !accounts) return;

    setSelectedAccounts(
      accounts.map(account => ({
        accountId: account.id,
        initialBalance: ''
      }))
    );

    loadLastClosureData();
  }, [currentUser, accounts]);

  const checkActiveClosures = async () => {
    if (!currentUser) return;

    try {
      const closuresRef = ref(db, 'closures');
      const activeClosuresQuery = query(
        closuresRef,
        orderByChild('userId'),
        equalTo(currentUser.uid)
      );

      const snapshot = await get(activeClosuresQuery);
      if (snapshot.exists()) {
        const closures = Object.values(snapshot.val());
        const hasActive = closures.some((closure: any) => closure.status === 'open');
        setHasActiveClosures(hasActive);

        if (hasActive) {
          toast.error('Ya existe un cierre activo. Debe finalizar el cierre actual antes de crear uno nuevo.');
          onClose();
        }
      }
    } catch (error) {
      console.error('Error checking active closures:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkActiveClosures();
    }
  }, [isOpen]);

  const loadLastClosureData = async () => {
    if (!currentUser) return;

    try {
      const closuresRef = ref(db, 'closures');
      const userClosuresQuery = query(
        closuresRef,
        orderByChild('userId'),
        equalTo(currentUser.uid)
      );

      const snapshot = await get(userClosuresQuery);
      
      if (snapshot.exists()) {
        const closures = Object.values(snapshot.val());
        const sortedClosures = closures.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (sortedClosures.length > 0) {
          const lastClosure = sortedClosures[0] as any;
          setLastClosureDate(lastClosure.date);

          const balances: Record<string, number> = {};
          lastClosure.accounts.forEach((account: any) => {
            balances[account.id] = account.currentBalance;
          });
          setPreviousBalances(balances);

          setSelectedAccounts(accounts.map(account => ({
            accountId: account.id,
            initialBalance: balances[account.id]?.toString() || ''
          })));
        }
      }
    } catch (error) {
      console.error('Error loading last closure:', error);
      toast.error('Error al cargar el último cierre');
    }
  };

  const handleAccountChange = (index: number, field: 'accountId' | 'initialBalance', value: string) => {
    setSelectedAccounts(selectedAccounts.map((account, i) => 
      i === index ? { ...account, [field]: value } : account
    ));
  };

  const validateDate = async (dateStr: string) => {
    if (!currentUser) return false;

    try {
      const closuresRef = ref(db, 'closures');
      const formattedDate = formatDateForDB(dateStr);
      
      const closuresQuery = query(
        closuresRef,
        orderByChild('userId'),
        equalTo(currentUser.uid)
      );

      const snapshot = await get(closuresQuery);
      
      if (snapshot.exists()) {
        const closures = Object.values(snapshot.val());
        return closures.some((closure: any) => closure.date === formattedDate);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking date:', error);
      throw new Error('Error al verificar la fecha');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Usuario no autenticado');
      return;
    }

    if (hasActiveClosures) {
      toast.error('Ya existe un cierre activo. Debe finalizar el cierre actual antes de crear uno nuevo.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!date) {
        throw new Error('La fecha es requerida');
      }

      if (lastClosureDate && date <= lastClosureDate) {
        throw new Error('La fecha debe ser posterior al último cierre');
      }

      const existingClosure = await validateDate(date);
      if (existingClosure) {
        throw new Error('Ya existe un cierre para la fecha seleccionada');
      }

      if (selectedAccounts.some(acc => !acc.accountId || acc.initialBalance === '')) {
        throw new Error('Por favor complete todos los saldos iniciales');
      }

      const validAccounts = selectedAccounts.map(account => {
        const predefinedAccount = accounts.find(a => a.id === account.accountId);
        if (!predefinedAccount) {
          throw new Error('Cuenta no encontrada');
        }

        const initialBalance = parseFloat(account.initialBalance);
        if (isNaN(initialBalance)) {
          throw new Error('El saldo inicial debe ser un número válido');
        }

        if (initialBalance < 0) {
          throw new Error('Los saldos iniciales no pueden ser negativos');
        }

        return {
          id: account.accountId,
          name: predefinedAccount.name,
          type: predefinedAccount.type,
          initialBalance,
          currentBalance: initialBalance
        };
      });

      const finalBalance = validAccounts.reduce((sum, account) => sum + account.initialBalance, 0);
      const formattedDate = formatDateForDB(date);

      const newClosure = {
        date: formattedDate,
        status: 'open',
        accounts: validAccounts,
        transactions: [],
        observations: '',
        userId: currentUser.uid,
        finalBalance,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await push(ref(db, 'closures'), newClosure);
      
      toast.success('Cierre diario creado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al crear el cierre:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear el cierre diario');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-25"></div>
        <div className="relative bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Nuevo Cierre Diario</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <NewClosureForm
              date={date}
              onDateChange={setDate}
              accounts={accounts}
              selectedAccounts={selectedAccounts}
              onAccountChange={handleAccountChange}
              isSubmitting={isSubmitting}
              lastClosureDate={lastClosureDate}
              previousBalances={previousBalances}
            />

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || hasActiveClosures}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </div>
                ) : (
                  'Crear Cierre'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};