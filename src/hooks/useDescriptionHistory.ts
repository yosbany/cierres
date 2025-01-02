import { useState, useEffect } from 'react';
import { ref, get, push, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Description {
  id?: string;
  text: string;
  timestamp: number;
  userId: string;
}

export function useDescriptionHistory() {
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadDescriptions();
  }, [currentUser]);

  const loadDescriptions = async () => {
    if (!currentUser) return;

    try {
      const descriptionsRef = ref(db, 'descriptions');
      const snapshot = await get(descriptionsRef);
      
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, value]) => ({
          id,
          ...(value as Omit<Description, 'id'>)
        }));
        
        // Sort by most recent first
        const sortedDescriptions = data.sort((a, b) => b.timestamp - a.timestamp);
        setDescriptions(sortedDescriptions);
      }
    } catch (error) {
      console.error('Error loading descriptions:', error);
    }
  };

  const addDescription = async (text: string) => {
    if (!currentUser || !text.trim()) return;

    try {
      const trimmedText = text.trim();
      const descriptionsRef = ref(db, 'descriptions');
      
      // Check if description already exists
      const existingDescription = descriptions.find(d => d.text === trimmedText);
      
      if (existingDescription) {
        // Update timestamp of existing description
        const updates = {
          [`${existingDescription.id}/timestamp`]: Date.now()
        };
        await update(ref(db, 'descriptions'), updates);
      } else {
        // Add new description
        const newDescription: Omit<Description, 'id'> = {
          text: trimmedText,
          timestamp: Date.now(),
          userId: currentUser.uid
        };
        await push(descriptionsRef, newDescription);
      }

      // Reload descriptions to get updated list
      await loadDescriptions();
    } catch (error) {
      console.error('Error saving description:', error);
    }
  };

  return {
    descriptions: descriptions.map(d => d.text),
    addDescription
  };
}