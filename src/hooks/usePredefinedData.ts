import { useState, useEffect } from 'react';
import { DEFAULT_ACCOUNTS, DEFAULT_CONCEPTS } from '../constants';
import { PredefinedAccount, PredefinedConcept } from '../types';

export function usePredefinedData() {
  const [accounts, setAccounts] = useState<PredefinedAccount[]>([]);
  const [concepts, setConcepts] = useState<PredefinedConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Transform accounts from object to array
      const accountsList = Object.entries(DEFAULT_ACCOUNTS).map(([id, account]) => ({
        id,
        name: account.name,
        type: account.type
      }));
      setAccounts(accountsList);

      // Transform concepts from object to array
      const conceptsList = Object.entries(DEFAULT_CONCEPTS).map(([id, concept]) => ({
        id,
        name: concept.name,
        type: concept.type,
        states: concept.states
      }));
      setConcepts(conceptsList);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading predefined data:', error);
      setError('Error al cargar los datos predefinidos');
      setLoading(false);
    }
  }, []);

  return { accounts, concepts, loading, error };
}