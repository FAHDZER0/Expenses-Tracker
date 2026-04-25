import { Suspense } from 'react';
import SummaryContent from './summary-content';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <SummaryContent />
    </Suspense>
  );
}
