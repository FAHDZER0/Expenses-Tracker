'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PlusSquare, CalendarDays, Calendar, BarChart3, DollarSign, SlidersHorizontal } from 'lucide-react';

const TABS = [
  { href: '/add',      label: 'Add',      Icon: PlusSquare },
  { href: '/daily',    label: 'Daily',    Icon: CalendarDays },
  { href: '/calendar', label: 'Month',    Icon: Calendar },
  { href: '/summary',  label: 'Summary',  Icon: BarChart3 },
  { href: '/salary',   label: 'Salary',   Icon: DollarSign },
  { href: '/settings', label: 'More',     Icon: SlidersHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch pb-safe"
      aria-label="Main navigation"
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== '/add' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[60px] transition-all duration-150 active:scale-90 relative"
            style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
            aria-current={active ? 'page' : undefined}
          >
            {active && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
            )}
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
