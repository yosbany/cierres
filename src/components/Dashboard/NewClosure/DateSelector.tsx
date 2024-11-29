import React from 'react';
import { Calendar } from 'lucide-react';
import { getCurrentDate } from '../../../utils/dateUtils';

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
            min={lastClosureDate ? new Date(lastClosureDate).toISOString().split('T')[0] : undefined}
            max={getCurrentDate()}
          />
        </div>
        {lastClosureDate && (
          <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-md border border-gray-200">
            <span className="font-medium">Último cierre:</span>{' '}
            {new Date(lastClosureDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}