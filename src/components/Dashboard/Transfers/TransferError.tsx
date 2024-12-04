import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TransferErrorProps {
  error: string;
}

export default function TransferError({ error }: TransferErrorProps) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-red-700">{error}</p>
    </div>
  );
}