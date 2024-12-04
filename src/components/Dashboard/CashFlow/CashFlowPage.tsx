import React, { useState } from 'react';
import { DailyClosure } from '../../../types';
import { ArrowLeft } from 'lucide-react';
import CashFlowChart from './CashFlowChart';
import { useCashFlowData } from '../../../hooks/useCashFlowData';
import { TimeRange, TimeRangeSelector } from './TimeRangeSelector';
import { GroupingType, GroupingSelector } from './GroupingSelector';
import DashboardLayout from '../DashboardLayout';

interface CashFlowPageProps {
  closures: DailyClosure[];
  onBack: () => void;
}

export default function CashFlowPage({ closures, onBack }: CashFlowPageProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('currentMonth');
  const [grouping, setGrouping] = useState<GroupingType>('day');
  const [customRange, setCustomRange] = useState<{ startDate: string; endDate: string } | null>(null);

  const { data, loading } = useCashFlowData({
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

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : data.length > 0 ? (
              <div className="h-[600px]">
                <CashFlowChart data={data} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                No hay datos disponibles para el período seleccionado
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}