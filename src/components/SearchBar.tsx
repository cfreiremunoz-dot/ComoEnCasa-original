import { useState, type FormEvent } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { Search } from 'lucide-react';

interface SearchBarProps {
  variant?: 'hero' | 'inline';
  initialQuery?: string;
  placeholder?: string;
  onQueryChange?: (query: string) => void;
  onSearch?: (query: string) => void;
}

export function SearchBar({ variant = 'inline', initialQuery = '', placeholder = 'Busca lugares, barrios, rincones...', onQueryChange, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const normalizedQuery = query.trim();
    if (onSearch) {
      onSearch(normalizedQuery);
      return;
    }
    if (normalizedQuery) params.set('q', normalizedQuery);
    navigate(`/explora${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={onSubmit}
      className={`relative flex items-center w-full ${isHero ? 'max-w-2xl' : ''}`}
    >
      <Search
        className={`absolute left-4 h-5 w-5 ${isHero ? 'text-tinta-400' : 'text-tinta-400'}`}
        strokeWidth={1.75}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onQueryChange?.(e.target.value);
        }}
        placeholder={placeholder}
        aria-label="Buscar"
        className={`w-full rounded-full border bg-white/90 pl-12 pr-32 text-sm text-tinta-800 placeholder:text-tinta-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terracota-400/30 ${
          isHero
            ? 'h-14 border-white/60 shadow-lg shadow-tinta-900/10 focus:border-terracota-300'
            : 'h-12 border-tinta-200 focus:border-terracota-400'
        }`}
      />
      <button
        type="submit"
        className={`absolute right-2 rounded-full font-semibold text-crema-100 transition-all duration-200 hover:bg-terracota-600 active:scale-95 ${
          isHero ? 'h-10 px-5 bg-terracota-500 text-sm' : 'h-8 px-4 bg-terracota-500 text-xs'
        }`}
      >
        Buscar
      </button>
    </form>
  );
}
