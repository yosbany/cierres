import { Transaction, Account } from '../types';

export function calculateRunningBalances(
  transactions: Transaction[], 
  accounts: Account[]
): Record<string, number[]> {
  // Initialize balances with account initial balances
  const accountBalances: Record<string, number> = {};
  accounts.forEach(account => {
    accountBalances[account.id] = account.initialBalance;
  });

  // Group transactions by account
  const accountTransactions: Record<string, Transaction[]> = {};
  transactions.forEach(transaction => {
    if (!accountTransactions[transaction.accountId]) {
      accountTransactions[transaction.accountId] = [];
    }
    accountTransactions[transaction.accountId].push(transaction);
  });

  // Calculate running balances for each account
  const runningBalances: Record<string, number[]> = {};
  
  Object.entries(accountTransactions).forEach(([accountId, accountTxs]) => {
    let balance = accountBalances[accountId] || 0;
    runningBalances[accountId] = accountTxs.map(tx => {
      balance += tx.amount;
      return balance;
    });
  });

  return runningBalances;
}