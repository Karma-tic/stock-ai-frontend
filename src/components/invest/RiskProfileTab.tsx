// src/components/invest/RiskProfileTab.tsx — five-question risk profile.
import { InvestOption } from '../../data/investCatalog';
import { matchesProfile, Profile, QUIZ } from './investShared';

interface Props {
  answers: Record<string, number>;
  profile: Profile | null;
  options: InvestOption[];
  signedIn: boolean;
  saving: 'idle' | 'saving' | 'saved' | 'error';
  onAnswer: (key: string, value: number) => void;
  onSeeMatches: () => void;
}

export default function RiskProfileTab({ answers, profile, options, signedIn, saving, onAnswer, onSeeMatches }: Props) {
  const answered = QUIZ.filter(q => answers[q.key] !== undefined).length;
  const matches = profile ? options.filter(o => matchesProfile(o, profile)).length : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
      <div className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-lavender-text">Find your risk profile</h2>
          <p className="mt-1 text-lavender-text/70">Five questions. Your answer re-ranks the Explore list and marks options that suit how you invest. It is a starting point for your own research, not personal advice.</p>
        </div>
        {QUIZ.map((q, i) => (
          <fieldset key={q.key} className="space-y-2">
            <legend className="mb-2 font-semibold text-lavender-text">{i + 1}. {q.q}</legend>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {q.a.map(([label, v]) => {
                const on = answers[q.key] === v;
                return (
                  <button key={label} type="button" aria-pressed={on} onClick={() => onAnswer(q.key, v)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${on ? 'border-lavender-primary bg-lavender-primary/10 font-semibold text-lavender-text' : 'border-lavender-text/15 bg-surface text-lavender-text/80 hover:border-lavender-primary/40'}`}>
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <aside className="app-card p-6 space-y-4 lg:sticky lg:top-24" aria-live="polite">
        {!profile ? (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-lavender-text/60">Your result</p>
            <p className="text-xl font-bold text-lavender-text">{answered}/5 answered</p>
            <div className="h-2 rounded-full bg-lavender-surface overflow-hidden"><div className="h-full bg-gradient-lavender transition-all" style={{ width: `${answered * 20}%` }} /></div>
            <p className="text-sm text-lavender-text/70">Answer all five to see your profile and an illustrative mix.</p>
          </>
        ) : (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-lavender-text/60">Your result · score {profile.score}/15</p>
            <h3 className="text-2xl font-bold text-lavender-text">{profile.name}</h3>
            <div className="flex h-8 overflow-hidden rounded-xl" role="img" aria-label={profile.mix.map(([n, v]) => `${n} ${v}%`).join(', ')}>
              {profile.mix.map(([n, v, c]) => (
                <div key={n} className={`${c} flex items-center justify-center text-[11px] font-bold text-white`} style={{ width: `${v}%` }}>{v >= 10 ? `${v}%` : ''}</div>
              ))}
            </div>
            <ul className="space-y-1 text-sm">
              {profile.mix.map(([n, v, c]) => (
                <li key={n} className="flex items-center gap-2 text-lavender-text/80"><span className={`h-2.5 w-2.5 rounded-sm ${c}`} />{n}<span className="ml-auto tabular-nums font-semibold">{v}%</span></li>
              ))}
            </ul>
            <p className="text-sm text-lavender-text/85">{profile.text}</p>
            <button type="button" onClick={onSeeMatches} className="w-full rounded-xl bg-gradient-lavender px-4 py-2.5 text-sm font-semibold text-white shadow-lavender">
              See {matches} matching options
            </button>
            <p className="text-xs text-lavender-text/60">
              Illustrative mix only.{' '}
              {signedIn
                ? saving === 'saving' ? 'Saving to your account…' : saving === 'saved' ? 'Saved to your account.' : saving === 'error' ? 'Could not save to your account; kept on this device.' : ''
                : 'Sign in to keep your profile across devices.'}
            </p>
          </>
        )}
      </aside>
    </div>
  );
}
