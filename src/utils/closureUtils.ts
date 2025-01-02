import { DailyClosure } from '../types';

export function getLatestClosure(closures: DailyClosure[]): DailyClosure | null {
  if (!closures?.length) return null;
  
  return closures.reduce((latest, current) => {
    if (!latest) return current;
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  }, null as DailyClosure | null);
}

export function getInitialBalances(closures: DailyClosure[]) {
  const latestClosure = getLatestClosure(closures);
  if (!latestClosure) return {};

  return latestClosure.accounts.reduce((acc, account) => {
    acc[account.id] = Number(account.currentBalance.toFixed(2));
    return acc;
  }, {} as Record<string, number>);
}