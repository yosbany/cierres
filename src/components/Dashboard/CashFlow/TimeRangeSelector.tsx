import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import RangeButton from './RangeButton';
import CustomRangePopover from './CustomRangePopover';

export type TimeRange = 'all' | 'currentYear' | 'currentMonth' | 'currentWeek' | 'custom';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  onCustomRangeChange?: (startDate: string, endDate: string) => void;
  customDateRange?: { startDate: string; endDate: string } | null;
}

const TIME_RANGES: Array<{ value: TimeRange; label: string; description: string }> = [
  { value: 'all', label: 'Todos', description: 'Mostrar todos los períodos' },
  { value: 'currentYear', label: 'Año Actual', description: 'Datos del año en curso' },
  { value: 'currentMonth', label: 'Mes Actual', description: 'Datos del mes en curso' },
  { value: 'currentWeek', label: 'Semana Actual', description: 'Datos de la semana en curso' },
  { value: 'custom', label: 'Personalizado', description: 'Seleccionar rango personalizado' }
];

export function TimeRangeSelector({ value, onChange, onCustomRangeChange, customDateRange }: TimeRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);

  const selectedRange = TIME_RANGES.find(range => range.value === value);
  const customRangeLabel = customDateRange 
    ? `${format(new Date(customDateRange.startDate), 'dd/MM/yyyy')} - ${format(new Date(customDateRange.endDate), 'dd/MM/yyyy')}`
    : '';

  const handleRangeSelect = (rangeValue: TimeRange) => {
    onChange(rangeValue);
    if (rangeValue !== 'custom') {
      setShowCustomRange(false);
      setIsOpen(false);
    } else {
      setShowCustomRange(true);
    }
  };

  const handleCustomRangeApply = (startDate: string, endDate: string) => {
    if (onCustomRangeChange) {
      onCustomRangeChange(startDate, endDate);
      setShowCustomRange(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Calendar className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {value === 'custom' && customRangeLabel ? customRangeLabel : selectedRange?.label}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-2">
            {TIME_RANGES.map((range) => (
              <RangeButton
                key={range.value}
                range={range}
                isSelected={value === range.value}
                onClick={() => handleRangeSelect(range.value)}
              />
            ))}
          </div>
        </div>
      )}

      <CustomRangePopover
        isOpen={showCustomRange}
        onClose={() => setShowCustomRange(false)}
        onApply={handleCustomRangeApply}
        initialStartDate={customDateRange?.startDate}
        initialEndDate={customDateRange?.endDate}
      />
    </div>
  );
}