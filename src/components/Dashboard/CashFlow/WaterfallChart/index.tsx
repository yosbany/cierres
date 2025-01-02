import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../../../utils/formatters';
import { WaterfallTooltip } from './WaterfallTooltip';
import { CustomLegend } from './CustomLegend';

interface WaterfallDataPoint {
  name: string;
  value: number;
  fill: string;
  displayValue: number;
  runningTotal: number;
  start: number;
  end: number;
}

interface WaterfallChartProps {
  data: WaterfallDataPoint[];
}

export default function WaterfallChart({ data }: WaterfallChartProps) {
  if (!data?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos disponibles para el período seleccionado</p>
      </div>
    );
  }

  // Calculate domain for y-axis with padding
  const allValues = data.reduce((acc, d) => {
    acc.push(d.start, d.end);
    return acc;
  }, [] as number[]);

  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = Math.abs(maxValue - minValue) * 0.2; // 20% padding

  // Add padding items for better visualization
  const paddedData = [
    { ...data[0], name: '', value: 0, fill: 'transparent' },
    ...data,
    { ...data[data.length - 1], name: '', value: 0, fill: 'transparent' }
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={paddedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          interval={0}
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ 
            dy: 10,
            fontSize: 12
          }}
        />
        <YAxis
          domain={[minValue - padding, maxValue + padding]}
          tickFormatter={(value) => formatCurrency(value)}
          width={100}
        />
        <Tooltip content={<WaterfallTooltip />} />
        <Legend 
          content={<CustomLegend />}
          verticalAlign="top"
          height={36}
        />
        <ReferenceLine y={0} stroke="#666" />
        <Bar
          dataKey="value"
          fill={(data) => data.fill}
          radius={[4, 4, 0, 0]}
          barSize={40}
          stackId="stack"
          label={{
            position: 'top',
            content: (props: any) => {
              const { value, x, y, width } = props;
              if (!value || value === 0) return null;
              return (
                <text
                  x={x + width / 2}
                  y={y - 10}
                  textAnchor="middle"
                  fill={value >= 0 ? '#059669' : '#DC2626'}
                  fontSize={12}
                >
                  {formatCurrency(Math.abs(value))}
                </text>
              );
            }
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}