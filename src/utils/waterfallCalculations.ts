import { DailyClosure } from '../types';
import { TimeRange } from '../components/Dashboard/CashFlow/TimeRangeSelector';
import { GroupingType } from '../components/Dashboard/CashFlow/GroupingSelector';
import { getDateRange, generatePeriods, formatPeriod, isClosureInPeriod } from './cashFlowCalculations';
import { parseISO, min, max, isWithinInterval } from 'date-fns';

interface WaterfallDataPoint {
  name: string;
  value: number;
  fill: string;
  displayValue: number;
  runningTotal: number;
  start: number;
  end: number;
}

export function calculateWaterfallData(
  closures: DailyClosure[],
  timeRange: TimeRange,
  grouping: GroupingType,
  customRange?: { startDate: string; endDate: string } | null
): WaterfallDataPoint[] {
  if (!closures?.length) return [];

  try {
    // Get all closure dates
    const closureDates = closures.map(c => parseISO(c.date));
    const minDate = min(closureDates);
    const maxDate = max(closureDates);

    // Get date range based on selected time range
    const range = getDateRange(timeRange, customRange);
    const startDate = range ? range.startDate : minDate;
    const endDate = range ? range.endDate : maxDate;

    if (!startDate || !endDate) return [];

    // Generate all periods in the range
    const periods = generatePeriods(startDate, endDate, grouping);

    // Calculate period balances
    const periodBalances = periods.map(periodStart => {
      const periodClosures = closures.filter(closure => {
        const closureDate = parseISO(closure.date);
        return isWithinInterval(closureDate, { start: startDate, end: endDate }) &&
               isClosureInPeriod(closure, periodStart, endDate, grouping);
      });

      // Get the last closure in the period to get the final balance
      const lastClosure = periodClosures[periodClosures.length - 1];
      
      return {
        name: formatPeriod(periodStart, grouping),
        balance: lastClosure?.finalBalance || 0
      };
    }).filter(period => period.balance !== 0);

    if (periodBalances.length === 0) return [];

    // Calculate waterfall data
    const waterfallData: WaterfallDataPoint[] = [];
    let previousBalance = periodBalances[0].balance;

    // Add initial period
    waterfallData.push({
      name: periodBalances[0].name,
      value: previousBalance,
      fill: previousBalance >= 0 ? '#00FF00' : '#FF0000',
      displayValue: previousBalance,
      runningTotal: previousBalance,
      start: 0,
      end: previousBalance
    });

    // Add variations for subsequent periods
    for (let i = 1; i < periodBalances.length; i++) {
      const currentBalance = periodBalances[i].balance;
      const variation = currentBalance - previousBalance;

      waterfallData.push({
        name: periodBalances[i].name,
        value: variation,
        fill: variation >= 0 ? '#00FF00' : '#FF0000',
        displayValue: variation,
        runningTotal: currentBalance,
        start: previousBalance,
        end: currentBalance
      });

      previousBalance = currentBalance;
    }

    return waterfallData;
  } catch (error) {
    console.error('Error calculating waterfall data:', error);
    return [];
  }
}