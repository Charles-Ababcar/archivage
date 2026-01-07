import React from 'react';
import { Search } from 'lucide-react';

interface SearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchField: React.FC<SearchProps> = ({ value, onChange, placeholder }) => (
  <div className="relative w-full">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Rechercher..."}
      className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:bg-white focus:ring-2 focus:ring-blue-400 transition-all outline-none"
    />
  </div>
);