import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../../../utils/formatters';
import { ExtendedCashFlowTooltip } from './ExtendedCashFlowTooltip';
import { CashFlowLegend } from './CashFlowLegend';

interface ExtendedCashFlowData {
  period: string;
  initialBalance: number;
  finalBalance: number;
  income: number;
  expense: number;
  projectedBalance: number;
  minimumRequired: number;
  lastYearBalance: number;
  hasExtraordinaryEvent: boolean;
}

interface ExtendedCashFlowChartProps {
  data: ExtendedCashFlowData[];
  minimumCashRequired: number;
}

export default function ExtendedCashFlowChart({ 
  data,
  minimumCashRequired
}: ExtendedCashFlowChartProps) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="period" 
          height={60}
          angle={-45}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={(value) => formatCurrency(value)}
          width={100}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(value) => formatCurrency(value)}
          width={100}
        />
        
        {/* Reference Lines */}
        <ReferenceLine 
          y={0} 
          stroke="#666" 
          strokeDasharray="3 3"
          label={{ value: 'Punto de Equilibrio', position: 'right' }}
        />
        <ReferenceLine
          y={minimumCashRequired}
          stroke="#ff4d4f"
          strokeDasharray="3 3"
          label={{ 
            value: 'Mínimo Requerido', 
            position: 'right',
            fill: '#ff4d4f'
          }}
        />

        {/* Balance Lines */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="finalBalance"
          name="Saldo Final"
          stroke="#1890ff"
          strokeWidth={2}
          dot={{ fill: '#1890ff', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="projectedBalance"
          name="Saldo Proyectado"
          stroke="#52c41a"
          strokeDasharray="5 5"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="lastYearBalance"
          name="Saldo Año Anterior"
          stroke="#722ed1"
          strokeWidth={1}
          dot={false}
          opacity={0.5}
        />

        {/* Income and Expense Lines */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="income"
          name="Ingresos"
          stroke="#52c41a"
          strokeWidth={1}
          dot={{ fill: '#52c41a', r: 3 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="expense"
          name="Egresos"
          stroke="#ff4d4f"
          strokeWidth={1}
          dot={{ fill: '#ff4d4f', r: 3 }}
        />

        <Tooltip content={<ExtendedCashFlowTooltip />} />
        <Legend content={<CashFlowLegend />} />
      </LineChart>
    </ResponsiveContainer>
  );
}