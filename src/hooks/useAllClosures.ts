import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';
import { DailyClosure } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useAllClosures() {
  const [closures, setClosures] = useState<DailyClosure[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const closuresRef = ref(db, 'closures');
    const closuresQuery = query(closuresRef, orderByChild('date'));

    const unsubscribe = onValue(closuresQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const closuresList = Object.entries(data).map(([id, closure]) => ({
          ...(closure as DailyClosure),
          id
        }));
        
        // Sort by date descending (most recent first)
        const sortedClosures = closuresList.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setClosures(sortedClosures);
      } else {
        setClosures([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { closures, loading };
}