import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DailyClosure } from '../../../types';
import CashFlowChart from './CashFlowChart';
import { useCashFlowData } from '../../../hooks/useCashFlowData';
import { TimeRange, TimeRangeSelector } from './TimeRangeSelector';
import { GroupingType, GroupingSelector } from './GroupingSelector';

interface CashFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  closures: DailyClosure[];
}

export default function CashFlowModal({
  isOpen,
  onClose,
  closures
}: CashFlowModalProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [grouping, setGrouping] = useState<GroupingType>('month');
  const { data, loading } = useCashFlowData(closures, timeRange, grouping);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              Flujo de Caja
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TimeRangeSelector
                value={timeRange}
                onChange={setTimeRange}
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
              <CashFlowChart data={data} />
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                No hay datos disponibles para el período seleccionado
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}