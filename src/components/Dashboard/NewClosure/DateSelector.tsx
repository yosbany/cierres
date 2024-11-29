import React from 'react';
import { Calendar } from 'lucide-react';
import { getCurrentDate, formatDate, getNextDay } from '../../../utils/dateUtils';

interface DateSelectorProps {
  date: string;
  onDateChange: (date: string) => void;
  isSubmitting: boolean;
  lastClosureDate: string | null;
}

export default function DateSelector({
  date,
  onDateChange,
  isSubmitting,
  lastClosureDate
}: DateSelectorProps) {
  const getMinDate = () => {
    if (!lastClosureDate) return undefined;
    return getNextDay(lastClosureDate);
  };

  const minDate = getMinDate();
  const maxDate = getCurrentDate();

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Fecha del Cierre
      </label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="input pl-10 w-full"
            required
            disabled={isSubmitting}
            min={minDate}
            max={maxDate}
          />
        </div>
        {lastClosureDate && (
          <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-md border border-gray-200">
            <span className="font-medium">Último cierre:</span>{' '}
            {formatDate(lastClosureDate)}
          </div>
        )}
      </div>
      {minDate && date < minDate && (
        <p className="mt-2 text-sm text-red-600">
          La fecha debe ser posterior al último cierre
        </p>
      )}
      {date > maxDate && (
        <p className="mt-2 text-sm text-red-600">
          La fecha no puede ser posterior a hoy
        </p>
      )}
    </div>
  );
}