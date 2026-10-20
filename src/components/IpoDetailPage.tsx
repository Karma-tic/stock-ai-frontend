import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Building2, CalendarDays, Check, ExternalLink, FileCheck2, FileText, Landmark, PieChart, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { BASE } from '../lib/api';
import SEO from './SEO';
import type { IPO } from './UpcomingIpos';

type SourceDocument = { title: string; url: string; type?: string };
type Person = { name: string; holding_pct?: number };
type Evidence = {
  verification_status?: string; evidence_label?: string; methodology?: string;
  company?: { summary?: string | null; scope_points?: string[] };
  ownership?: { promoters?: Person[]; major_shareholders?: Person[]; anchor_investors?: string[]; promoter_holding_pre_pct?: number | null; promoter_holding_post_pct?: number | null };
  issue?: { total_size?: string | null; fresh_issue?: string | null; offer_for_sale?: string | null; use_of_funds?: string[] };
  investor_demand?: { total?: string | null; qib?: string | null; nii?: string | null; retail?: string | null; employee?: string | null };
  financials?: Array<{ period: string; unit?: string; revenue?: number | null; profit?: number | null; debt?: number | null; net_worth?: number | null; assets?: number | null }>;
  disclosure_flags?: Array<{ fact: string; source_page?: number }>;
  source_documents?: SourceDocument[];
};
type Detail = IPO & { source_url?: string; issue_size?: string; subscription?: string; pe_ratio?: string; allotment_date?: string; anchor_available?: boolean; gmp_low?: number; gmp_high?: number; activity_score?: number; evidence_snapshot?: Evidence };

const Fact = ({ label, value, accent = false }: { label: string; value?: string | number | null; accent?: boolean }) => (
  <div className="bg-surface p-4">
    <dt className="text-xs text-muted">{label}</dt>
    <dd className={`num mt-1 text-[15px] font-semibold ${value == null || value === '' ? 'font-sans text-sm font-normal text-muted' : accent ? 'text-accent' : 'text-ink'}`}>{value ?? 'Not disclosed'}</dd>
  </div>
);
const FactGrid = ({ children, cols = 'grid-cols-2 lg:grid-cols-4' }: { children: React.ReactNode; cols?: string }) => (
  <dl className={`grid gap-px overflow-hidden rounded-card border border-line bg-line ${cols}`}>{children}</dl>
);
const EmptyEvidence = ({ children }: { children: string }) => <p className="rounded-card border border-dashed border-line p-4 text-sm leading-relaxed text-muted">{children}</p>;
const SectionTitle = ({ icon: Icon, children }: { icon: typeof Building2; children: string }) => (
  <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-ink">
    <Icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
    {children}
  </h2>
);
const Pill = ({ children, tone = 'accent' }: { children: React.ReactNode; tone?: 'accent' | 'muted' }) => (
  <span className={`rounded-full px-3 py-1 text-sm ${tone === 'accent' ? 'bg-accent/10 text-accent' : 'bg-ink/[0.06] text-ink'}`}>{children}</span>
);

