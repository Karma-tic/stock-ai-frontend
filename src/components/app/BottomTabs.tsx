import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Radar, Search, Star } from 'lucide-react';

// Signed-in phones and tablets: a glass bottom bar with the five places people go most.
// Search and More open the same search dialog and menu sheet as the top bar.
export const openSearch = () => window.dispatchEvent(new Event('stockai:open-search'));
export const openMenu = () => window.dispatchEvent(new Event('stockai:open-menu'));

export default function BottomTabs() {
  const { pathname, search } = useLocation();
  const tab = new URLSearchParams(search).get('tab');
  const isHome = pathname === '/' && tab !== 'watchlist';
  const isWatch = pathname === '/' && tab === 'watchlist';
  const isToday = pathname === '/today';

  const item = (active: boolean) =>
    `relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium ${active ? 'text-accent' : 'text-muted'}`;
  const bar = <span className="absolute top-0 h-[2px] w-8 rounded-full bg-accent" aria-hidden="true" />;

  return (
    <nav aria-label="App" className="nav-glass fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-[16px] lg:hidden">
      <div className="mx-auto flex max-w-lg">
        <Link to="/" className={item(isHome)} aria-current={isHome ? 'page' : undefined}>
          {isHome && bar}
          <Home className="h-5 w-5" strokeWidth={isHome ? 2.25 : 1.75} />
          Home
        </Link>
        <button type="button" onClick={openSearch} className={item(false)}>
          <Search className="h-5 w-5" strokeWidth={1.75} />
          Search
        </button>
        <Link to="/today" className={item(isToday)} aria-current={isToday ? 'page' : undefined}>
          {isToday && bar}
          <Radar className="h-5 w-5" strokeWidth={isToday ? 2.25 : 1.75} />
          Today
        </Link>
        <Link to="/?tab=watchlist" className={item(isWatch)} aria-current={isWatch ? 'page' : undefined}>
          {isWatch && bar}
          <Star className={`h-5 w-5 ${isWatch ? 'fill-current' : ''}`} strokeWidth={1.75} />
          Watchlist
        </Link>
        <button type="button" onClick={openMenu} className={item(false)}>
          <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
          More
        </button>
      </div>
    </nav>
  );
}
