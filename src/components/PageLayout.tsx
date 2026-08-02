// src/components/PageLayout.tsx
import { useNavigate } from 'react-router-dom';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Back bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition text-sm"
        >
          ← Back
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition text-sm"
        >
          Home
        </button>
      </div>
      {children}
    </div>
  );
}