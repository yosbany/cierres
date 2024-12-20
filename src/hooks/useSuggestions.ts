import { useState, useEffect, useMemo } from 'react';

export function useSuggestions(value: string, suggestions: string[]) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!value) return [];
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, suggestions]);

  useEffect(() => {
    setShowSuggestions(filteredSuggestions.length > 0 && value.length > 0);
  }, [filteredSuggestions.length, value]);

  return {
    showSuggestions,
    setShowSuggestions,
    filteredSuggestions
  };
}