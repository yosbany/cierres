import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import DenominationInput from './DenominationInput';

interface CashCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  initialAmount?: number;
}

const BILLS = [2000, 1000, 500, 200, 100, 50, 20];
const COINS = [50, 10, 5, 2, 1];

export default function CashCalculatorModal({
  isOpen,
  onClose,
  onConfirm,
  initialAmount = 0
}: CashCalculatorModalProps) {
  const [denominations, setDenominations] = useState<Record<number, number>>({});
  const [total, setTotal] = useState(0);
  
  const inputRefs = useRef<Record<number, React.RefObject<HTMLInputElement>>>({});

  useEffect(() => {
    [...BILLS, ...COINS].forEach(value => {
      inputRefs.current[value] = React.createRef();
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const initial: Record<number, number> = {};
      [...BILLS, ...COINS].forEach(value => {
        initial[value] = 0;
      });
      setDenominations(initial);
      setTotal(0);

      if (inputRefs.current[BILLS[0]]?.current) {
        inputRefs.current[BILLS[0]].current?.focus();
      }
    }
  }, [isOpen]);

  const handleDenominationChange = (value: number, quantity: number) => {
    const newDenominations = {
      ...denominations,
      [value]: quantity
    };
    setDenominations(newDenominations);

    const newTotal = Object.entries(newDenominations).reduce(
      (sum, [denomination, quantity]) => sum + (Number(denomination) * Number(quantity)),
      0
    );
    setTotal(newTotal);
  };

  const handleReset = () => {
    const resetDenominations: Record<number, number> = {};
    [...BILLS, ...COINS].forEach(value => {
      resetDenominations[value] = 0;
    });
    setDenominations(resetDenominations);
    setTotal(0);

    if (inputRefs.current[BILLS[0]]?.current) {
      inputRefs.current[BILLS[0]].current?.focus();
    }
  };

  const focusNextInput = (currentValue: number) => {
    const allDenominations = [...BILLS, ...COINS];
    const currentIndex = allDenominations.indexOf(currentValue);
    const nextValue = allDenominations[currentIndex + 1];
    
    if (nextValue && inputRefs.current[nextValue]?.current) {
      inputRefs.current[nextValue].current?.focus();
    } else {
      const confirmButton = document.querySelector('[data-confirm-button]') as HTMLButtonElement;
      confirmButton?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">Calculadora de Efectivo</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bills */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-green-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-2 text-green-700">
                    $
                  </span>
                  Billetes
                </h4>
                <div className="space-y-3">
                  {BILLS.map(value => (
                    <DenominationInput
                      key={value}
                      value={value}
                      quantity={denominations[value] || 0}
                      onChange={(quantity) => handleDenominationChange(value, quantity)}
                      type="bill"
                      onEnterPress={() => focusNextInput(value)}
                      inputRef={inputRefs.current[value]}
                    />
                  ))}
                </div>
              </div>

              {/* Coins */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-2 text-blue-700">
                    ¢
                  </span>
                  Monedas
                </h4>
                <div className="space-y-3">
                  {COINS.map(value => (
                    <DenominationInput
                      key={value}
                      value={value}
                      quantity={denominations[value] || 0}
                      onChange={(quantity) => handleDenominationChange(value, quantity)}
                      type="coin"
                      onEnterPress={() => focusNextInput(value)}
                      inputRef={inputRefs.current[value]}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 p-6 bg-gray-900 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-200">Total:</span>
                <span className="text-3xl font-bold">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleReset}
                className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn bg-gray-800 text-white hover:bg-gray-900"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => onConfirm(total)}
                className="btn bg-green-600 text-white hover:bg-green-700"
                data-confirm-button
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}