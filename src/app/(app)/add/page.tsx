import { PageHeader } from '@/components/layout/PageHeader';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';

export const metadata = { title: 'Add Expense | Expense Tracker' };

export default function AddPage() {
  return (
    <>
      <PageHeader title="Add Expense" subtitle="Record a new transaction" />
      <div className="max-w-lg mx-auto">
        <ExpenseForm />
      </div>
    </>
  );
}
