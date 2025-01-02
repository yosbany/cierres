import { useState, useEffect } from 'react';
import { ref, query, orderByChild, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { DailyClosure } from '../types';
import { getInitialBalances } from '../utils/closureUtils';

export function useLatestBalances() {
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLatestBalances = async () => {
      try {
        setLoading(true);
        const closuresRef = ref(db, 'closures');
        const closuresQuery = query(closuresRef, orderByChild('date'));
        const snapshot = await get(closuresQuery);

        if (snapshot.exists()) {
          const closures = Object.values(snapshot.val()) as DailyClosure[];
          const initialBalances = getInitialBalances(closures);
          setBalances(initialBalances);
        }
      } catch (err) {
        console.error('Error loading latest balances:', err);
        setError(err instanceof Error ? err : new Error('Failed to load balances'));
      } finally {
        setLoading(false);
      }
    };

    loadLatestBalances();
  }, []);

  return { balances, loading, error };
}