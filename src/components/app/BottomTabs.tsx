import { Link, useLocation } from 'react-router-dom';
import { m, useReducedMotion } from 'motion/react';
import { HomeIcon, MoreIcon, SearchIcon, TodayIcon, WatchIcon } from './TabIcons';

// Signed-in phones and tablets: a glass bottom bar with the five places people go most.
// Search and More open the same search dialog and menu sheet as the top bar.
export const openSearch = () => window.dispatchEvent(new Event('stockai:open-search'));
export const openMenu = () => window.dispatchEvent(new Event('stockai:open-menu'));

export default function BottomTabs() {
  const { pathname, search } = useLocation();
  const reduce = useReducedMotion();
  const tab = new URLSearchParams(search).get('tab');
  const isHome = pathname === '/' && tab !== 'watchlist';
  const isWatch = pathname === '/' && tab === 'watchlist';
  const isToday = pathname === '/today';

  const item = (active: boolean) =>
    `relative flex min-h-[58px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-150 ${
      active ? 'text-accent' : 'text-muted hover:text-ink'
    }`;
  // The 2 px indicator slides between tabs; a soft pill sits behind the active icon.
  const marker = (
    <>
      <m.span
        layoutId="tab-indicator"
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 40 }}
        className="absolute top-0 h-[2px] w-8 rounded-full bg-accent"
        aria-hidden="true"
      />
      <span className="absolute top-[4px] h-8 w-14 rounded-full bg-accent/10" aria-hidden="true" />
    </>
  );
  const icon = 'relative h-6 w-6';

  return (
    <nav aria-label="App" className="nav-glass fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-[16px] lg:hidden">
      <div className="mx-auto flex max-w-lg">
        <Link to="/" className={item(isHome)} aria-current={isHome ? 'page' : undefined}>
          {isHome && marker}
          <HomeIcon active={isHome} className={icon} />
          <span className="relative">Home</span>
        </Link>
        <button type="button" onClick={openSearch} className={item(false)}>
          <SearchIcon className={icon} />
          <span className="relative">Search</span>
        </button>
        <Link to="/today" className={item(isToday)} aria-current={isToday ? 'page' : undefined}>
          {isToday && marker}
          <TodayIcon active={isToday} className={icon} />
          <span className="relative">Today</span>
        </Link>
        <Link to="/?tab=watchlist" className={item(isWatch)} aria-current={isWatch ? 'page' : undefined}>
          {isWatch && marker}
          <WatchIcon active={isWatch} className={icon} />
          <span className="relative">Watchlist</span>
        </Link>
        <button type="button" onClick={openMenu} className={item(false)}>
          <MoreIcon className={icon} />
          <span className="relative">More</span>
        </button>
      </div>
    </nav>
  );
}
