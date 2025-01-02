import { DailyClosure } from '../types';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfQuarter,
  endOfQuarter,
  sub,
  format,
  getWeek,
  getYear,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  eachDayOfInterval,
  isWithinInterval,
  parseISO,
  min,
  max,
  isSameWeek,
  isSameMonth,
  isSameYear,
  isSameDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import { TimeRange } from '../components/Dashboard/CashFlow/TimeRangeSelector';
import { GroupingType } from '../components/Dashboard/CashFlow/GroupingSelector';

export interface CashFlowData {
  period: string;
  income: number;
  expense: number;
  balance: number;
}

export function getDateRange(timeRange: TimeRange, customRange?: { startDate: string; endDate: string } | null) {
  const today = new Date();

  if (timeRange === 'custom' && customRange) {
    return {
      startDate: parseISO(customRange.startDate),
      endDate: parseISO(customRange.endDate)
    };
  }

  switch (timeRange) {
    case 'currentWeek':
      return {
        startDate: startOfWeek(today, { locale: es }),
        endDate: endOfWeek(today, { locale: es })
      };
    case 'currentMonth':
      return {
        startDate: startOfMonth(today),
        endDate: endOfMonth(today)
      };
    case 'currentYear':
      return {
        startDate: startOfYear(today),
        endDate: endOfYear(today)
      };
    default: // 'all'
      return null;
  }
}

export function generatePeriods(startDate: Date, endDate: Date, grouping: GroupingType): Date[] {
  switch (grouping) {
    case 'day':
      return eachDayOfInterval({ start: startDate, end: endDate });
    case 'week':
      return eachWeekOfInterval(
        { start: startDate, end: endDate },
        { locale: es }
      );
    case 'month':
      return eachMonthOfInterval({ start: startDate, end: endDate });
    case 'year':
      return eachYearOfInterval({ start: startDate, end: endDate });
    default:
      return [];
  }
}

export function formatPeriod(date: Date, grouping: GroupingType): string {
  switch (grouping) {
    case 'day':
      return format(date, "d 'de' MMMM yyyy", { locale: es });
    case 'week': {
      const weekNumber = getWeek(date, { locale: es });
      const year = getYear(date);
      const nextYear = getYear(endOfWeek(date, { locale: es }));
      
      // If the week spans across years, show both years
      if (year !== nextYear) {
        return `Semana ${weekNumber} - ${year}/${nextYear}`;
      }
      return `Semana ${weekNumber} - ${year}`;
    }
    case 'month':
      return format(date, "MMMM yyyy", { locale: es });
    case 'year':
      return format(date, "yyyy");
    default:
      return '';
  }
}

export function isClosureInPeriod(
  closure: DailyClosure,
  periodStart: Date,
  periodEnd: Date,
  grouping: GroupingType
): boolean {
  const closureDate = parseISO(closure.date);
  
  switch (grouping) {
    case 'day':
      return isSameDay(closureDate, periodStart);
    case 'week':
      return isSameWeek(closureDate, periodStart, { locale: es });
    case 'month':
      return isSameMonth(closureDate, periodStart);
    case 'year':
      return isSameYear(closureDate, periodStart);
    default:
      return isWithinInterval(closureDate, { start: periodStart, end: periodEnd });
  }
}

function calculatePeriodData(closures: DailyClosure[]): {
  income: number;
  expense: number;
  balance: number;
} {
  let income = 0;
  let expense = 0;

  closures.forEach(closure => {
    closure.transactions?.forEach(transaction => {
      if (transaction.amount >= 0) {
        income += transaction.amount;
      } else {
        expense += Math.abs(transaction.amount);
      }
    });
  });

  return {
    income,
    expense,
    balance: income - expense
  };
}

export function calculateCashFlowData(
  closures: DailyClosure[],
  timeRange: TimeRange,
  grouping: GroupingType,
  customRange?: { startDate: string; endDate: string } | null
): CashFlowData[] {
  if (!closures.length) return [];

  // Get all closure dates
  const closureDates = closures.map(c => parseISO(c.date));
  const minDate = min(closureDates);
  const maxDate = max(closureDates);

  // Get date range based on selected time range
  const range = getDateRange(timeRange, customRange);
  const startDate = range ? range.startDate : minDate;
  const endDate = range ? range.endDate : maxDate;

  // Generate all periods in the range
  const periods = generatePeriods(startDate, endDate, grouping);

  // Initialize data structure for all periods
  const periodData: Record<string, DailyClosure[]> = {};
  periods.forEach(date => {
    const period = formatPeriod(date, grouping);
    periodData[period] = [];
  });

  // Group closures by period
  closures.forEach(closure => {
    const closureDate = parseISO(closure.date);
    if (isWithinInterval(closureDate, { start: startDate, end: endDate })) {
      periods.forEach(periodStart => {
        const periodEnd = endOfWeek(periodStart, { locale: es });
        if (isClosureInPeriod(closure, periodStart, periodEnd, grouping)) {
          const period = formatPeriod(periodStart, grouping);
          periodData[period].push(closure);
        }
      });
    }
  });

  // Calculate data for each period
  return Object.entries(periodData)
    .map(([period, periodClosures]) => {
      const { income, expense, balance } = calculatePeriodData(periodClosures);
      return {
        period,
        income,
        expense,
        balance
      };
    })
    .sort((a, b) => periods.findIndex(d => formatPeriod(d, grouping) === a.period) - 
                    periods.findIndex(d => formatPeriod(d, grouping) === b.period));
}