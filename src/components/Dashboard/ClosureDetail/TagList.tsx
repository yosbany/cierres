import React from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { Tag } from '../../../types';

interface TagListProps {
  tags: Tag[];
  onRemove: (tagId: string) => Promise<void>;
  isClosureOpen: boolean;
  isSubmitting: boolean;
}

export default function TagList({ tags, onRemove, isClosureOpen, isSubmitting }: TagListProps) {
  if (tags.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
          <TagIcon className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">
          No hay etiquetas agregadas
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Las etiquetas ayudan a organizar y filtrar los cierres
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-all group"
        >
          <div className="p-1.5 bg-blue-100 rounded">
            <TagIcon className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {tag.name}
            </p>
            {tag.value && (
              <p className="text-sm text-blue-600 truncate">
                {tag.value}
              </p>
            )}
          </div>
          {isClosureOpen && (
            <button
              onClick={() => onRemove(tag.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Eliminar etiqueta"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}