import React, { useState } from 'react';
import { BarChart2, Calendar, CalendarDays, CalendarRange, ChevronDown } from 'lucide-react';

export type GroupingType = 'day' | 'week' | 'month' | 'year';

interface GroupingSelectorProps {
  value: GroupingType;
  onChange: (value: GroupingType) => void;
}

const GROUPING_OPTIONS: Array<{
  value: GroupingType;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'day',
    label: 'Diario',
    description: 'Agrupar datos por día',
    icon: <Calendar className="h-5 w-5" />
  },
  {
    value: 'week',
    label: 'Semanal',
    description: 'Agrupar datos por semana',
    icon: <CalendarDays className="h-5 w-5" />
  },
  {
    value: 'month',
    label: 'Mensual',
    description: 'Agrupar datos por mes',
    icon: <CalendarRange className="h-5 w-5" />
  },
  {
    value: 'year',
    label: 'Anual',
    description: 'Agrupar datos por año',
    icon: <CalendarRange className="h-5 w-5" />
  }
];

export function GroupingSelector({ value, onChange }: GroupingSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = GROUPING_OPTIONS.find(option => option.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <BarChart2 className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          Agrupado {selectedOption?.label}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-2">
            {GROUPING_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors ${
                  value === option.value
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`${
                  value === option.value ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {option.icon}
                </div>
                <div>
                  <div className={`text-sm font-medium ${
                    value === option.value ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-xs ${
                    value === option.value ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}