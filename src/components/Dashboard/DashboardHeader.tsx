import React from 'react';
import { Plus, TrendingUp } from 'lucide-react';

interface DashboardHeaderProps {
  onNewClosure: () => void;
  onCashFlow: () => void;
}

export default function DashboardHeader({ onNewClosure, onCashFlow }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-900">Cierres Diarios</h2>
      <div className="flex items-center gap-2">
        <button
          className="btn btn-secondary inline-flex items-center"
          onClick={onCashFlow}
        >
          <TrendingUp className="h-5 w-5 mr-2" />
          Flujo de Caja
        </button>
        <button
          className="btn btn-primary inline-flex items-center"
          onClick={onNewClosure}
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Cierre
        </button>
      </div>
    </div>
  );
}