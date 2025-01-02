import React from 'react';

export function CustomLegend() {
  return (
    <div className="flex justify-center items-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#00FF00' }} />
        <span className="text-sm text-gray-600">Incrementos</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FF0000' }} />
        <span className="text-sm text-gray-600">Decrementos</span>
      </div>
    </div>
  );
}