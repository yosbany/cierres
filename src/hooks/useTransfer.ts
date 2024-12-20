import { useState } from 'react';
import { ref, update, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { Account, Transaction } from '../types';
import { TRANSACTION_STATES } from '../constants';
import { validateTransfer } from '../utils/transferValidation';
import { useDescriptionTags } from './useDescriptionTags';

interface TransferParams {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  closureId: string;
  accounts: Account[];
  transactions: Transaction[];
}

export function useTransfer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addDescriptionFromTransaction } = useDescriptionTags();

  const executeTransfer = async ({
    fromAccountId,
    toAccountId,
    amount,
    description,
    closureId,
    accounts,
    transactions = []
  }: TransferParams) => {
    try {
      setIsSubmitting(true);

      const fromAccount = accounts.find(acc => acc.id === fromAccountId);
      
      // Validate transfer
      const validationError = validateTransfer({
        fromAccount,
        toAccountId,
        amount
      });

      if (validationError) {
        throw new Error(validationError);
      }

      // Update account balances
      const updatedAccounts = accounts.map(account => {
        if (account.id === fromAccountId) {
          return {
            ...account,
            currentBalance: account.currentBalance - amount
          };
        }
        if (account.id === toAccountId) {
          return {
            ...account,
            currentBalance: account.currentBalance + amount
          };
        }
        return account;
      });

      // Create transfer transactions
      const transferId = `transfer-${Date.now()}`;
      const timestamp = Date.now();
      const transferDescription = description.trim() || 'Transferencia entre cuentas';

      // Create debit transaction (from account)
      const debitTransaction: Transaction = {
        id: `${transferId}-debit`,
        concept: 'Transferencia',
        description: transferDescription,
        amount: -Math.abs(amount),
        status: TRANSACTION_STATES.COMPLETED.name,
        accountId: fromAccountId,
        timestamp,
        transferId,
        relatedAccountId: toAccountId,
        paymentType: 'transferencia'
      };

      // Create credit transaction (to account)
      const creditTransaction: Transaction = {
        id: `${transferId}-credit`,
        concept: 'Transferencia',
        description: transferDescription,
        amount: Math.abs(amount),
        status: TRANSACTION_STATES.COMPLETED.name,
        accountId: toAccountId,
        timestamp,
        transferId,
        relatedAccountId: fromAccountId,
        paymentType: 'transferencia'
      };

      const updatedTransactions = [
        ...transactions,
        debitTransaction,
        creditTransaction
      ];

      // Calculate final balance
      const finalBalance = updatedAccounts.reduce(
        (sum, account) => sum + account.currentBalance,
        0
      );

      // Update database
      await update(ref(db, `closures/${closureId}`), {
        accounts: updatedAccounts,
        transactions: updatedTransactions,
        finalBalance,
        updatedAt: serverTimestamp()
      });

      // Save description for suggestions
      if (transferDescription) {
        await addDescriptionFromTransaction(debitTransaction);
      }

      return {
        updatedAccounts,
        updatedTransactions,
        finalBalance,
        debitTransaction,
        creditTransaction
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al realizar la transferencia';
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    executeTransfer,
    isSubmitting
  };
}