import { useMemo, useState } from 'react';
import { Info, Rocket } from 'lucide-react';
import UpcomingIpos from './UpcomingIpos';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';
import Segmented from './ui/Segmented';
import { Button } from './ui/Button';
import IpoCalendar from './ipos/IpoCalendar';
import IpoCard from './ipos/IpoCard';
import GmpVsListing from './ipos/GmpVsListing';
import IpoAlertsCard from './ipos/IpoAlertsCard';
import { Ipo, IpoStage, useIpos } from './ipos/ipoData';

const SECTIONS: { stage: IpoStage; title: string; empty?: string }[] = [
  { stage: 'open', title: 'Open now' },
  { stage: 'upcoming', title: 'Coming up' },
  { stage: 'closed', title: 'Bidding closed, listing soon' },
];

type View = 'cards' | 'table';
type Board = 'All' | 'Mainboard' | 'SME';

export default function IPOsPage() {
  const { ipos, loading, error } = useIpos();
  const [view, setView] = useState<View>(() => {
    try {
      return (sessionStorage.getItem('byteplay:ipos:view') as View) || 'cards';
    } catch {
      return 'cards';
    }
  });
  const [board, setBoard] = useState<Board>('All');
  const pick = (v: View) => {
    setView(v);
    try {
      sessionStorage.setItem('byteplay:ipos:view', v);
    } catch {}
  };

  const shown = useMemo(() => ipos.filter((i) => board === 'All' || (board === 'SME' ? i.category === 'SME' : i.category !== 'SME')), [ipos, board]);
  const by = (s: IpoStage) => shown.filter((i) => i.stage === s);
  const live = shown.filter((i) => i.stage !== 'listed');
  const counts = { open: by('open').length, upcoming: by('upcoming').length, closed: by('closed').length };
  const updated = ipos.find((i) => i.source_updated_at)?.source_updated_at;

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Upcoming IPOs India | GMP, Dates, Subscription and IPO Briefs | Stock AI"
        description="Open and upcoming Indian IPOs with dates, price, minimum investment, subscription, grey-market premium, and a plain-language brief of the points in favour and to check."
        canonicalPath="/ipos"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <PageHeader
            className="mb-0"
            eyebrow="IPOs"
            icon={Rocket}
            title="Open and upcoming IPOs"
            intro="Dates, price, minimum investment and demand for every current Indian IPO, with the points in favour and the points to check. Facts with their source, not a listing call."
          />
          <IpoAlertsCard />
        </div>

        {/* summary strip + controls */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <p className="num text-sm text-muted" aria-live="polite">
            {loading ? 'Loading IPOs…' : (
              <>
                <span className="font-semibold text-ink">{counts.open}</span> open ·{' '}
                <span className="font-semibold text-ink">{counts.upcoming}</span> coming up ·{' '}
                <span className="font-semibold text-ink">{counts.closed}</span> awaiting listing
                {updated && <span className="ml-2 text-xs">· updated {updated}</span>}
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {view === 'cards' && (
              <Segmented<Board> label="Board" value={board} onChange={setBoard}
                options={(['All', 'Mainboard', 'SME'] as Board[]).map((v) => ({ value: v, label: v }))} />
            )}
            <Segmented<View> label="View" value={view} onChange={pick}
              options={[{ value: 'cards', label: 'Cards' }, { value: 'table', label: 'Table' }]} />
          </div>
        </div>

        {view === 'table' ? (
          <section className="mt-4 rounded-card border border-line bg-surface p-4 sm:p-5">
            <UpcomingIpos />
          </section>
        ) : loading && !ipos.length ? (
          <div aria-hidden="true" className="mt-4 space-y-4">
            <span className="skeleton block h-48" />
            <div className="grid gap-4 md:grid-cols-2"><span className="skeleton block h-72" /><span className="skeleton block h-72" /></div>
          </div>
        ) : error ? (
          <div className="mt-4 rounded-card border border-line bg-surface py-12 text-center">
            <p className="text-sm text-muted">{error}</p>
            <Button variant="ghost" className="mt-3" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : (
          <div className="mt-4 space-y-12">
            <IpoCalendar ipos={live} />

            {!live.length && (
              <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-muted">
                No IPOs are open or announced right now. Turn on alerts above and we'll email you when the next one is.
              </p>
            )}

            {SECTIONS.map(({ stage, title }) => {
              const list: Ipo[] = by(stage);
              if (!list.length) return null;
              return (
                <section key={stage} aria-labelledby={`ipos-${stage}`}>
                  <h2 id={`ipos-${stage}`} className="flex items-baseline gap-2 text-xl font-semibold tracking-[-0.015em] text-ink">
                    {title} <span className="num text-sm font-normal text-muted">{list.length}</span>
                  </h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {list.map((ipo) => <IpoCard key={ipo.id} ipo={ipo} />)}
                  </div>
                </section>
              );
            })}

            <GmpVsListing ipos={shown} />
          </div>
        )}

        <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Data from InvestorGain, refreshed every 30 minutes. The grey-market premium is unofficial and unregulated. Points in favour and
          to check come from the numbers shown and are not a recommendation; Stock AI is not SEBI-registered. Read the offer document (RHP) before you apply.
        </p>
      </div>
    </div>
  );
}
