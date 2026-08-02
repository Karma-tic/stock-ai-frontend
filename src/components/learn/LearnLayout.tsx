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
    <div className="min-h-screen bg-white text-gray-600">
      
      {/* Top Breadcrumb Nav */}
      <div className="bg-white border-b border-gray-200 py-4 px-6 sticky top-[73px] z-30 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/learn" className="text-gray-500 hover:text-blue-600 transition flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Learn Hub
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-400">Chapter {chapterNumber}</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-900 font-semibold truncate">{title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Main Content Render */}
        <div className="bg-white/50 border border-gray-200 rounded-3xl p-6 md:p-12 mb-12 shadow-xl">
          {children}
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200 pt-8">
          {prevChapter ? (
            <Link 
              to={prevChapter.path}
              className="flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 px-6 py-4 rounded-xl transition w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Previous</p>
                <p className="text-gray-900 font-semibold text-sm">{prevChapter.title}</p>
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
                <p className="text-gray-900 font-semibold text-sm">{nextChapter.title}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-900" />
            </Link>
          ) : (
            <Link 
              to="/learn"
              className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-6 py-4 rounded-xl transition shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
            >
              <div className="text-center">
                <p className="text-gray-900 font-bold">Return to Hub</p>
              </div>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
