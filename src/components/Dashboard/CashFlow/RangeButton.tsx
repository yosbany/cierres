import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { TimeRange } from './TimeRangeSelector';

interface RangeButtonProps {
  range: {
    value: TimeRange;
    label: string;
    description: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function RangeButton({ range, isSelected, onClick }: RangeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors ${
        isSelected
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className={`${
        isSelected ? 'text-blue-600' : 'text-gray-400'
      }`}>
        <Calendar className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium ${
          isSelected ? 'text-blue-700' : 'text-gray-900'
        }`}>
          {range.label}
        </div>
        <div className={`text-xs ${
          isSelected ? 'text-blue-600' : 'text-gray-500'
        }`}>
          {range.description}
        </div>
      </div>
      {range.value === 'custom' && (
        <ChevronRight className={`h-4 w-4 ${
          isSelected ? 'text-blue-600' : 'text-gray-400'
        }`} />
      )}
    </button>
  );
}