import React from 'react';
import { X } from 'lucide-react';

interface FinalizeClosureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

export default function FinalizeClosureModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting
}: FinalizeClosureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Finalizar Cierre</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-6">
              ¿Está seguro que desea finalizar el cierre? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Finalizando...
                  </div>
                ) : (
                  'Confirmar'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}