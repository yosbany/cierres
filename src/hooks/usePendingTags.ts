import { useState } from 'react';
import { useTransactionTags } from './useTransactionTags';

export function usePendingTags() {
  const [pendingTag, setPendingTag] = useState('');
  const { addTags } = useTransactionTags();

  const handleTagsChange = async (currentTags: string[]) => {
    if (pendingTag.trim()) {
      const newTags = [...currentTags, pendingTag.trim()];
      await addTags(newTags);
      setPendingTag('');
      return newTags;
    }
    return currentTags;
  };

  return {
    pendingTag,
    setPendingTag,
    handleTagsChange
  };
}