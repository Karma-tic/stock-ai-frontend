import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface LearnLayoutProps {
  children: React.ReactNode;
  chapterNumber: number;
  title: string;
  nextChapter?: { path: string; title: string };
  prevChapter?: { path: string; title: string };
}

export default function LearnLayout({ children, chapterNumber, title, nextChapter, prevChapter }: LearnLayoutProps) {
  return (
    <div className="min-h-screen bg-lavender-surface text-lavender-text/80">
      
      {/* Top Breadcrumb Nav */}
      <div className="bg-surface border-b border-lavender-text/10 py-4 px-6 sticky top-[73px] z-30 shadow-lavender">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/learn" className="text-lavender-text/70 hover:text-lavender-primary transition flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Learn Hub
          </Link>
          <ChevronRight className="w-4 h-4 text-muted" />
          <span className="text-lavender-text/60">Chapter {chapterNumber}</span>
          <ChevronRight className="w-4 h-4 text-muted" />
          <span className="text-lavender-text font-semibold truncate">{title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Main Content Render */}
        <div className="app-card p-6 md:p-12 mb-12">
          {children}
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-lavender-text/10 pt-8">
          {prevChapter ? (
            <Link 
              to={prevChapter.path}
              className="flex items-center gap-3 bg-surface hover:bg-lavender-base border border-lavender-text/10 shadow-sm px-6 py-4 rounded-2xl transition w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 text-lavender-text/70" />
              <div className="text-left">
                <p className="text-xs text-lavender-text/60 uppercase font-bold tracking-wider mb-1">Previous</p>
                <p className="text-lavender-text font-semibold text-sm">{prevChapter.title}</p>
              </div>
            </Link>
          ) : (
            <div className="w-full sm:w-auto"></div> // Spacer
          )}

          {nextChapter ? (
            <Link 
              to={nextChapter.path}
              className="flex items-center gap-3 bg-gradient-lavender hover:opacity-90 px-6 py-4 rounded-2xl transition shadow-lavender w-full sm:w-auto justify-between sm:justify-start"
            >
              <div className="text-left sm:text-right">
                <p className="text-xs text-accent uppercase font-bold tracking-wider mb-1">Next Chapter</p>
                <p className="text-lavender-text font-semibold text-sm">{nextChapter.title}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-lavender-text" />
            </Link>
          ) : (
            <Link 
              to="/learn"
              className="flex items-center gap-3 bg-up/15 hover:bg-up/15 px-6 py-4 rounded-2xl transition shadow-lavender w-full sm:w-auto"
            >
              <div className="text-center">
                <p className="text-lavender-text font-bold">Return to Hub</p>
              </div>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
