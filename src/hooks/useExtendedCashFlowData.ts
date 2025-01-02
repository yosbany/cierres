import { useState, useEffect } from 'react';
import { DailyClosure } from '../types';
import { addMonths, subMonths, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExtendedCashFlowData {
  period: string;
  initialBalance: number;
  finalBalance: number;
  income: number;
  expense: number;
  projectedBalance: number;
  minimumRequired: number;
  lastYearBalance: number;
  hasExtraordinaryEvent: boolean;
}

export function useExtendedCashFlowData(closures: DailyClosure[]) {
  const [data, setData] = useState<ExtendedCashFlowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!closures.length) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      // Get date range for last 24 months
      const now = new Date();
      const startDate = subMonths(now, 24);
      const months: Date[] = [];
      
      for (let i = 0; i <= 24; i++) {
        months.push(addMonths(startDate, i));
      }

      // Calculate monthly data
      const monthlyData = months.map(month => {
        const monthStr = format(month, 'yyyy-MM');
        const monthClosures = closures.filter(closure => 
          closure.date.startsWith(monthStr)
        );

        // Calculate totals for the month
        const monthTotals = monthClosures.reduce((acc, closure) => {
          closure.transactions?.forEach(transaction => {
            if (transaction.amount > 0) {
              acc.income += transaction.amount;
            } else {
              acc.expense += Math.abs(transaction.amount);
            }
          });
          return acc;
        }, { income: 0, expense: 0 });

        // Get last year's data for comparison
        const lastYearMonth = subMonths(month, 12);
        const lastYearMonthStr = format(lastYearMonth, 'yyyy-MM');
        const lastYearClosures = closures.filter(closure => 
          closure.date.startsWith(lastYearMonthStr)
        );
        const lastYearBalance = lastYearClosures.length > 0 
          ? lastYearClosures[lastYearClosures.length - 1].finalBalance 
          : null;

        // Calculate projected balance based on historical patterns
        const projectedBalance = monthTotals.income - monthTotals.expense;

        // Check for extraordinary events (significant deviations from average)
        const hasExtraordinaryEvent = Math.abs(projectedBalance) > 
          (monthTotals.income + monthTotals.expense) / 2;

        return {
          period: format(month, 'MMM yyyy', { locale: es }),
          initialBalance: monthClosures[0]?.accounts.reduce(
            (sum, acc) => sum + acc.initialBalance, 
            0
          ) || 0,
          finalBalance: monthClosures[monthClosures.length - 1]?.finalBalance || 0,
          income: monthTotals.income,
          expense: monthTotals.expense,
          projectedBalance: projectedBalance,
          minimumRequired: monthTotals.expense * 1.2, // 20% buffer
          lastYearBalance: lastYearBalance || 0,
          hasExtraordinaryEvent
        };
      });

      setData(monthlyData);
    } catch (error) {
      console.error('Error calculating extended cash flow data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [closures]);

  return { data, loading };
}