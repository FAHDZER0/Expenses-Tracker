import { Suspense } from 'react';
import DailyPage from './daily-content';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <DailyPage />
    </Suspense>
  );
}
