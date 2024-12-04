import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Transaction } from '../../../types';
import TagInput from '../TagInput';
import { useTransactionTags } from '../../../hooks/useTransactionTags';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  onSave: (description: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  onSave,
  isSubmitting
}: EditTransactionModalProps) {
  const { tags, addTags } = useTransactionTags();
  const [description, setDescription] = useState(transaction.description);

  const currentTags = description ? 
    description.split(',').map(tag => tag.trim()).filter(Boolean) : 
    [];

  const handleTagsChange = (newTags: string[]) => {
    setDescription(newTags.join(', '));
    addTags(newTags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(description);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Editar Descripción</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <TagInput
                  tags={currentTags}
                  suggestions={tags}
                  onTagsChange={handleTagsChange}
                  disabled={isSubmitting}
                  placeholder="Agregar etiquetas (presione Enter para agregar)"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    'Guardar'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}