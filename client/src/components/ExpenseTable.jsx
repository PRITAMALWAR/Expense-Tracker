import React, { useMemo, useState } from 'react';

const headers = [
  { key: 'date', label: 'Date' },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount' },
];

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = useMemo(() => {
    const sortedData = [...expenses];
    sortedData.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [expenses, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (key === sortBy) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="card overflow-hidden text-xs sm:text-sm">
      <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold text-slate-100">
        Recent Expenses
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/80">
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={() => toggleSort(h.key)}
                  className="cursor-pointer px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400"
                >
                  <span className="inline-flex items-center gap-1">
                    {h.label}
                    {sortBy === h.key && (
                      <span>{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </span>
                </th>
              ))}
              <th className="px-4 py-2 text-right text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/40">
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length + 1}
                  className="px-4 py-6 text-center text-xs text-slate-500"
                >
                  No expenses yet. Add your first one to get started.
                </td>
              </tr>
            )}
            {sorted.map((exp) => (
              <tr key={exp._id}>
                <td className="whitespace-nowrap px-4 py-2 text-slate-200">
                  {new Date(exp.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-slate-100">{exp.title}</td>
                <td className="px-4 py-2">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200">
                    {exp.category}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-semibold text-emerald-300">
                  ₹{exp.amount.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onEdit(exp)}
                    className="mr-2 text-[11px] text-primary-500 hover:text-primary-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(exp)}
                    className="text-[11px] text-rose-400 hover:text-rose-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;


