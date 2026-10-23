// Portfolio health check: how the money is spread, in plain language. Describes; never advises.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Eye, Lock } from 'lucide-react';
import UpgradeModal from '../UpgradeModal';
import { getPortfolioHealth } from '../../lib/api';
import { safeStorage, scoreProfile } from '../invest/investShared';

type HealthCheck = { id: string; status: 'ok' | 'watch'; title: string; value: string; detail: string };
type Sector = { sector: string; weight_pct: number; tickers: string[] };
type Size = { size: 'large' | 'mid' | 'small' | 'unknown'; weight_pct: number };
type Move = { ticker: string; title: string; published_at?: string; source_url?: string; severity?: string };
type Health = { checks: HealthCheck[]; sectors: Sector[]; sizes: Size[]; big_investor_moves: Move[]; unclassified?: string[]; note?: string; locked?: boolean; locked_counts?: { sectors: number; big_investor_moves: number } };

const SHADES = ['bg-cobalt', 'bg-cobalt/75', 'bg-cobalt/55', 'bg-cobalt/40', 'bg-cobalt/25', 'bg-cobalt/15'];
const SIZE_LABEL: Record<Size['size'], string> = { large: 'Large', mid: 'Mid-sized', small: 'Small', unknown: 'Not known' };
const day = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '');

