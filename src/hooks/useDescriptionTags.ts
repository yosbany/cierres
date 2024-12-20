import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types';

export function useDescriptionTags() {
  const [descriptionTags, setDescriptionTags] = useState<string[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadDescriptionTags();
  }, [currentUser]);

  const loadDescriptionTags = async () => {
    if (!currentUser) return;

    try {
      const tagsRef = ref(db, `users/${currentUser.uid}/descriptionTags`);
      const snapshot = await get(tagsRef);
      if (snapshot.exists()) {
        setDescriptionTags(snapshot.val());
      }
    } catch (error) {
      console.error('Error loading description tags:', error);
    }
  };

  const saveDescriptionTags = async (tags: string[]) => {
    if (!currentUser) return;

    try {
      const tagsRef = ref(db, `users/${currentUser.uid}/descriptionTags`);
      await set(tagsRef, tags);
      setDescriptionTags(tags);
    } catch (error) {
      console.error('Error saving description tags:', error);
    }
  };

  const addDescriptionFromTransaction = async (transaction: Transaction) => {
    if (!transaction.description?.trim()) return;

    const uniqueTags = Array.from(new Set([...descriptionTags, transaction.description]));
    if (uniqueTags.length !== descriptionTags.length) {
      await saveDescriptionTags(uniqueTags);
    }
  };

  return {
    descriptionTags,
    addDescriptionFromTransaction
  };
}