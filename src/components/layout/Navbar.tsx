import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Share2, Menu, X, Compass, Info } from 'lucide-react';
import { GlobalSearch } from '@/components/search/GlobalSearch';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-accent-300' : 'text-gray-400 hover:text-gray-200'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-base-700 bg-base-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/10 border border-accent-500/20 group-hover:border-accent-500/40 transition-colors">
            <Share2 className="h-4 w-4 text-accent-400" />
          </div>
          <span className="text-sm font-semibold text-gray-100 hidden sm:block">
            ImpactGraph
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/explore" className={navLinkClass}>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-base-800 transition-colors">
              <Compass className="h-3.5 w-3.5" />
              Explore
            </span>
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-base-800 transition-colors">
              <Info className="h-3.5 w-3.5" />
              About
            </span>
          </NavLink>
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto hidden sm:block">
          <GlobalSearch variant="navbar" />
        </div>

        {/* Right indicator */}
        <div className="hidden lg:flex shrink-0 items-center gap-2 text-xs text-gray-600">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Graph Explorer
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden rounded-lg p-2 text-gray-400 hover:bg-base-800 hover:text-gray-200 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-3">
        <GlobalSearch variant="navbar" />
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-base-700 px-4 py-3 space-y-1 animate-fade-in">
          <NavLink
            to="/explore"
            className={navLinkClass}
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-800">
              <Compass className="h-4 w-4" />
              Explore
            </span>
          </NavLink>
          <NavLink
            to="/about"
            className={navLinkClass}
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-800">
              <Info className="h-4 w-4" />
              About
            </span>
          </NavLink>
        </nav>
      )}
    </header>
  );
}
