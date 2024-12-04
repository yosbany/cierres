import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DailyClosure } from '../../../types';
import { ArrowLeft, Printer, Trash2, Lock } from 'lucide-react';
import { generateClosurePDF } from '../../../utils/pdfGenerator';
import DeleteClosureModal from '../DeleteClosureModal';
import { formatDate } from '../../../utils/dateUtils';

interface ClosureHeaderProps {
  closure: DailyClosure;
  onBack: () => void;
  onFinalize: () => void;
  onDelete: () => void;
  isSubmitting: boolean;
}

export default function ClosureHeader({
  closure,
  onBack,
  onFinalize,
  onDelete,
  isSubmitting
}: ClosureHeaderProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleGeneratePDF = () => {
    const doc = generateClosurePDF({
      closure,
      accounts: closure.accounts,
      transactions: closure.transactions,
      observations: closure.observations || ''
    });
    doc.save(`cierre-${closure.date}.pdf`);
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {formatDate(closure.date)}
          </h2>
          <p className="text-sm text-gray-500">
            Estado: {closure.status === 'open' ? 'Abierto' : 'Cerrado'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleGeneratePDF}
          className="btn btn-secondary inline-flex items-center"
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </button>
        {closure.status === 'open' && (
          <>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn bg-red-600 hover:bg-red-700 text-white inline-flex items-center"
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </button>
            <button
              onClick={onFinalize}
              className="btn bg-green-600 hover:bg-green-700 text-white inline-flex items-center"
              disabled={isSubmitting}
            >
              <Lock className="h-4 w-4 mr-2" />
              Finalizar
            </button>
          </>
        )}
      </div>

      <DeleteClosureModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}