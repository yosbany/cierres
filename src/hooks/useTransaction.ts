import { useState } from 'react';
import { ref, update, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { Transaction, Account } from '../types';
import { validateTransaction, getInitialTransactionState, formatTransactionAmount } from '../utils/transactionValidation';
import { DEFAULT_CONCEPTS } from '../constants';
import { useDescriptionTags } from './useDescriptionTags';
import toast from 'react-hot-toast';

interface AddTransactionParams {
  closureId: string;
  transaction: Partial<Transaction>;
  accounts: Account[];
  currentTransactions: Transaction[];
}

export function useTransaction() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addDescriptionFromTransaction } = useDescriptionTags();

  const addTransaction = async ({
    closureId,
    transaction,
    accounts,
    currentTransactions
  }: AddTransactionParams) => {
    try {
      if (!transaction.concept || !transaction.accountId) {
        throw new Error('Datos de transacción incompletos');
      }

      const selectedAccount = accounts.find(acc => acc.id === transaction.accountId);
      if (!selectedAccount) {
        throw new Error('Cuenta no encontrada');
      }

      const validationError = validateTransaction({
        concept: transaction.concept,
        accountId: transaction.accountId,
        amount: transaction.amount,
        currentBalance: selectedAccount.currentBalance
      });

      if (validationError) {
        throw new Error(validationError);
      }

      setIsSubmitting(true);

      const conceptDef = Object.values(DEFAULT_CONCEPTS).find(c => c.name === transaction.concept);
      if (!conceptDef) {
        throw new Error('Concepto no encontrado');
      }

      const formattedAmount = formatTransactionAmount(
        transaction.amount || 0,
        conceptDef.type
      );

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        concept: transaction.concept,
        description: transaction.description || '',
        amount: formattedAmount,
        status: getInitialTransactionState(transaction.concept),
        accountId: transaction.accountId,
        timestamp: Date.now(),
        paymentType: transaction.paymentType || 'efectivo'
      };

      const updatedAccounts = accounts.map(account => {
        if (account.id === transaction.accountId) {
          const newBalance = account.currentBalance + formattedAmount;
          if (newBalance < 0) {
            throw new Error(`La operación resultaría en un saldo negativo en la cuenta ${account.name}`);
          }
          return {
            ...account,
            currentBalance: newBalance
          };
        }
        return account;
      });

      const updatedTransactions = [...currentTransactions, newTransaction];
      const finalBalance = updatedAccounts.reduce((sum, account) => sum + account.currentBalance, 0);

      // Update database
      await update(ref(db, `closures/${closureId}`), {
        accounts: updatedAccounts,
        transactions: updatedTransactions,
        finalBalance,
        updatedAt: serverTimestamp()
      });

      // Add description to tags
      if (newTransaction.description) {
        await addDescriptionFromTransaction(newTransaction);
      }

      return {
        transaction: newTransaction,
        accounts: updatedAccounts,
        finalBalance
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al agregar la transacción';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addTransaction,
    isSubmitting
  };
}