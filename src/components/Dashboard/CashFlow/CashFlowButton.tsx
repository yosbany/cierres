import React from 'react';
import { TrendingUp } from 'lucide-react';
import { DailyClosure } from '../../../types';
import CashFlowModal from './CashFlowModal';

interface CashFlowButtonProps {
  closure: DailyClosure;
}

export default function CashFlowButton({ closure }: CashFlowButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-secondary inline-flex items-center"
        title="Ver flujo de caja"
      >
        <TrendingUp className="h-4 w-4 mr-2" />
        Flujo de Caja
      </button>

      <CashFlowModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closure={closure}
      />
    </>
  );
}