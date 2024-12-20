import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  suggestions: string[];
  onTagsChange: (tags: string[]) => void;
  pendingTag?: string;
  onPendingTagChange?: (tag: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function TagInput({
  tags,
  suggestions,
  onTagsChange,
  pendingTag = '',
  onPendingTagChange,
  disabled = false,
  placeholder = 'Presione Enter para agregar una etiqueta'
}: TagInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (pendingTag) {
      const filtered = suggestions.filter(
        suggestion => 
          suggestion.toLowerCase().includes(pendingTag.toLowerCase()) &&
          !tags.includes(suggestion)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [pendingTag, suggestions, tags]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    if (onPendingTagChange) {
      onPendingTagChange('');
    }
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && pendingTag) {
      e.preventDefault();
      addTag(pendingTag);
    } else if (e.key === 'Backspace' && !pendingTag && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onPendingTagChange) {
      onPendingTagChange(e.target.value);
    }
  };

  const handleBlur = () => {
    // Add pending tag when input loses focus
    if (pendingTag.trim()) {
      addTag(pendingTag);
    }
  };

  return (
    <div className="relative">
      <div className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={pendingTag}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
            className="flex-1 outline-none min-w-[120px] bg-transparent"
            placeholder={tags.length === 0 ? placeholder : ''}
            disabled={disabled}
          />
        </div>
      </div>

      {showSuggestions && !disabled && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200"
        >
          <ul className="max-h-60 overflow-auto py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => addTag(suggestion)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}