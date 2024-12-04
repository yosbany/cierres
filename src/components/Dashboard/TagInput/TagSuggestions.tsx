import React, { forwardRef } from 'react';

interface TagSuggestionsProps {
  show: boolean;
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const TagSuggestions = forwardRef<HTMLDivElement, TagSuggestionsProps>(
  ({ show, suggestions, onSelect }, ref) => {
    if (!show) return null;

    return (
      <div
        ref={ref}
        className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200"
      >
        <ul className="max-h-60 overflow-auto py-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => onSelect(suggestion)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

TagSuggestions.displayName = 'TagSuggestions';

export default TagSuggestions;