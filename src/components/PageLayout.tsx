// src/components/PageLayout.tsx — wrapper for policy pages (the navbar already provides navigation).
export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-canvas">{children}</div>;
}
