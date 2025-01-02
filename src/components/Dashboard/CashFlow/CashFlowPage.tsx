import React, { useState, useEffect } from 'react';
import { DailyClosure } from '../../../types';
import { ArrowLeft } from 'lucide-react';
import CashFlowChart from './CashFlowChart';
import WaterfallChart from './WaterfallChart';
import { useCashFlowData } from '../../../hooks/useCashFlowData';
import { useWaterfallData } from '../../../hooks/useWaterfallData';
import { TimeRange, TimeRangeSelector } from './TimeRangeSelector';
import { GroupingType, GroupingSelector } from './GroupingSelector';
import DashboardLayout from '../DashboardLayout';

interface CashFlowPageProps {
  closures: DailyClosure[];
  onBack: () => void;
}

// Function to get default grouping based on time range
function getDefaultGrouping(timeRange: TimeRange): GroupingType {
  switch (timeRange) {
    case 'all':
      return 'year';
    case 'currentYear':
      return 'month';
    case 'currentMonth':
      return 'week';
    case 'currentWeek':
      return 'day';
    default:
      return 'year';
  }
}

export default function CashFlowPage({ closures, onBack }: CashFlowPageProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [grouping, setGrouping] = useState<GroupingType>(getDefaultGrouping('all'));
  const [customRange, setCustomRange] = useState<{ startDate: string; endDate: string } | null>(null);

  // Update grouping when time range changes
  useEffect(() => {
    setGrouping(getDefaultGrouping(timeRange));
  }, [timeRange]);

  const { data: cashFlowData, loading: cashFlowLoading } = useCashFlowData({
    closures,
    timeRange,
    grouping,
    customRange
  });

  const { data: waterfallData, loading: waterfallLoading } = useWaterfallData({
    closures,
    timeRange,
    grouping,
    customRange
  });

  const handleCustomRangeChange = (startDate: string, endDate: string) => {
    setTimeRange('custom');
    setCustomRange({ startDate, endDate });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                Flujo de Caja
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <TimeRangeSelector
                  value={timeRange}
                  onChange={setTimeRange}
                  onCustomRangeChange={handleCustomRangeChange}
                  customDateRange={customRange}
                />
                <GroupingSelector
                  value={grouping}
                  onChange={setGrouping}
                />
              </div>

              {cashFlowLoading || waterfallLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : cashFlowData.length > 0 ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Resumen de Flujo de Caja
                    </h3>
                    <div className="h-[400px]">
                      <CashFlowChart data={cashFlowData} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Análisis de Variaciones
                    </h3>
                    <div className="h-[400px]">
                      <WaterfallChart data={waterfallData} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  No hay datos disponibles para el período seleccionado
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}