import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useTransactionTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const loadTags = async () => {
      try {
        const tagsRef = ref(db, `users/${currentUser.uid}/transactionTags`);
        const snapshot = await get(tagsRef);
        if (snapshot.exists()) {
          setTags(snapshot.val());
        }
      } catch (error) {
        console.error('Error loading tags:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, [currentUser]);

  const addTag = async (newTag: string) => {
    if (!currentUser || tags.includes(newTag)) return;

    const updatedTags = [...tags, newTag];
    try {
      await set(ref(db, `users/${currentUser.uid}/transactionTags`), updatedTags);
      setTags(updatedTags);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const addTags = async (newTags: string[]) => {
    if (!currentUser) return;

    const uniqueTags = [...new Set([...tags, ...newTags])];
    try {
      await set(ref(db, `users/${currentUser.uid}/transactionTags`), uniqueTags);
      setTags(uniqueTags);
    } catch (error) {
      console.error('Error adding tags:', error);
    }
  };

  return { tags, loading, addTag, addTags };
}