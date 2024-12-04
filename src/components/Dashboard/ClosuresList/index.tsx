import React from 'react';
import { DailyClosure } from '../../../types';
import { getCurrentDate } from '../../../utils/dateUtils';
import CurrentClosure from './CurrentClosure';
import PreviousClosures from './PreviousClosures';

interface ClosuresListProps {
  closures: DailyClosure[];
  onClosureClick: (closure: DailyClosure) => void;
}

export default function ClosuresList({ closures, onClosureClick }: ClosuresListProps) {
  const today = getCurrentDate();
  const currentClosure = closures.find(closure => closure.date === today);
  const previousClosures = closures
    .filter(closure => closure.date !== today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (closures.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No hay cierres diarios registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentClosure && (
        <CurrentClosure
          closure={currentClosure}
          onClick={onClosureClick}
        />
      )}
      
      <PreviousClosures
        closures={previousClosures}
        onClick={onClosureClick}
      />
    </div>
  );
}