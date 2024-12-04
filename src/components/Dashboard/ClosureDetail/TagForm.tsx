import React, { useState, useEffect } from 'react';
import { useTransactionTags } from '../../../hooks/useTransactionTags';
import { Tag } from '../../../types';
import toast from 'react-hot-toast';

interface TagFormProps {
  onSubmit: (tag: Tag) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function TagForm({ onSubmit, onCancel, isSubmitting }: TagFormProps) {
  const [tagName, setTagName] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { tags: savedTags, addTag: addSavedTag } = useTransactionTags();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      const trimmedName = tagName.trim();
      if (!trimmedName) return;

      setIsProcessing(true);
      try {
        // Save the new tag name if it doesn't exist
        if (!savedTags.includes(trimmedName)) {
          await addSavedTag(trimmedName);
        }

        // Create and submit the tag
        const newTag: Tag = {
          id: Date.now().toString(),
          name: trimmedName,
          value: tagValue.trim() || undefined
        };

        await onSubmit(newTag);
        setTagName('');
        setTagValue('');
      } catch (error) {
        console.error('Error saving tag:', error);
        toast.error('Error al guardar la etiqueta');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = tagName.trim();
    if (!trimmedName) return;

    setIsProcessing(true);
    try {
      // Save the new tag name if it doesn't exist
      if (!savedTags.includes(trimmedName)) {
        await addSavedTag(trimmedName);
      }

      const newTag: Tag = {
        id: Date.now().toString(),
        name: trimmedName,
        value: tagValue.trim() || undefined
      };

      await onSubmit(newTag);
      setTagName('');
      setTagValue('');
    } catch (error) {
      console.error('Error saving tag:', error);
      toast.error('Error al guardar la etiqueta');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Etiqueta
          </label>
          <div className="relative">
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input w-full pr-8"
              placeholder="Escriba o seleccione una etiqueta"
              list="saved-tags"
              required
              disabled={isSubmitting || isProcessing}
            />
            <datalist id="saved-tags">
              {savedTags.map((tag, index) => (
                <option key={index} value={tag} />
              ))}
            </datalist>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Presione Enter para guardar la etiqueta
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor (opcional)
          </label>
          <input
            type="text"
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input w-full"
            placeholder="Ingrese el valor"
            disabled={isSubmitting || isProcessing}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting || isProcessing}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || isProcessing || !tagName.trim()}
        >
          {isSubmitting || isProcessing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Agregando...
            </div>
          ) : (
            'Agregar'
          )}
        </button>
      </div>
    </form>
  );
}