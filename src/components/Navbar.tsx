import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, LogOut, Menu, Moon, Search, Star, Sun, X } from 'lucide-react';
import UpgradeModal from './UpgradeModal';
import SearchDialog from './SearchDialog';
import Logo from './ui/Logo';
import { Button, ButtonLink } from './ui/Button';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const PRIMARY = [
  { to: '/today', label: 'Today' },
  { to: '/stocks', label: 'Stocks', end: true },
  { to: '/ipos', label: 'IPOs' },
  { to: '/invest', label: 'Invest' },
  { to: '/learn', label: 'Learn' },
];
const MORE = [
  { to: '/market-wrap', label: 'Market Wrap' },
  { to: '/stocks/dividends', label: 'Dividends' },
  { to: '/tools', label: 'Tools' },
  { to: '/track-record', label: 'Track Record' },
  { to: '/blog', label: 'Blog' },
];

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

function useDismiss(open: boolean, close: () => void, refs: React.RefObject<HTMLElement | null>[]) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (refs.some((r) => r.current?.contains(t))) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, close]);
}

export default function Navbar({ user, isDarkMode, onToggleTheme }: { user: any; isDarkMode: boolean; onToggleTheme: () => void }) {
  const location = useLocation();
  const navRef = useRef<HTMLElement | null>(null);
  const [sheet, setSheet] = useState(false);
  const [more, setMore] = useState(false);
  const [account, setAccount] = useState(false);
  const [search, setSearch] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);

  const closeMore = useCallback(() => setMore(false), []);
  const closeAccount = useCallback(() => setAccount(false), []);
  const closeSearch = useCallback(() => setSearch(false), []);
  useDismiss(more, closeMore, [moreRef]);
  useDismiss(account, closeAccount, [accountRef]);

  useEffect(() => {
    const token = localStorage.getItem('sb_token');
    if (!token) return;
    axios
      .get(`${BASE}/api/payment/status`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setIsPro(res.data.plan === 'pro'))
      .catch(() => {});
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setSheet(false);
    setMore(false);
    setAccount(false);
  }, [location.pathname]);

  // Publish the nav height for sticky/pinned sections (no scroll or resize listeners)
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const set = () => document.documentElement.style.setProperty('--nav-h', `${Math.round(nav.getBoundingClientRect().height)}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  // The signed-in bottom bar opens search and the menu through these events
  useEffect(() => {
    const onSearch = () => setSearch(true);
    const onMenu = () => setSheet(true);
    window.addEventListener('stockai:open-search', onSearch);
    window.addEventListener('stockai:open-menu', onMenu);
    return () => {
      window.removeEventListener('stockai:open-search', onSearch);
      window.removeEventListener('stockai:open-menu', onMenu);
    };
  }, []);

  // ⌘K / Ctrl K / "/" open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el?.tagName);
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearch(true);
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        setSearch(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock page scroll behind the mobile sheet
  useEffect(() => {
    if (!sheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheet]);

  const logout = async () => {
    const { supabase } = await import('../lib/supabase');
    await supabase.auth.signOut();
    localStorage.removeItem('sb_token');
    window.location.reload();
  };

  const moreActive = MORE.some((m) => location.pathname.startsWith(m.to));
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex h-16 items-center px-1 text-sm font-medium transition duration-micro ${
      isActive ? 'text-ink after:absolute after:inset-x-1 after:bottom-3 after:h-[2px] after:rounded-full after:bg-accent' : 'text-muted hover:text-ink'
    }`;

  return (
    <>
      <nav ref={navRef} className="nav-glass sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-[16px]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-5">
          <Link to="/" className="flex min-h-[44px] shrink-0 items-center" aria-label="Stock AI home">
            <Logo />
          </Link>

          {/* Search: looks like an input, opens the palette */}
          <button
            type="button"
            onClick={() => setSearch(true)}
            className="hidden h-10 min-w-0 items-center gap-2 rounded-control border border-line bg-surface/70 px-3 text-sm text-muted transition hover:border-accent/40 hover:text-ink lg:flex lg:w-44 xl:w-60"
          >
            <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="truncate">Search stocks</span>
            <kbd className="ml-auto hidden rounded border border-line px-1.5 font-mono text-[11px] xl:inline">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>

          <div className="hidden items-center gap-4 lg:flex xl:gap-5">
            {PRIMARY.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkCls}>
                {item.label}
              </NavLink>
            ))}
            <div ref={moreRef} className="relative">
              <button
                type="button"
                aria-expanded={more}
                aria-haspopup="menu"
                onClick={() => setMore((m) => !m)}
                className={`inline-flex h-16 items-center gap-1 px-1 text-sm font-medium transition ${moreActive || more ? 'text-ink' : 'text-muted hover:text-ink'}`}
              >
                More <ChevronDown className={`h-4 w-4 transition duration-ui ${more ? 'rotate-180' : ''}`} strokeWidth={1.75} />
              </button>
              {more && (
                <div role="menu" className="absolute left-0 top-[calc(100%-8px)] w-56 rounded-card border border-line bg-surface p-1.5 shadow-lift">
                  {MORE.map((m) => (
                    <NavLink
                      key={m.to}
                      to={m.to}
                      role="menuitem"
                      className={({ isActive }) =>
                        `flex min-h-[40px] items-center rounded-control px-3 text-sm transition ${isActive ? 'bg-accent/10 font-medium text-accent' : 'text-ink hover:bg-ink/[0.06]'}`
                      }
                    >
                      {m.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearch(true)}
              aria-label="Search stocks"
              className={`h-11 w-11 items-center justify-center rounded-control text-ink/80 hover:bg-ink/[0.06] lg:hidden ${user ? 'hidden' : 'flex'}`}
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              className={`h-10 w-10 items-center justify-center rounded-control text-ink/80 hover:bg-ink/[0.06] sm:flex ${user ? 'flex' : 'hidden'}`}
            >
              {isDarkMode ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} />}
            </button>

            {user ? (
              <>
                {isPro ? (
                  <span className="hidden items-center gap-1 rounded-full border border-accent/40 px-2.5 py-1 text-xs font-semibold text-accent sm:inline-flex">
                    <Star className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Pro
                  </span>
                ) : (
                  <Button size="sm" onClick={() => setShowUpgrade(true)} className="hidden sm:inline-flex">
                    Go Pro
                  </Button>
                )}
                <div ref={accountRef} className="relative hidden lg:block">
                  <button
                    type="button"
                    aria-expanded={account}
                    aria-haspopup="menu"
                    aria-label="Account menu"
                    onClick={() => setAccount((a) => !a)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-sm font-semibold uppercase text-ink hover:border-accent/50"
                  >
                    {(user?.email || '?').slice(0, 1)}
                  </button>
                  {account && (
                    <div role="menu" className="absolute right-0 top-[calc(100%+8px)] w-64 rounded-card border border-line bg-surface p-1.5 shadow-lift">
                      <p className="truncate px-3 py-2 text-xs text-muted">{user?.email}</p>
                      <button type="button" role="menuitem" onClick={logout} className="flex min-h-[40px] w-full items-center gap-2 rounded-control px-3 text-sm text-ink hover:bg-ink/[0.06]">
                        <LogOut className="h-4 w-4" strokeWidth={1.75} /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden min-h-[40px] items-center px-2 text-sm font-medium text-muted hover:text-ink lg:inline-flex">
                  Log in
                </Link>
                <ButtonLink to="/login" size="sm" className="hidden sm:inline-flex">
                  Start free
                </ButtonLink>
              </>
            )}

            <button
              type="button"
              onClick={() => setSheet(true)}
              aria-expanded={sheet}
              aria-label="Open menu"
              className={`h-11 w-11 items-center justify-center rounded-control text-ink hover:bg-ink/[0.06] lg:hidden ${user ? 'hidden' : 'flex'}`}
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </nav>

      {/* Phones and tablets: a full-height sheet with grouped links and the main action at the bottom */}
      {sheet && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-[#0B0F14]/60" onClick={() => setSheet(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-canvas pb-[env(safe-area-inset-bottom)] shadow-lift">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo />
              <button type="button" autoFocus onClick={() => setSheet(false)} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-control hover:bg-ink/[0.06]">
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <p className="px-2 text-xs font-medium text-muted">Research</p>
              <ul className="mt-1">
                {PRIMARY.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => `flex min-h-[48px] items-center rounded-control px-2 text-base ${isActive ? 'font-semibold text-accent' : 'text-ink'}`}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <p className="mt-5 px-2 text-xs font-medium text-muted">More</p>
              <ul className="mt-1">
                {MORE.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className={({ isActive }) => `flex min-h-[48px] items-center rounded-control px-2 text-base ${isActive ? 'font-semibold text-accent' : 'text-ink'}`}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={onToggleTheme} className="mt-5 flex min-h-[48px] w-full items-center justify-between rounded-control border border-line px-3 text-sm text-ink">
                {isDarkMode ? 'Light theme' : 'Dark theme'}
                {isDarkMode ? <Sun className="h-4 w-4" strokeWidth={1.75} /> : <Moon className="h-4 w-4" strokeWidth={1.75} />}
              </button>
            </div>
            <div className="space-y-2 border-t border-line p-4">
              {user ? (
                <>
                  {isPro ? (
                    <p className="text-center text-sm font-semibold text-accent">You are on Pro</p>
                  ) : (
                    <Button size="lg" className="w-full" onClick={() => setShowUpgrade(true)}>
                      Go Pro
                    </Button>
                  )}
                  <Button variant="ghost" size="lg" className="w-full" onClick={logout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <ButtonLink to="/login" size="lg" className="w-full">
                    Start free
                  </ButtonLink>
                  <ButtonLink to="/login" variant="quiet" size="lg" className="w-full">
                    Log in
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchDialog open={search} onClose={closeSearch} />
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onSuccess={() => setIsPro(true)} />}
    </>
  );
}
