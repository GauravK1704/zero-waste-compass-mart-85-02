
import React, { useRef, useEffect } from 'react';
import { useSearchLogic } from './search/useSearchLogic';
import SearchInput from './search/SearchInput';
import SearchResults from './search/SearchResults';

const SearchBar: React.FC = () => {
  const searchRef = useRef<HTMLDivElement>(null);
  const {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    isLoading,
    handleResultClick,
    clearSearch
  } = useSearchLogic();

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex-1 max-w-md ml-8 navbar-item relative" ref={searchRef}>
      <SearchInput
        query={query}
        setQuery={setQuery}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClear={clearSearch}
      />
      <SearchResults
        isOpen={isOpen}
        query={query}
        results={results}
        isLoading={isLoading}
        onResultClick={handleResultClick}
      />
    </div>
  );
};

export default SearchBar;
