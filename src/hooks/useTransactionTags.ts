import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useDescriptionTags } from './useDescriptionTags';

export function useTransactionTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { descriptionTags } = useDescriptionTags();

  useEffect(() => {
    if (!currentUser) return;

    const loadTags = async () => {
      try {
        const tagsRef = ref(db, `users/${currentUser.uid}/transactionTags`);
        const snapshot = await get(tagsRef);
        const savedTags = snapshot.exists() ? snapshot.val() : [];
        
        // Combine saved tags with description tags
        const allTags = Array.from(new Set([...savedTags, ...descriptionTags]));
        setTags(allTags);
      } catch (error) {
        console.error('Error loading tags:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, [currentUser, descriptionTags]);

  const addTags = async (newTags: string[]) => {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const uniqueTags = Array.from(new Set([...tags, ...newTags]));
    if (uniqueTags.length === tags.length) {
      return; // No new tags to add
    }

    try {
      const tagsRef = ref(db, `users/${currentUser.uid}/transactionTags`);
      await set(tagsRef, uniqueTags);
      setTags(uniqueTags);
    } catch (error) {
      console.error('Error adding tags:', error);
      throw error;
    }
  };

  return { tags, loading, addTags };
}