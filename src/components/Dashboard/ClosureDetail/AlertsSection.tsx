import React from 'react';
import { AlertTriangle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { ClosureAlert } from '../../../hooks/useClosureAlerts';
import { formatCurrency } from '../../../utils/formatters';

interface AlertsSectionProps {
  alerts: ClosureAlert[];
  loading: boolean;
}

export default function AlertsSection({ alerts, loading }: AlertsSectionProps) {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) return null;

  const getAlertIcon = (type: ClosureAlert['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: ClosureAlert['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Alertas</h3>
        <a
          href="https://nuevariodor.manager.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          Abrir Manager.io
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="space-y-4">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`rounded-lg border p-4 ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getAlertIcon(alert.type)}
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {alert.title}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {alert.message}
                </p>
                {alert.details && (
                  <div className="mt-2 text-sm">
                    {alert.details.transaction && (
                      <p className="text-gray-600">
                        Transacción: {alert.details.transaction.description}
                        <span className="ml-2 font-medium">
                          ({formatCurrency(Math.abs(alert.details.transaction.amount))})
                        </span>
                      </p>
                    )}
                    {alert.details.invoiceAmount && (
                      <p className="text-gray-600">
                        Monto en factura: {formatCurrency(alert.details.invoiceAmount)}
                      </p>
                    )}
                    {alert.details.difference && (
                      <p className="font-medium text-red-600">
                        Diferencia: {formatCurrency(alert.details.difference)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}