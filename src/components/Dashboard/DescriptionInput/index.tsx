import React, { useState, useRef, useEffect } from 'react';
import { useDescriptionTags } from '../../../hooks/useDescriptionTags';
import Suggestions from './Suggestions';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function DescriptionInput({
  value,
  onChange,
  disabled = false,
  placeholder = "Escriba o seleccione una descripción"
}: DescriptionInputProps) {
  const { descriptionTags } = useDescriptionTags();
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
    if (value) {
      const filtered = descriptionTags.filter(tag => 
        tag.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value, descriptionTags]);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
        className="input w-full"
        placeholder={placeholder}
        disabled={disabled}
      />

      <Suggestions
        ref={suggestionsRef}
        show={showSuggestions}
        suggestions={filteredSuggestions}
        onSelect={handleSelect}
      />
    </div>
  );
}