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
      <h3 className="text-lg font-medium text-gray-900 mb-4">Observaciones</h3>
      <div className="space-y-4">
        <textarea
          value={observations}
          onChange={e => setObservations(e.target.value)}
          className="input h-32 resize-none"
          placeholder="Agregar observaciones..."
          disabled={!isClosureOpen || isSubmitting}
        />
        {isClosureOpen && (
          <div className="flex justify-end">
            <button
              onClick={onSave}
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Guardar Observaciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
}