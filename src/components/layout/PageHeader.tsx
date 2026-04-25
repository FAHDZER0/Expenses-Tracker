'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  right?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backHref, right }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3"
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {backHref && (
        <button
          onClick={() => router.push(backHref)}
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors active:scale-90"
          style={{ background: 'var(--bg-elevated)' }}
          aria-label="Go back"
        >
          <ChevronLeft size={20} style={{ color: 'var(--text-primary)' }} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </header>
  );
}
