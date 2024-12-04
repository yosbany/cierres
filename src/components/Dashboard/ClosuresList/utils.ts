import { DailyClosure } from '../../../types';

export function calculateBalances(closure: DailyClosure) {
  return closure.accounts.reduce(
    (acc, account) => {
      if (account.type === 'efectivo') {
        acc.cashBalance += account.currentBalance;
      } else if (account.type === 'banco') {
        acc.bankBalance += account.currentBalance;
      } else if (account.type === 'credito') {
        acc.creditBalance += account.currentBalance;
      }
      return acc;
    },
    { cashBalance: 0, bankBalance: 0, creditBalance: 0 }
  );
}