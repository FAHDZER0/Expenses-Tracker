import { BottomNav } from '@/components/layout/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="page-content min-h-[100dvh]" style={{ background: 'var(--bg)' }}>
        {children}
      </main>
      <BottomNav />
    </>
  );
}
