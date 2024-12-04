import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

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
        toast.error('Error al cargar las etiquetas');
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, [currentUser]);

  const addTag = async (newTag: string) => {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    if (tags.includes(newTag)) {
      return; // Tag already exists
    }

    const updatedTags = [...tags, newTag];
    try {
      const tagsRef = ref(db, `users/${currentUser.uid}/transactionTags`);
      await set(tagsRef, updatedTags);
      setTags(updatedTags);
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Error al guardar la etiqueta');
      throw error;
    }
  };

  const addTags = async (newTags: string[]) => {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const uniqueTags = [...new Set([...tags, ...newTags])];
    if (uniqueTags.length === tags.length) {
      return; // No new tags to add
    }

    try {
      const tagsRef = ref(db, `users/${currentUser.uid}/transactionTags`);
      await set(tagsRef, uniqueTags);
      setTags(uniqueTags);
    } catch (error) {
      console.error('Error adding tags:', error);
      toast.error('Error al guardar las etiquetas');
      throw error;
    }
  };

  return { tags, loading, addTag, addTags };
}