// src/components/PageLayout.tsx
import { useNavigate } from 'react-router-dom';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Back bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"
        >
          ← Back
        </button>
        <span className="text-slate-600">|</span>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"
        >
          🏠 Home
        </button>
      </div>
      {children}
    </div>
  );
}