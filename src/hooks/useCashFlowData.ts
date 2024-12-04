import { useState, useEffect } from 'react';
import { DailyClosure } from '../types';
import { TimeRange } from '../components/Dashboard/CashFlow/TimeRangeSelector';
import { GroupingType } from '../components/Dashboard/CashFlow/GroupingSelector';
import { calculateCashFlowData, CashFlowData } from '../utils/cashFlowCalculations';

interface UseCashFlowDataParams {
  closures: DailyClosure[];
  timeRange: TimeRange;
  grouping: GroupingType;
  customRange?: { startDate: string; endDate: string } | null;
}

export function useCashFlowData({
  closures,
  timeRange,
  grouping,
  customRange
}: UseCashFlowDataParams) {
  const [data, setData] = useState<CashFlowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const calculatedData = calculateCashFlowData(closures, timeRange, grouping, customRange);
      setData(calculatedData);
    } catch (error) {
      console.error('Error calculating cash flow data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [closures, timeRange, grouping, customRange]);

  return { data, loading };
}