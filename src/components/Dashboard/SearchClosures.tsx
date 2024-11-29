import React from 'react';
import { Search } from 'lucide-react';

interface SearchClosuresProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function SearchClosures({ searchTerm, onSearchChange }: SearchClosuresProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Buscar por fecha, descripción u observaciones..."
      />
    </div>
  );
}