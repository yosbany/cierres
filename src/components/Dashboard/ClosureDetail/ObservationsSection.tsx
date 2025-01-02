import React from 'react';

interface ObservationsSectionProps {
  observations: string;
  setObservations: (value: string) => void;
  onSave: () => Promise<void>;
  isSubmitting: boolean;
  isClosureOpen: boolean;
}

export default function ObservationsSection({
  observations,
  setObservations,
  onSave,
  isSubmitting,
  isClosureOpen
}: ObservationsSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Observaciones
      </h3>
      <div className="relative">
        <textarea
          value={observations}
          onChange={e => setObservations(e.target.value)}
          className="input h-32 resize-none w-full mb-2"
          placeholder="Agregar observaciones..."
          disabled={!isClosureOpen || isSubmitting}
        />
        {isClosureOpen && (
          <div className="flex justify-end mt-2">
            <button
              onClick={onSave}
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}