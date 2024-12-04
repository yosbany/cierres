import React, { useState } from 'react';
import { Plus, Tag as TagIcon } from 'lucide-react';
import { Tag } from '../../../types';
import TagForm from './TagForm';
import TagList from './TagList';

interface TagsSummaryProps {
  tags: Tag[];
  onAddTag: (tag: Tag) => Promise<void>;
  onRemoveTag: (tagId: string) => Promise<void>;
  isClosureOpen: boolean;
  isSubmitting: boolean;
}

export default function TagsSummary({
  tags,
  onAddTag,
  onRemoveTag,
  isClosureOpen,
  isSubmitting
}: TagsSummaryProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTag = async (tag: Tag) => {
    try {
      await onAddTag(tag);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error in TagsSummary:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TagIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Etiquetas del Cierre
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Organice y categorice el cierre con etiquetas
              </p>
            </div>
          </div>
          {isClosureOpen && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-secondary inline-flex items-center text-sm"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-1" />
              Nueva Etiqueta
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {showAddForm && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Agregar Nueva Etiqueta
              </h4>
              <ul className="text-sm text-blue-700 space-y-1.5">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Seleccione una etiqueta existente o cree una nueva
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  El valor es opcional y puede ser cualquier texto
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Las etiquetas facilitan la búsqueda y organización
                </li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <TagForm
                onSubmit={handleAddTag}
                onCancel={() => setShowAddForm(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}

        <TagList
          tags={tags}
          onRemove={onRemoveTag}
          isClosureOpen={isClosureOpen}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}