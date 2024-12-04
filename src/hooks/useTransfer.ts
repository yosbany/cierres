import { useState } from 'react';
import { ref, update, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { Account, Transaction } from '../types';
import { TRANSACTION_STATES } from '../constants';
import { validateTransfer } from '../utils/transferValidation';
import { formatCurrency } from '../utils/formatters';

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

  const getNextTransferNumber = (transactions: Transaction[]): number => {
    if (!transactions || !Array.isArray(transactions)) {
      return 1;
    }

    const transferTransactions = transactions.filter(t => 
      t.concept?.startsWith('Transferencia #')
    );

    if (transferTransactions.length === 0) return 1;

    const numbers = transferTransactions.map(t => {
      const match = t.concept.match(/Transferencia #(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });

    return Math.max(...numbers) + 1;
  };

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
      if (!fromAccount) {
        throw new Error('Cuenta de origen no encontrada');
      }

      const toAccount = accounts.find(acc => acc.id === toAccountId);
      if (!toAccount) {
        throw new Error('Cuenta de destino no encontrada');
      }

      const validationError = validateTransfer({
        fromAccount,
        toAccountId,
        amount
      });

      if (validationError) {
        throw new Error(validationError);
      }

      const nextTransferNumber = getNextTransferNumber(transactions);
      const timestamp = Date.now();
      const transferId = `transfer-${nextTransferNumber}`;
      const transferDescription = description.trim() || `Transferencia de ${fromAccount.name} a ${toAccount.name}`;

      // Create debit transaction (negative amount)
      const debitTransaction: Transaction = {
        id: `${transferId}-debit`,
        concept: `Transferencia #${nextTransferNumber}`,
        description: transferDescription,
        amount: -Math.abs(amount),
        status: TRANSACTION_STATES.COMPLETED.name,
        accountId: fromAccountId,
        timestamp,
        transferId,
        relatedAccountId: toAccountId,
        paymentType: 'transferencia'
      };

      // Create credit transaction (positive amount)
      const creditTransaction: Transaction = {
        id: `${transferId}-credit`,
        concept: `Transferencia #${nextTransferNumber}`,
        description: transferDescription,
        amount: Math.abs(amount),
        status: TRANSACTION_STATES.COMPLETED.name,
        accountId: toAccountId,
        timestamp,
        transferId,
        relatedAccountId: fromAccountId,
        paymentType: 'transferencia'
      };

      // Update account balances
      const updatedAccounts = accounts.map(account => {
        if (account.id === fromAccountId) {
          const newBalance = account.currentBalance - Math.abs(amount);
          if (newBalance < 0) {
            throw new Error(`Saldo insuficiente en ${account.name}. Saldo actual: ${formatCurrency(account.currentBalance)}`);
          }
          return { ...account, currentBalance: newBalance };
        }
        if (account.id === toAccountId) {
          return {
            ...account,
            currentBalance: account.currentBalance + Math.abs(amount)
          };
        }
        return account;
      });

      // Calculate new final balance
      const finalBalance = updatedAccounts.reduce(
        (sum, account) => sum + account.currentBalance,
        0
      );

      const updatedTransactions = [...transactions, debitTransaction, creditTransaction];

      // Update database
      await update(ref(db, `closures/${closureId}`), {
        accounts: updatedAccounts,
        transactions: updatedTransactions,
        finalBalance,
        updatedAt: serverTimestamp()
      });

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