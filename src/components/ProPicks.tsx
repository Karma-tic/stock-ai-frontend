import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import UpgradeModal from './UpgradeModal';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';
import { Button, ButtonLink } from './ui/Button';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function ProPicks() {
  const [picks, setPicks] = useState<any[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [accuracy, setAccuracy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProData() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token || '';
        setIsLoggedIn(!!session);

        const accRes = await fetch(`${BASE}/api/pro-accuracy`);
        setAccuracy(await accRes.json());

        const picksRes = await fetch(`${BASE}/api/pro-picks`, { headers: { Authorization: `Bearer ${token}` } });
        const picksData = await picksRes.json();
        setIsPro(picksData.is_pro);
        setPicks(picksData.picks || []);
      } catch (error) {
        console.error('Error fetching pro data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProData();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Pro Picks | Daily AI-Screened NSE Setups | Stock AI"
        description="View daily AI-screened NSE trading setups, Pro accuracy stats, entry levels, targets, and stop loss information for educational use."
        canonicalPath="/pro-picks"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Pro"
          icon={Sparkles}
          title="Pro Picks"
          intro="Each weekday at 9:20 am IST, the AI screens a broad NSE universe and shortlists 2 to 5 setups worth researching. A starting point for your own checks, not a recommendation."
        />

        {/* Accuracy, stated plainly with how it is measured */}
        <section className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
          <div className="bg-surface p-5">
            <p className="text-xs text-muted">Calls tracked</p>
            <p className="num mt-1 text-3xl font-semibold text-ink">{loading ? '–' : accuracy?.total_picks ?? 0}</p>
          </div>
          <div className="bg-surface p-5">
            <p className="text-xs text-muted">Win rate</p>
            <p className="num mt-1 text-3xl font-semibold text-ink">{loading ? '–' : accuracy?.win_rate || '0%'}</p>
          </div>
          <div className="flex flex-col justify-between gap-3 bg-surface p-5">
            <p className="text-xs leading-relaxed text-muted">Checked against end-of-day closing prices. Every call stays on the record, right or wrong.</p>
            <Link to="/track-record" className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
              See the full track record <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Locked state for free users */}
        {!loading && !isPro && (
          <section className="mt-8 flex flex-col items-start gap-4 rounded-card border border-accent/30 bg-accent/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
                <Lock className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <h2 className="font-semibold text-ink">Today's picks are for Pro members</h2>
                <p className="mt-0.5 text-sm text-muted">You can see how many setups passed the screen. Pro shows the stock, the entry level and the reasoning.</p>
              </div>
            </div>
            {isLoggedIn ? (
              <Button onClick={() => setShowUpgrade(true)} className="shrink-0">
                Unlock with Pro
              </Button>
            ) : (
              <ButtonLink to="/login?next=%2Fpro-picks" className="shrink-0">
                Sign in to unlock
              </ButtonLink>
            )}
          </section>
        )}

        {/* Picks */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-ink">Today's shortlist</h2>
          {loading ? (
            <div className="mt-3 grid gap-4 md:grid-cols-2" aria-hidden="true">
              {[0, 1].map((i) => (
                <span key={i} className="skeleton block h-40" />
              ))}
            </div>
          ) : picks.length === 0 ? (
            <p className="mt-3 rounded-card border border-dashed border-line p-8 text-center text-sm text-muted">No picks yet today. The shortlist is published after 9:30 am IST on market days.</p>
          ) : (
            <ul className="mt-3 grid gap-4 md:grid-cols-2">
              {picks.map((pick, index) => (
                <li key={index} className="relative overflow-hidden rounded-card border border-line bg-surface p-5">
                  <div className={isPro ? '' : 'select-none blur-[5px]'} aria-hidden={!isPro}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {isPro ? (
                          <Link to={`/stock/${pick.ticker}`} className="num text-2xl font-semibold text-ink hover:text-accent">
                            {pick.ticker}
                          </Link>
                        ) : (
                          <span className="num text-2xl font-semibold text-ink">{pick.ticker}</span>
                        )}
                        <p className="mt-1 text-xs text-muted">Passed the morning screen</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted">Entry level</p>
                        <p className="num text-lg font-semibold text-ink">
                          ₹{typeof pick.entry === 'number' ? pick.entry.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : pick.entry}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ink/85">
                      {isPro
                        ? pick.reasoning
                        : 'This setup passed the momentum, liquidity and risk filters. Pro shows the stock and the reasoning so you can check it yourself.'}
                    </p>
                  </div>
                  {!isPro && (
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink shadow-sm">
                        <Lock className="h-3.5 w-3.5 text-accent" /> Pro only
                      </span>
                    </div>
                  )}
                  {isPro && (
                    <Link to={`/?analyze=${encodeURIComponent(pick.ticker)}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                      Open the evidence <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-8 text-xs text-muted">For education and research only. Not SEBI-registered investment advice. Past results do not predict future returns.</p>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onSuccess={() => setIsPro(true)} />}
    </div>
  );
}
