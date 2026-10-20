import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface LearnLayoutProps {
  children: React.ReactNode;
  chapterNumber: number;
  title: string;
  nextChapter?: { path: string; title: string };
  prevChapter?: { path: string; title: string };
}

const TOTAL = 9;

export default function LearnLayout({ children, chapterNumber, title, nextChapter, prevChapter }: LearnLayoutProps) {
  return (
    <div className="min-h-[100dvh] bg-canvas">
      {/* Reading progress through the course, under the navbar */}
      <div className="sticky top-[var(--nav-h,64px)] z-30 border-b border-line bg-canvas/90 backdrop-blur-[16px]">
        <div className="mx-auto flex h-12 max-w-3xl items-center gap-3 px-4 text-sm sm:px-6">
          <Link to="/learn" className="inline-flex shrink-0 items-center gap-1 font-medium text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Learn
          </Link>
          <span className="text-line" aria-hidden="true">/</span>
          <span className="min-w-0 truncate font-medium text-ink">{title}</span>
          <span className="num ml-auto shrink-0 text-xs text-muted">
            {chapterNumber} of {TOTAL}
          </span>
        </div>
        <div className="h-0.5 bg-ink/[0.06]">
          <div className="h-full bg-cobalt" style={{ width: `${(chapterNumber / TOTAL) * 100}%` }} />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="learn-chapter text-[15px] leading-relaxed text-ink/85">{children}</div>

        <nav aria-label="Chapters" className="mt-14 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {prevChapter ? (
            <Link to={prevChapter.path} className="group rounded-card border border-line bg-surface p-4 transition hover:border-accent/40">
              <span className="flex items-center gap-1 text-xs text-muted">
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </span>
              <span className="mt-1 block font-semibold text-ink group-hover:text-accent">{prevChapter.title}</span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {nextChapter ? (
            <Link to={nextChapter.path} className="group rounded-card border border-accent/40 bg-accent/[0.06] p-4 text-right transition hover:border-accent">
              <span className="flex items-center justify-end gap-1 text-xs font-medium text-accent">
                Next chapter <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="mt-1 block font-semibold text-ink">{nextChapter.title}</span>
            </Link>
          ) : (
            <Link to="/learn" className="group rounded-card border border-accent/40 bg-accent/[0.06] p-4 text-right transition hover:border-accent">
              <span className="text-xs font-medium text-accent">You finished the course</span>
              <span className="mt-1 block font-semibold text-ink">Back to all chapters</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
