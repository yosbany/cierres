import { Account } from '../types';

interface AccountTotals {
  cashTotal: number;
  bankTotal: number;
  creditTotal: number;
}

export function calculateAccountTotals(accounts: Account[]): AccountTotals {
  return accounts.reduce(
    (totals, account) => {
      switch (account.type) {
        case 'efectivo':
          totals.cashTotal += account.currentBalance;
          break;
        case 'banco':
          totals.bankTotal += account.currentBalance;
          break;
        case 'credito':
          totals.creditTotal += account.currentBalance;
          break;
      }
      return totals;
    },
    { cashTotal: 0, bankTotal: 0, creditTotal: 0 }
  );
}

export function calculateTotalBalance(accounts: Account[]): number {
  return accounts.reduce((total, account) => total + account.currentBalance, 0);
}

export function calculateBalanceDifference(account: Account): number {
  return account.currentBalance - account.initialBalance;
}