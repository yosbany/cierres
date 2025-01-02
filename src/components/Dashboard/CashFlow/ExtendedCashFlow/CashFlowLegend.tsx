import React from 'react';

export function CashFlowLegend() {
  const items = [
    { name: 'Saldo Final', color: '#1890ff' },
    { name: 'Saldo Proyectado', color: '#52c41a', dashed: true },
    { name: 'Saldo Año Anterior', color: '#722ed1' },
    { name: 'Ingresos', color: '#52c41a' },
    { name: 'Egresos', color: '#ff4d4f' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-4">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div 
            className="w-8 h-0.5" 
            style={{ 
              backgroundColor: item.color,
              borderStyle: item.dashed ? 'dashed' : 'solid',
              borderWidth: item.dashed ? '1px' : '0'
            }}
          />
          <span className="text-sm text-gray-600">{item.name}</span>
        </div>
      ))}
    </div>
  );
}