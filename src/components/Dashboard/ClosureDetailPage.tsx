import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DailyClosure } from '../../types';
import ClosureDetail from './ClosureDetail';

interface ClosureDetailPageProps {
  closures: DailyClosure[];
  onBack: () => void;
}

export default function ClosureDetailPage({ closures, onBack }: ClosureDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [closure, setClosure] = useState<DailyClosure | null>(null);

  useEffect(() => {
    const selectedClosure = closures.find(c => c.id === id);
    if (selectedClosure) {
      setClosure(selectedClosure);
    }
  }, [id, closures]);

  if (!closure) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <ClosureDetail closure={closure} onBack={onBack} />;
}