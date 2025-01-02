import { useState, useEffect } from 'react';
import { DailyClosure } from '../types';
import { TimeRange } from '../components/Dashboard/CashFlow/TimeRangeSelector';
import { GroupingType } from '../components/Dashboard/CashFlow/GroupingSelector';
import { calculateWaterfallData } from '../utils/waterfallCalculations';

interface UseWaterfallDataParams {
  closures: DailyClosure[];
  timeRange: TimeRange;
  grouping: GroupingType;
  customRange?: { startDate: string; endDate: string } | null;
}

export function useWaterfallData({
  closures,
  timeRange,
  grouping,
  customRange
}: UseWaterfallDataParams) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const waterfallData = calculateWaterfallData(closures, timeRange, grouping, customRange);
      setData(waterfallData);
    } catch (error) {
      console.error('Error calculating waterfall data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [closures, timeRange, grouping, customRange]);

  return { data, loading };
}