import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface DescriptionEntry {
  text: string;
  timestamp: number;
}

export function useDescriptionHistory() {
  const [descriptions, setDescriptions] = useState<DescriptionEntry[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadDescriptions();
  }, [currentUser]);

  const loadDescriptions = async () => {
    if (!currentUser) return;

    try {
      const descriptionsRef = ref(db, `users/${currentUser.uid}/descriptions`);
      const snapshot = await get(descriptionsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (Array.isArray(data)) {
          // Sort by most recent first
          const sortedDescriptions = [...data].sort((a, b) => b.timestamp - a.timestamp);
          setDescriptions(sortedDescriptions);
        }
      }
    } catch (error) {
      console.error('Error loading descriptions:', error);
    }
  };

  const addDescription = async (text: string) => {
    if (!currentUser || !text.trim()) return;

    try {
      const trimmedText = text.trim();
      const descriptionsRef = ref(db, `users/${currentUser.uid}/descriptions`);
      
      // Create new description entry
      const newDescription: DescriptionEntry = {
        text: trimmedText,
        timestamp: Date.now()
      };

      // Remove existing entry with same text if exists
      const filteredDescriptions = descriptions.filter(d => d.text !== trimmedText);
      
      // Add new entry at the beginning
      const updatedDescriptions = [newDescription, ...filteredDescriptions];
      
      // Keep only the last 50 descriptions
      const limitedDescriptions = updatedDescriptions.slice(0, 50);
      
      await set(descriptionsRef, limitedDescriptions);
      setDescriptions(limitedDescriptions);
    } catch (error) {
      console.error('Error saving description:', error);
    }
  };

  return {
    descriptions: descriptions.map(d => d.text),
    addDescription
  };
}