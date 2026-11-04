import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { getCountries, getCountryCallingCode, getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { ChevronDown, Search } from 'lucide-react';
import './PhoneInput.css';

// Ascension Island and Tristan da Cunha share the St Helena flag
const FLAG_FALLBACK = { AC: 'sh', TA: 'sh' };

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

const byName = getCountries()
  .map((code) => ({
    code,
    name: regionNames.of(code) || code,
    dial: getCountryCallingCode(code),
    flag: FLAG_FALLBACK[code] || code.toLowerCase(),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

// The United States is the default and sits at the top of the list
const COUNTRIES = [
  byName.find((country) => country.code === 'US'),
  ...byName.filter((country) => country.code !== 'US'),
];

function Flag({ country }) {
  return (
    <img
      className="phone-flag"
      src={`/images/flags/${country.flag}.svg`}
      alt=""
      width="22"
      height="16"
      loading="lazy"
    />
  );
}

// Phone field with a searchable country code picker (flag, name, +code)
function PhoneInput({ id, country, onCountryChange, value, onChange, required = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef(null);
  const toggleRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();

  const selected = COUNTRIES.find((item) => item.code === country) || COUNTRIES[0];
  const example = getExampleNumber(selected.code, examples)?.formatNational();

  const results = useMemo(() => {
    const term = query.trim().toLowerCase().replace(/^\+/, '');
    if (!term) return COUNTRIES;
    const matches = COUNTRIES.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.dial.startsWith(term) ||
        item.code.toLowerCase() === term
    );
    // Names that start with the search come first ("uga" → Uganda)
    const starts = (item) => (item.name.toLowerCase().startsWith(term) ? 0 : 1);
    return matches.sort((a, b) => starts(a) - starts(b));
  }, [query]);

  // Close when clicking outside the picker
  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    searchRef.current?.focus();
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Keep the highlighted country in view while using the arrow keys
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const choose = (item) => {
    onCountryChange(item.code);
    setOpen(false);
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSearchKeys = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (results[activeIndex]) choose(results[activeIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    }
  };

  return (
    <div className="phone-input" ref={wrapRef}>
      <div className="phone-input-row">
        <button
          type="button"
          ref={toggleRef}
          className="phone-country"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country code: ${selected.name} +${selected.dial}`}
          onClick={() => {
            setOpen((value) => !value);
            setActiveIndex(0);
          }}
        >
          <Flag country={selected} />
          <span>+{selected.dial}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </button>

        <input
          id={id}
          ref={inputRef}
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          placeholder={example ? `e.g. ${example}` : 'Phone number'}
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>

      {open && (
        <div className="phone-picker">
          <label className="phone-search">
            <Search size={16} aria-hidden="true" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search country or code"
              aria-label="Search country or code"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={results[activeIndex] ? `${listId}-${results[activeIndex].code}` : undefined}
              autoComplete="off"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeys}
            />
          </label>

          {results.length > 0 ? (
            <ul className="phone-list" id={listId} role="listbox" ref={listRef}>
              {results.map((item, index) => (
                <li
                  key={item.code}
                  id={`${listId}-${item.code}`}
                  role="option"
                  aria-selected={item.code === selected.code}
                  className={index === activeIndex ? 'is-active' : ''}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(item)}
                >
                  <Flag country={item} />
                  <span className="phone-list-name">{item.name}</span>
                  <span className="phone-list-dial">+{item.dial}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="phone-empty">No country matches “{query}”.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PhoneInput;
