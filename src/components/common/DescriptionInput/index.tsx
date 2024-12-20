import React, { useRef, useEffect, useCallback } from 'react';
import { useDescriptionHistory } from '../../../hooks/useDescriptionHistory';
import { useSuggestions } from '../../../hooks/useSuggestions';
import DescriptionField from './DescriptionField';
import Suggestions from './Suggestions';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function DescriptionInput({
  value,
  onChange,
  onSave,
  disabled = false,
  placeholder = "Escriba o seleccione una descripción"
}: DescriptionInputProps) {
  const { descriptions, addDescription } = useDescriptionHistory();
  const { 
    showSuggestions, 
    setShowSuggestions, 
    filteredSuggestions 
  } = useSuggestions(value, descriptions);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  }, [setShowSuggestions]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleSelect = async (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    if (onSave) {
      await onSave(suggestion);
    }
    await addDescription(suggestion);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      if (onSave) {
        await onSave(value);
      }
      await addDescription(value);
      setShowSuggestions(false);
    }
  };

  const handleBlur = useCallback(async () => {
    if (value.trim()) {
      await addDescription(value);
    }
  }, [value, addDescription]);

  const handleFocus = useCallback(() => {
    if (filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [filteredSuggestions.length, setShowSuggestions]);

  return (
    <div className="relative">
      <DescriptionField
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
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