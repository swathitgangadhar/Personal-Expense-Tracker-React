import React, { useEffect, useMemo, useState } from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const fallbackTransactions = [
  { id: 1, type: 'credit', category: 'Salary', amount: 4200, month: 'Jan' },
  { id: 2, type: 'credit', category: 'Freelance', amount: 1200, month: 'Jan' },
  { id: 3, type: 'debit', category: 'Rent', amount: 1400, month: 'Jan' },
  { id: 4, type: 'debit', category: 'Groceries', amount: 420, month: 'Feb' },
  { id: 5, type: 'credit', category: 'Investments', amount: 860, month: 'Feb' },
  { id: 6, type: 'debit', category: 'Travel', amount: 510, month: 'Mar' },
  { id: 7, type: 'credit', category: 'Bonus', amount: 1700, month: 'Mar' },
  { id: 8, type: 'debit', category: 'Utilities', amount: 230, month: 'Mar' },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

function Dashboard({ theme }) {
  const [transactions, setTransactions] = useState(fallbackTransactions);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetch('/api/transactions', {
          headers: { Authorization: localStorage.getItem('token') || '' },
        });

        if (!response.ok) {
          throw new Error('Using fallback transactions');
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setTransactions(
            data.map((item, index) => ({
              id: item.id || index + 1,
              type: item.type === 'income' ? 'credit' : item.type === 'expense' ? 'debit' : item.type,
              category: item.category || 'General',
              amount: Number(item.amount || 0),
              month: item.month || months[index % months.length],
            }))
          );
        }
      } catch (error) {
        setTransactions(fallbackTransactions);
      }
    };

    loadTransactions();
  }, []);

  const { creditTransactions, debitTransactions, totalCredit, totalDebit, pieData, monthlyBarData } = useMemo(() => {
    const creditRows = transactions.filter((transaction) => transaction.type === 'credit');
    const debitRows = transactions.filter((transaction) => transaction.type === 'debit');
    const creditTotal = creditRows.reduce((sum, transaction) => sum + transaction.amount, 0);
    const debitTotal = debitRows.reduce((sum, transaction) => sum + transaction.amount, 0);

    const monthlyCredits = months.map(
      (month) => creditRows.filter((transaction) => transaction.month === month).reduce((sum, transaction) => sum + transaction.amount, 0)
    );
    const monthlyDebits = months.map(
      (month) => debitRows.filter((transaction) => transaction.month === month).reduce((sum, transaction) => sum + transaction.amount, 0)
    );

    return {
      creditTransactions: creditRows,
      debitTransactions: debitRows,
      totalCredit: creditTotal,
      totalDebit: debitTotal,
      pieData: {
        labels: ['Credit', 'Debit'],
        datasets: [
          {
            data: [creditTotal, debitTotal],
            backgroundColor: ['#22c55e', '#ef4444'],
            borderWidth: 0,
          },
        ],
      },
      monthlyBarData: {
        labels: months,
        datasets: [
          {
            label: 'Monthly Credit',
            data: monthlyCredits,
            backgroundColor: '#3b82f6',
            borderRadius: 10,
          },
          {
            label: 'Monthly Debit',
            data: monthlyDebits,
            backgroundColor: '#f97316',
            borderRadius: 10,
          },
        ],
      },
    };
  }, [transactions]);

  const containerClassName =
    theme === 'dark'
      ? 'min-h-[calc(100vh-89px)] bg-slate-950 bg-none px-6 py-8 text-slate-100'
      : 'min-h-[calc(100vh-89px)] bg-dashboard-grid px-6 py-8 text-slate-900';

  const cardClassName =
    theme === 'dark'
      ? 'rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft'
      : 'card';

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#e2e8f0' : '#334155',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: theme === 'dark' ? '#cbd5e1' : '#475569' },
        grid: { display: false },
      },
      y: {
        ticks: { color: theme === 'dark' ? '#cbd5e1' : '#475569' },
        grid: { color: theme === 'dark' ? '#1e293b' : '#e2e8f0' },
      },
    },
  };

  return (
    <main className={containerClassName}>
      <div className='mx-auto flex max-w-7xl flex-col gap-6'>
        <section className={`${cardClassName} overflow-hidden`}>
          <div className='grid gap-6 lg:grid-cols-[1.4fr_0.9fr]'>
            <div>
              <p className='mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-700'>Dashboard background</p>
              <h2 className='text-3xl font-bold'>Smarter expense tracking with a polished Tailwind dashboard</h2>
              <p className='mt-3 max-w-2xl text-sm leading-7 text-slate-500'>
                Monitor your credits, debits, and monthly cash flow in separate cards with clearer tables and charts.
              </p>
              <div className='mt-6 grid gap-4 sm:grid-cols-3'>
                <StatCard label='Total Credit' value={`$${totalCredit.toLocaleString()}`} tone='green' />
                <StatCard label='Total Debit' value={`$${totalDebit.toLocaleString()}`} tone='red' />
                <StatCard label='Net Balance' value={`$${(totalCredit - totalDebit).toLocaleString()}`} tone='blue' />
              </div>
            </div>

            <div className='rounded-3xl bg-gradient-to-br from-brand-500 via-brand-700 to-slate-900 p-6 text-white shadow-soft'>
              <p className='text-sm font-medium text-white/70'>Quick snapshot</p>
              <h3 className='mt-4 text-2xl font-semibold'>Cashflow mix</h3>
              <div className='mt-6 h-64'>
                <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }} />
              </div>
            </div>
          </div>
        </section>

        <section className='grid gap-6 xl:grid-cols-2'>
          <div className={cardClassName}>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-xl font-semibold'>Credit Table</h3>
              <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Incoming</span>
            </div>
            <TransactionTable rows={creditTransactions} emptyLabel='No credits yet' />
          </div>

          <div className={cardClassName}>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-xl font-semibold'>Debit Table</h3>
              <span className='rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700'>Outgoing</span>
            </div>
            <TransactionTable rows={debitTransactions} emptyLabel='No debits yet' />
          </div>
        </section>

        <section className='grid gap-6 xl:grid-cols-2'>
          <div className={cardClassName}>
            <h3 className='mb-4 text-xl font-semibold'>Expense Split Pie Chart</h3>
            <div className='h-80'>
              <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: theme === 'dark' ? '#e2e8f0' : '#334155' } } } }} />
            </div>
          </div>

          <div className={cardClassName}>
            <h3 className='mb-4 text-xl font-semibold'>Monthly Credit vs Debit</h3>
            <div className='h-80'>
              <Bar data={monthlyBarData} options={chartOptions} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, tone }) {
  const tones = {
    blue: 'from-blue-500/15 to-blue-500/5 text-blue-700',
    green: 'from-emerald-500/15 to-emerald-500/5 text-emerald-700',
    red: 'from-rose-500/15 to-rose-500/5 text-rose-700',
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br p-4 ${tones[tone]}`}>
      <p className='text-xs font-semibold uppercase tracking-[0.25em]'>{label}</p>
      <p className='mt-3 text-2xl font-bold text-slate-900'>{value}</p>
    </div>
  );
}

function TransactionTable({ rows, emptyLabel }) {
  if (!rows.length) {
    return <p className='rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500'>{emptyLabel}</p>;
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-slate-200'>
      <table className='min-w-full divide-y divide-slate-200'>
        <thead className='bg-slate-50'>
          <tr>
            <th className='table-cell text-left font-semibold text-slate-500'>Category</th>
            <th className='table-cell text-left font-semibold text-slate-500'>Month</th>
            <th className='table-cell text-right font-semibold text-slate-500'>Amount</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-200 bg-white'>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className='table-cell font-medium text-slate-800'>{row.category}</td>
              <td className='table-cell text-slate-500'>{row.month}</td>
              <td className='table-cell text-right font-semibold text-slate-800'>${row.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
