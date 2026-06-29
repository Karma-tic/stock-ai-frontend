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
    <div className="min-h-screen bg-slate-950 text-slate-300">
      
      {/* Top Breadcrumb Nav */}
      <div className="bg-slate-900 border-b border-slate-800 py-4 px-6 sticky top-[73px] z-30 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/learn" className="text-slate-400 hover:text-blue-400 transition flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Learn Hub
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-slate-500">Chapter {chapterNumber}</span>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="text-white font-semibold truncate">{title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Main Content Render */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-12 mb-12 shadow-xl">
          {children}
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-800 pt-8">
          {prevChapter ? (
            <Link 
              to={prevChapter.path}
              className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-6 py-4 rounded-xl transition w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Previous</p>
                <p className="text-white font-semibold text-sm">{prevChapter.title}</p>
              </div>
            </Link>
          ) : (
            <div className="w-full sm:w-auto"></div> // Spacer
          )}

          {nextChapter ? (
            <Link 
              to={nextChapter.path}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 px-6 py-4 rounded-xl transition shadow-lg shadow-blue-500/20 w-full sm:w-auto justify-between sm:justify-start"
            >
              <div className="text-left sm:text-right">
                <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">Next Chapter</p>
                <p className="text-white font-semibold text-sm">{nextChapter.title}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white" />
            </Link>
          ) : (
            <Link 
              to="/learn"
              className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-6 py-4 rounded-xl transition shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
            >
              <div className="text-center">
                <p className="text-white font-bold">Return to Hub</p>
              </div>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
