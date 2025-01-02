import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';

export function ExtendedCashFlowTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const hasAlert = data.projectedBalance < data.minimumRequired;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-2">{label}</h3>
      
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-600">
            Saldo Final: <span className="font-medium text-blue-600">
              {formatCurrency(data.finalBalance)}
            </span>
          </p>
          {data.projectedBalance && (
            <p className="text-sm text-gray-600">
              Proyectado: <span className={`font-medium ${hasAlert ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(data.projectedBalance)}
              </span>
              {hasAlert && (
                <span className="ml-2 text-xs text-red-600">
                  ⚠️ Por debajo del mínimo
                </span>
              )}
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-2">
          <p className="text-sm text-gray-600">
            Ingresos: <span className="font-medium text-green-600">
              {formatCurrency(data.income)}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Egresos: <span className="font-medium text-red-600">
              {formatCurrency(data.expense)}
            </span>
          </p>
        </div>

        {data.lastYearBalance && (
          <div className="border-t border-gray-200 pt-2">
            <p className="text-sm text-gray-600">
              Año anterior: <span className="font-medium text-purple-600">
                {formatCurrency(data.lastYearBalance)}
              </span>
            </p>
          </div>
        )}

        {data.hasExtraordinaryEvent && (
          <div className="mt-2 text-xs bg-yellow-50 p-2 rounded text-yellow-800">
            ⚠️ Incluye eventos extraordinarios
          </div>
        )}
      </div>
    </div>
  );
}