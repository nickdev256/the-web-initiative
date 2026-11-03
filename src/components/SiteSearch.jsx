import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SEARCH_INDEX, POPULAR_SEARCHES, searchSite } from '../data/searchIndex.js';
import './SiteSearch.css';

// Search box with live suggestions, used in the header panel and the phone
// menu. Arrow keys move through the suggestions and Enter opens one.
function SiteSearch({ variant = 'panel', autoFocus = false, onNavigate }) {
  const [term, setTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const listId = useId();

  const query = term.trim();
  const popular = POPULAR_SEARCHES.map((title) =>
    SEARCH_INDEX.find((entry) => entry.title === title)
  );
  const results = query ? searchSite(query) : popular;
  // The phone menu stays compact until something is typed
  const showList = query !== '' || variant === 'panel';

  const open = (entry) => {
    if (!entry) return;
    setTerm('');
    setActiveIndex(0);
    onNavigate?.();
    navigate(entry.path);
  };

  const handleKeyDown = (event) => {
    if (results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query) open(results[activeIndex] ?? results[0]);
  };

  return (
    <div className={`site-search site-search--${variant}`}>
      <form className="site-search-form" role="search" onSubmit={handleSubmit}>
        <Search size={19} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search the website..."
          aria-label="Search the website"
          role="combobox"
          aria-expanded={showList && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            query && results[activeIndex] ? `${listId}-${activeIndex}` : undefined
          }
          autoComplete="off"
          autoFocus={autoFocus}
          value={term}
          onChange={(event) => {
            setTerm(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" aria-label="Search">
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>

      {showList && (
        <>
          <p className="site-search-label" aria-live="polite">
            {query
              ? results.length > 0
                ? `${results.length} result${results.length === 1 ? '' : 's'}`
                : `No results for “${query}”`
              : 'Popular searches'}
          </p>

          {results.length > 0 ? (
            <ul className="site-search-results" id={listId} role="listbox">
              {results.map((entry, index) => (
                <li
                  key={entry.path}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={query !== '' && index === activeIndex}
                  className={query !== '' && index === activeIndex ? 'is-active' : ''}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => open(entry)}
                >
                  <span className="site-search-text">
                    <strong>{entry.title}</strong>
                    <span>{entry.description}</span>
                  </span>
                  <CornerDownLeft size={16} aria-hidden="true" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="site-search-empty">
              Try “camps”, “donate”, “team” or “contact”.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default SiteSearch;
