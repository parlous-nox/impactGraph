import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Package, GitBranch, Loader2, CornerDownLeft } from 'lucide-react';
import { api } from '@/api/client';
import type { SearchResult } from '@/api/types';

interface GlobalSearchProps {
  placeholder?: string;
  autoFocus?: boolean;
  variant?: 'navbar' | 'hero' | 'page';
  onNavigate?: () => void;
}

const RECENT_SEARCHES_KEY = 'impactgraph:recent-searches';

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(query: string) {
  try {
    const recent = getRecentSearches().filter((q) => q !== query);
    recent.unshift(query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, 5)));
  } catch {
    // ignore
  }
}

export function GlobalSearch({
  placeholder = 'Search packages or repositories...',
  autoFocus = false,
  variant = 'navbar',
  onNavigate,
}: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const res = await api.searchEntities(query);
      setResults(res);
      setLoading(false);
      setActiveIndex(-1);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleNavigate = (result: SearchResult) => {
    addRecentSearch(result.name);
    setRecentSearches(getRecentSearches());
    if (result.type === 'package') {
      navigate(`/packages/${result.name}`);
    } else if (result.type === 'repository' && result.owner) {
      navigate(`/repositories/${result.owner}/${result.name.split('/').pop()}`);
    }
    setQuery('');
    setOpen(false);
    onNavigate?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) setOpen(true);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        handleNavigate(results[activeIndex]);
      } else if (results.length > 0) {
        handleNavigate(results[0]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const packageResults = results.filter((r) => r.type === 'package');
  const repoResults = results.filter((r) => r.type === 'repository');

  const variantClasses = {
    navbar: 'h-9 text-sm',
    hero: 'h-14 text-base',
    page: 'h-12 text-base',
  };

  const showRecent = !query.trim() && recentSearches.length > 0 && open;
  const showEmpty = query.trim() && !loading && results.length === 0;
  const showResults = query.trim() && (loading || results.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 ${variant === 'hero' ? 'h-5 w-5' : 'h-4 w-4'}`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`input-base pl-10 pr-10 ${variantClasses[variant]} ${variant === 'hero' ? 'pr-24' : ''}`}
          aria-label="Search packages or repositories"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-600 hover:text-gray-400 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {variant === 'hero' && !query && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 rounded border border-base-600 bg-base-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
            <span>⌘</span>K
          </kbd>
        )}
      </div>

      {open && (showRecent || showEmpty || showResults) && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-base-700 bg-base-850 shadow-2xl animate-scale-in">
          {showRecent && (
            <div className="p-2">
              <div className="px-3 py-2 label-meta">Recent Searches</div>
              {recentSearches.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuery(q);
                    inputRef.current?.focus();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-base-800 transition-colors"
                >
                  <Clock className="h-4 w-4 text-gray-600" />
                  {q}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 px-4 py-6 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin text-accent-400" />
              Searching dependency network...
            </div>
          )}

          {showEmpty && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-400">No results found for "{query}"</p>
              <p className="text-xs text-gray-600 mt-1">Try searching for a package name or repository</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {packageResults.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 label-meta">Packages</div>
                  {packageResults.map((r, i) => {
                    const flatIndex = results.indexOf(r);
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleNavigate(r)}
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          activeIndex === flatIndex ? 'bg-base-800' : 'hover:bg-base-800/50'
                        }`}
                      >
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 border border-accent-500/20">
                          <Package className="h-3.5 w-3.5 text-accent-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-100">{r.name}</span>
                            {r.ecosystem && (
                              <span className="text-[10px] text-gray-600">{r.ecosystem}</span>
                            )}
                          </div>
                          <p className="truncate text-xs text-gray-500">{r.description}</p>
                        </div>
                        {activeIndex === flatIndex && (
                          <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {repoResults.length > 0 && (
                <div className={packageResults.length > 0 ? 'mt-2' : ''}>
                  <div className="px-3 py-1.5 label-meta">Repositories</div>
                  {repoResults.map((r) => {
                    const flatIndex = results.indexOf(r);
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleNavigate(r)}
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          activeIndex === flatIndex ? 'bg-base-800' : 'hover:bg-base-800/50'
                        }`}
                      >
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-100">{r.name}</span>
                            {r.language && (
                              <span className="text-[10px] text-gray-600">{r.language}</span>
                            )}
                          </div>
                          <p className="truncate text-xs text-gray-500">{r.description}</p>
                        </div>
                        {activeIndex === flatIndex && (
                          <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
