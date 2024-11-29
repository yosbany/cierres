import { useState } from 'react';
import { ref, update, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { Transaction, Account } from '../types';
import { validateTransaction, getInitialTransactionState, formatTransactionAmount } from '../utils/transactionValidation';
import { DEFAULT_CONCEPTS } from '../constants';

interface AddTransactionParams {
  closureId: string;
  transaction: Partial<Transaction>;
  accounts: Account[];
  currentTransactions: Transaction[];
}

export function useTransaction() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTransaction = async ({
    closureId,
    transaction,
    accounts,
    currentTransactions
  }: AddTransactionParams) => {
    if (!transaction.concept || !transaction.accountId) {
      throw new Error('Datos de transacción incompletos');
    }

    const validationError = validateTransaction({
      concept: transaction.concept,
      accountId: transaction.accountId,
      amount: transaction.amount
    });

    if (validationError) {
      throw new Error(validationError);
    }

    setIsSubmitting(true);

    try {
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
          return {
            ...account,
            currentBalance: account.currentBalance + formattedAmount
          };
        }
        return account;
      });

      const updatedTransactions = [...currentTransactions, newTransaction];
      const finalBalance = updatedAccounts.reduce((sum, account) => sum + account.currentBalance, 0);

      await update(ref(db, `closures/${closureId}`), {
        accounts: updatedAccounts,
        transactions: updatedTransactions,
        finalBalance,
        updatedAt: serverTimestamp()
      });

      return {
        transaction: newTransaction,
        accounts: updatedAccounts,
        finalBalance
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addTransaction,
    isSubmitting
  };
}