import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../../utils/formatters';

interface CashFlowData {
  period: string;
  income: number;
  expense: number;
  balance: number;
}

interface CashFlowChartProps {
  data: CashFlowData[];
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart 
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="period" 
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ 
            dy: 10,
            fontSize: 12
          }}
        />
        <YAxis
          tickFormatter={(value) => formatCurrency(value)}
          width={100}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          labelStyle={{ color: '#374151' }}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem'
          }}
        />
        <Legend 
          verticalAlign="top"
          height={36}
        />
        <Bar
          dataKey="income"
          name="Ingresos"
          fill="#34D399"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expense"
          name="Egresos"
          fill="#F87171"
          radius={[4, 4, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="balance"
          name="Balance"
          stroke="#6366F1"
          strokeWidth={2}
          dot={{ fill: '#6366F1', r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}