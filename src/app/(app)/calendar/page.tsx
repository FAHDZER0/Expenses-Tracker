import { Suspense } from 'react';
import CalendarContent from './calendar-content';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <CalendarContent />
    </Suspense>
  );
}
