import React, { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import "../styles/SearchBar.css";

function SearchBar({
  placeholder = "Search documents, categories, or keywords...",
  onSearch,
  showFilters = false
}) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  const clearSearch = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <form className="ll-searchbar" onSubmit={handleSubmit}>
      <Search size={19} className="ll-searchbar-icon" />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search documents"
      />

      {query && (
        <button
          type="button"
          className="ll-searchbar-clear"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <X size={17} />
        </button>
      )}

      {showFilters && (
        <button
          type="button"
          className="ll-searchbar-filter"
          aria-label="Search filters"
        >
          <SlidersHorizontal size={17} />
          <span>Filters</span>
        </button>
      )}

      <button type="submit" className="ll-searchbar-submit">
        Search
      </button>
    </form>
  );
}

export default SearchBar;