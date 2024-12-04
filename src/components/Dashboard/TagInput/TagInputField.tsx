import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import TagSuggestions from './TagSuggestions';
import { formatTagInput } from '../../../utils/tagFormatters';

interface TagInputFieldProps {
  tags: string[];
  suggestions: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function TagInputField({
  tags,
  suggestions,
  onTagsChange,
  disabled = false,
  placeholder = 'Escriba el nombre de la etiqueta y presione Enter'
}: TagInputFieldProps) {
  const [input, setInput] = useState('');
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
    if (input) {
      const filtered = suggestions.filter(
        suggestion => 
          suggestion.toLowerCase().includes(input.toLowerCase()) &&
          !tags.some(tag => tag.startsWith(suggestion + ':'))
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [input, suggestions, tags]);

  const addTag = (tagInput: string) => {
    const formattedTag = formatTagInput(tagInput);
    if (formattedTag && !tags.includes(formattedTag)) {
      onTagsChange([...tags, formattedTag]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => {
            const [name, value] = tag.split(':').map(part => part.trim());
            return (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {name}
                {value && (
                  <span className="ml-1 text-blue-600">: {value}</span>
                )}
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
            );
          })}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
            className="flex-1 outline-none min-w-[120px] bg-transparent"
            placeholder={tags.length === 0 ? placeholder : ''}
            disabled={disabled}
          />
        </div>
      </div>

      <TagSuggestions
        ref={suggestionsRef}
        show={showSuggestions}
        suggestions={filteredSuggestions}
        onSelect={addTag}
      />
    </div>
  );
}