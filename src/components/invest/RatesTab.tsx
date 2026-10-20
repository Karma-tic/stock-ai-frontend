// src/components/invest/RatesTab.tsx — current rates with freshness warnings and sources.
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { InvestRate, RatesPayload } from '../../data/investCatalog';

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

function Sources({ rows }: { rows: InvestRate[] }) {
  const seen = new Map<string, string>();
  rows.forEach(r => r.source_url && !seen.has(r.source_url) && seen.set(r.source_url, r.source_name));
  if (!seen.size) return null;
  return (
    <p className="text-xs text-muted">
      Sources:{' '}
      {Array.from(seen).map(([url, name], i) => (
        <span key={url}>
          {i > 0 && ', '}
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-accent underline underline-offset-2">{name}<ExternalLink className="h-3 w-3" /></a>
        </span>
      ))}
    </p>
  );
}

function StaleBanner({ message }: { message: string }) {
  return (
    <div className="flex gap-2 rounded-control border border-caution/30 bg-caution/10 p-3 text-sm text-caution">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{message}</span>
    </div>
  );
}

export default function RatesTab({ data }: { data: RatesPayload }) {
  const ss = data.rates.small_savings || [];
  const fd = data.rates.bank_fd || [];
  const ssStatus = data.status.small_savings;
  const fdStatus = data.status.bank_fd;
  const topFd = fd[0]?.rate ?? 0;

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-[-0.015em] text-ink">Rates & offers</h2>
        <p className="mt-1 text-muted">The best guaranteed rates on offer. Each rate shows when it was last checked and where it came from.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-ink">Government small-savings schemes</h3>
          {ssStatus?.stale && <StaleBanner message={ssStatus.message} />}
          <div className="rounded-card border border-line bg-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="p-3">Scheme</th><th className="p-3">Tenure</th><th className="p-3 text-right">Rate</th></tr></thead>
              <tbody>
                {ss.map(r => (
                  <tr key={r.key} className="border-b border-line last:border-0">
                    <td className="p-3 font-medium text-ink">{r.label}</td>
                    <td className="p-3 text-ink/85">{r.tenure}</td>
                    <td className="p-3 text-right font-bold num text-ink">{r.rate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ssStatus && !ssStatus.stale && <p className="text-xs text-muted">{ssStatus.message} Rates are set by the Finance Ministry every quarter.</p>}
          <Sources rows={ss} />
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-ink">Best bank FD offers</h3>
          {fdStatus?.stale && <StaleBanner message={fdStatus.message} />}
          <div className="rounded-card border border-line bg-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="p-3">Bank</th><th className="p-3">Best tenure</th><th className="p-3 text-right">Max rate</th></tr></thead>
              <tbody>
                {fd.map(r => (
                  <tr key={r.key} className="border-b border-line last:border-0">
                    <td className="p-3">
                      <span className="font-medium text-ink">{r.label}</span>
                      {r.institution_type && <span className="ml-2 rounded-full bg-ink/[0.05] px-2 py-0.5 text-[10px] font-bold text-muted">{r.institution_type}</span>}
                      <span className="block text-[11px] text-muted">checked {fmtDate(r.as_of)}</span>
                    </td>
                    <td className="p-3 text-ink/85">{r.tenure}</td>
                    <td className={`p-3 text-right font-bold num ${r.rate === topFd ? 'text-accent' : 'text-ink'}`}>{r.rate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted">Senior citizens usually get about 0.50% more.</p>
          <Sources rows={fd} />
        </section>
      </div>

      <section className="rounded-card border border-line bg-surface p-5 space-y-2">
        <h3 className="text-base font-semibold text-ink">Reading these offers</h3>
        <p className="text-sm text-ink/85 max-w-3xl">
          Bank FDs are insured by DICGC up to ₹5 lakh per depositor per bank, so a small finance bank paying 8%+ is reasonable for amounts under that cap.
          Government schemes carry a sovereign guarantee with no cap on safety. Anything advertising 12%+ “fixed” returns, such as unlisted bonds, P2P loans or some NBFC deposits, carries real default risk.
        </p>
      </section>
    </div>
  );
}
