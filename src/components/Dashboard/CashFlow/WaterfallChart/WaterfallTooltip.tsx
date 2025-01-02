import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';

interface WaterfallTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function WaterfallTooltip({ active, payload, label }: WaterfallTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const { value, runningTotal } = data;

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <p className="font-medium text-gray-900 mb-2">{label}</p>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">
          Variación: <span className={`font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {value >= 0 ? '+' : ''}{formatCurrency(value)}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Balance General: <span className={`font-medium ${runningTotal >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(runningTotal)}
          </span>
        </p>
      </div>
    </div>
  );
}