export default function PortfolioHealth({ refreshKey }: { refreshKey: string }) {
  const [data, setData] = useState<Health | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    getPortfolioHealth()
      .then((r) => alive && setData(r.data))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  // The risk profile from the Invest Explorer (device copy; the Explorer syncs the account copy into it).
  const profile = useMemo(() => scoreProfile(safeStorage<Record<string, number>>('invest_profile_answers', {})), []);
  const equityShare = profile ? profile.mix.filter(([n]) => /equity/i.test(n)).reduce((s, [, v]) => s + v, 0) : null;

  if (failed) return <p className="mt-6 text-sm text-muted">The health check could not be loaded right now.</p>;
  if (!data)
    return (
      <div className="mt-6" aria-hidden="true">
        <span className="skeleton block h-4 w-40" />
        <span className="skeleton mt-3 block h-28" />
      </div>
    );
  if (!data.checks.length) return null;

  const clear = data.checks.filter((c) => c.status === 'ok').length;
  const sectors = data.sectors;

  return (
    <section aria-labelledby="health-h" className="mt-7 rounded-card border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="health-h" className="text-sm font-semibold text-ink">
          Health check
        </h2>
        <p className="num text-xs text-muted">
          {clear} of {data.checks.length} look fine
        </p>
      </div>

      {/* Checks */}
      <ul className="mt-3 divide-y divide-line">
        {data.checks.map((c) => {
          const watch = c.status === 'watch';
          const expanded = watch || open === c.id;
          return (
            <li key={c.id} className="py-3">
              <button
                type="button"
                onClick={() => !watch && setOpen(open === c.id ? null : c.id)}
                aria-expanded={expanded}
                className={`flex w-full items-start gap-3 text-left ${watch ? 'cursor-default' : ''}`}
              >
                <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${watch ? 'bg-caution/15 text-caution' : 'bg-up/10 text-up'}`} aria-hidden="true">
                  {watch ? <Eye className="h-3.5 w-3.5" strokeWidth={2} /> : <Check className="h-3.5 w-3.5" strokeWidth={2.25} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="text-sm font-medium text-ink">
                      {c.title}
                      <span className="sr-only">{watch ? ' — worth a look' : ' — looks fine'}</span>
                    </span>
                    <span className="num text-xs text-muted">{c.value}</span>
                  </span>
                  {expanded && <span className="mt-1 block text-[13px] leading-relaxed text-ink/80">{c.detail}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {data.locked ? (
        <div className="mt-4 border-t border-line pt-4">
          <div className="flex items-start gap-3 rounded-control border border-dashed border-line p-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-accent/10 text-accent" aria-hidden="true">
              <Lock className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">Sector and size split, and big-investor moves in your stocks</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
                {lockedLine(data)} Included in Pro, with email alerts when promoters or big funds move in a stock you hold.
              </p>
              <button type="button" onClick={() => setUpgrade(true)} className="mt-1 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-accent hover:underline">
                See it with Pro <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
      {/* Sector mix */}
      {sectors.length > 0 && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-xs font-medium text-muted">By sector</p>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-ink/[0.06]" role="img" aria-label={sectors.map((s) => `${s.sector} ${s.weight_pct.toFixed(0)}%`).join(', ')}>
            {sectors.map((s, i) => (
              <span key={s.sector} className={`${SHADES[Math.min(i, SHADES.length - 1)]} border-r border-surface last:border-0`} style={{ width: `${s.weight_pct}%` }} />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {sectors.map((s, i) => (
              <li key={s.sector} className="flex items-center gap-1.5" title={s.tickers.join(', ')}>
                <span className={`h-2 w-2 rounded-sm ${SHADES[Math.min(i, SHADES.length - 1)]}`} aria-hidden="true" />
                <span className="text-ink">{s.sector}</span> <span className="num">{s.weight_pct.toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Company size */}
      {data.sizes.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-muted">By company size</p>
          <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {data.sizes.map((s) => (
              <div key={s.size} className="rounded-control bg-surface2/60 px-3 py-2">
                <dt className="text-[11px] text-muted">{SIZE_LABEL[s.size]}</dt>
                <dd className="num text-sm font-semibold text-ink">{s.weight_pct.toFixed(0)}%</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Big investors in your stocks */}
      <div className="mt-4 border-t border-line pt-4">
        <p className="text-xs font-medium text-muted">Big investors in your stocks · last 30 days</p>
        {data.big_investor_moves.length ? (
          <ul className="mt-2 space-y-2">
            {data.big_investor_moves.slice(0, 6).map((m, i) => (
              <li key={i} className="flex items-start justify-between gap-3 text-sm">
                <Link to={`/stock/${m.ticker}`} className="min-w-0 text-ink hover:text-accent">
                  <span className="num font-semibold">{m.ticker}</span> <span className="text-ink/80">{m.title}</span>
                </Link>
                <span className="num shrink-0 text-xs text-muted">{day(m.published_at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-muted">No promoter, insider or large-deal moves in your stocks this month.</p>
        )}
      </div>

        </>
      )}

      {/* Risk profile link-up */}
      <div className="mt-4 rounded-control bg-accent/[0.06] p-3 text-sm">
        {profile ? (
          <p className="text-ink/85">
            Your risk profile is <b className="font-semibold text-ink">{profile.name}</b>. Its illustrative mix puts about <span className="num font-semibold text-ink">{equityShare}%</span> of all your savings in shares. This check sees only the stocks here, so compare it with your funds, deposits and gold too.
          </p>
        ) : (
          <p className="text-ink/85">This check sees only your stocks. Five questions tell you how much of all your savings might sit in shares for someone like you.</p>
        )}
        <Link to={profile ? '/invest' : '/invest?tab=profile'} className="mt-1 inline-flex min-h-[40px] items-center gap-1 font-medium text-accent hover:underline">
          {profile ? 'Compare in the Invest Explorer' : 'Find your risk profile'} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted">{data.note} A description of your holdings, not advice on what to buy or sell.</p>
      {upgrade && <UpgradeModal onClose={() => setUpgrade(false)} onSuccess={() => window.location.reload()} />}
    </section>
  );
}

function lockedLine(d: Health) {
  const c = d.locked_counts || { sectors: 0, big_investor_moves: 0 };
  const parts = [c.sectors ? `Your stocks span ${c.sectors} ${c.sectors === 1 ? 'sector' : 'sectors'}` : '', c.big_investor_moves ? `${c.big_investor_moves} big-investor ${c.big_investor_moves === 1 ? 'move' : 'moves'} this month` : ''].filter(Boolean);
  return parts.length ? `${parts.join(', and there ' + (c.big_investor_moves === 1 ? 'was ' : 'were '))}.` : '';
}