export default function IpoDetailPage() {
  const { id } = useParams();
  const [ipo, setIpo] = useState<Detail>();
  const [error, setError] = useState('');
  useEffect(() => { axios.get(`${BASE}/api/market/ipos/${id}`).then(r => setIpo(r.data.ipo)).catch(() => setError('This IPO record is unavailable right now.')); }, [id]);
  if (error)
    return (
      <div className="min-h-[60dvh] bg-canvas px-4 py-24 text-center">
        <p className="text-sm text-muted">{error}</p>
        <Link to="/ipos" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
          <ArrowLeft className="h-4 w-4" /> All IPOs
        </Link>
      </div>
    );
  if (!ipo)
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6" aria-hidden="true">
        <span className="skeleton block h-5 w-24" />
        <span className="skeleton mt-6 block h-10 w-2/3" />
        <span className="skeleton mt-8 block h-40" />
        <span className="skeleton mt-6 block h-40" />
      </div>
    );

  const evidence = ipo.evidence_snapshot || {};
  const ownership = evidence.ownership || {};
  const issue = evidence.issue || {};
  const demand = evidence.investor_demand || {};
  const documents = evidence.source_documents?.length ? evidence.source_documents : ipo.source_url ? [{ title: 'Live IPO data source', url: ipo.source_url, type: 'Market data' }] : [];
  const officialReady = evidence.verification_status === 'official_documents_found';
  const gmpNegative = /^\s*-/.test(ipo.gmp || '');
  const cr = (v?: number | null) => (v != null ? `₹${v.toLocaleString('en-IN')} Cr` : '–');

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO title={`${ipo.company_name} IPO Research, Ownership and Details | Stock AI`} description={`Evidence-led company, ownership, demand and schedule research for ${ipo.company_name}.`} canonicalPath={`/ipos/${ipo.id}`} />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <Link to="/ipos" className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> All IPOs
        </Link>

        {/* Header */}
        <header className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-accent">{ipo.category || 'IPO'}</span>
              {ipo.status && <span className="rounded-full bg-ink/[0.06] px-2.5 py-1 text-ink">{ipo.status}</span>}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl">{ipo.company_name}</h1>
            <p className="mt-2 text-xs text-muted">Source last updated: {ipo.source_updated_at || 'not available'}</p>
          </div>
          <div className="shrink-0 rounded-card border border-line bg-surface p-4 sm:min-w-[220px]">
            <p className="text-xs text-muted">Grey-market premium (unofficial)</p>
            <p className={`num mt-1 text-2xl font-semibold ${gmpNegative ? 'text-down' : 'text-ink'}`}>{ipo.gmp || 'n/a'}</p>
            <p className="mt-1 text-xs text-muted">Sentiment only. Not a valuation or a listing guarantee.</p>
          </div>
        </header>

        {/* Verification status */}
        <div className={`mt-8 flex flex-col gap-3 rounded-card border p-4 sm:flex-row sm:items-center sm:justify-between ${officialReady ? 'border-up/30 bg-up/[0.06]' : 'border-line bg-surface'}`}>
          <div className="flex gap-3">
            {officialReady ? <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-up" strokeWidth={1.75} /> : <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />}
            <div>
              <p className="text-sm font-semibold text-ink">How this page is checked</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">{evidence.methodology || 'We show sourced facts and mark anything not yet verified. AI does not judge whether promoters are trustworthy.'}</p>
            </div>
          </div>
          <span className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${officialReady ? 'bg-up/10 text-up' : 'bg-accent/10 text-accent'}`}>{evidence.evidence_label || 'Official-document facts pending'}</span>
        </div>

        <div className="mt-10 space-y-10">
          <section>
            <SectionTitle icon={CalendarDays}>Price and key dates</SectionTitle>
            <FactGrid>
              <Fact label="Price band" value={ipo.price_band} />
              <Fact label="Lot size" value={ipo.lot_size} />
              <Fact label="Estimated listing" value={ipo.est_listing_price} />
              <Fact label="Grey-market activity" value={`${ipo.activity_score || 1} of 5`} />
              <Fact label="Opens" value={ipo.open_date} />
              <Fact label="Closes" value={ipo.close_date} />
              <Fact label="Allotment" value={ipo.allotment_date} />
              <Fact label="Listing" value={ipo.listing_date} />
            </FactGrid>
          </section>

          <section>
            <SectionTitle icon={Building2}>Company and business</SectionTitle>
            {evidence.company?.summary || evidence.company?.scope_points?.length ? (
              <div className="rounded-card border border-line bg-surface p-5">
                {evidence.company.summary && <p className="text-[15px] leading-relaxed text-ink/85">{evidence.company.summary}</p>}
                {evidence.company.scope_points?.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-ink/85">
                    {evidence.company.scope_points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <EmptyEvidence>Business model, customers and growth drivers appear once they are verified from the offer document. We do not write a company story from grey-market data.</EmptyEvidence>
            )}
          </section>

          <section>
            <SectionTitle icon={Users}>Promoters and shareholders</SectionTitle>
            <FactGrid>
              <Fact label="Promoter holding before" value={ownership.promoter_holding_pre_pct != null ? `${ownership.promoter_holding_pre_pct}%` : null} />
              <Fact label="Promoter holding after" value={ownership.promoter_holding_post_pct != null ? `${ownership.promoter_holding_post_pct}%` : null} />
              <Fact label="Named promoters" value={ownership.promoters?.length || null} />
              <Fact label="Anchor investors" value={ownership.anchor_investors?.length || (ipo.anchor_available ? 'Indicated; names pending' : null)} />
            </FactGrid>
            {ownership.promoters?.length ? (
              <div className="mt-4">
                <p className="text-xs text-muted">Promoters</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ownership.promoters.map((person) => (
                    <Pill key={person.name}>{person.name}</Pill>
                  ))}
                </div>
              </div>
            ) : null}
            {ownership.anchor_investors?.length ? (
              <div className="mt-4">
                <p className="text-xs text-muted">Named anchor investors</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ownership.anchor_investors.map((name) => (
                    <Pill key={name} tone="muted">
                      {name}
                    </Pill>
                  ))}
                </div>
              </div>
            ) : null}
            {!ownership.promoters?.length && !ownership.major_shareholders?.length && (
              <div className="mt-3">
                <EmptyEvidence>Names and holdings stay blank until they are taken from the RHP, DRHP or prospectus. We show evidence, not a “good promoter” badge.</EmptyEvidence>
              </div>
            )}
          </section>

          <section>
            <SectionTitle icon={Landmark}>Issue structure and use of funds</SectionTitle>
            <FactGrid>
              <Fact label="Total issue size" value={issue.total_size || ipo.issue_size} />
              <Fact label="Fresh issue" value={issue.fresh_issue} />
              <Fact label="Offer for sale" value={issue.offer_for_sale} />
              <Fact label="P/E" value={ipo.pe_ratio} />
            </FactGrid>
            {issue.use_of_funds?.length ? (
              <ul className="mt-3 space-y-2 rounded-card border border-line bg-surface p-5 text-sm text-ink/85">
                {issue.use_of_funds.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3">
                <EmptyEvidence>Fresh issue, offer-for-sale and use-of-proceeds details are pending checks against the official documents.</EmptyEvidence>
              </div>
            )}
          </section>

          <section>
            <SectionTitle icon={PieChart}>Subscription so far</SectionTitle>
            <FactGrid cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              <Fact label="Total" value={demand.total || ipo.subscription} accent />
              <Fact label="QIB" value={demand.qib} />
              <Fact label="NII / HNI" value={demand.nii} />
              <Fact label="Retail" value={demand.retail} />
              <Fact label="Employee" value={demand.employee} />
            </FactGrid>
            <p className="mt-2 text-xs text-muted">Subscription changes during the issue and does not predict returns.</p>
          </section>

          <section>
            <SectionTitle icon={TrendingUp}>Financials</SectionTitle>
            {evidence.financials?.length ? (
              <div className="overflow-x-auto rounded-card border border-line bg-surface">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b border-line text-xs text-muted">
                    <tr>
                      {['Period', 'Income', 'Profit', 'Net worth', 'Borrowing'].map((h) => (
                        <th key={h} scope="col" className="px-4 py-2.5 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {evidence.financials.map((row) => (
                      <tr key={row.period}>
                        <td className="px-4 py-3 font-medium text-ink">{row.period}</td>
                        <td className="num px-4 py-3 text-ink/85">{cr(row.revenue)}</td>
                        <td className={`num px-4 py-3 font-medium ${row.profit != null && row.profit < 0 ? 'text-down' : 'text-ink'}`}>{cr(row.profit)}</td>
                        <td className="num px-4 py-3 text-ink/85">{cr(row.net_worth)}</td>
                        <td className="num px-4 py-3 text-ink/85">{cr(row.debt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyEvidence>Three-year income, profit, net worth and borrowing are pending extraction from the offer document.</EmptyEvidence>
            )}
          </section>

          <section>
            <SectionTitle icon={AlertTriangle}>Disclosure checks</SectionTitle>
            {evidence.disclosure_flags?.length ? (
              <ul className="space-y-2">
                {evidence.disclosure_flags.map((flag, index) => (
                  <li key={`${flag.fact}-${index}`} className="flex gap-3 rounded-card border border-line bg-surface p-4 text-sm text-ink/85">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-caution" />
                    <span>
                      {flag.fact}
                      {flag.source_page ? <span className="text-muted"> (page {flag.source_page})</span> : ''}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyEvidence>No promoter, litigation, pledge, default or regulatory conclusion is shown until it is checked against an official document. “No flags shown” does not mean “no risks exist.”</EmptyEvidence>
            )}
          </section>

          <section>
            <SectionTitle icon={FileText}>Sources</SectionTitle>
            {documents.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {documents.map((document) => (
                  <li key={document.url}>
                    <a href={document.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface p-4 transition hover:border-accent/40">
                      <span className="min-w-0">
                        <span className="block text-xs text-muted">{document.type || 'Source'}</span>
                        <span className="mt-0.5 block truncate text-sm font-medium text-ink">{document.title}</span>
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyEvidence>No source link is available for this saved record. Treat its fields as unverified until the next refresh.</EmptyEvidence>
            )}
          </section>
        </div>

        <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          A research aid, not an investment recommendation. Check the RHP or prospectus, exchange filings and current subscription before you apply.
        </p>
      </main>
    </div>
  );
}
