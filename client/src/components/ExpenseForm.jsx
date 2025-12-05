import React, { useEffect, useState } from 'react';

const defaultForm = {
  title: '',
  amount: '',
  category: 'Food',
  date: '',
  note: '',
};

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];

const ExpenseForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount?.toString() || '',
        category: initialData.category || 'Food',
        date: initialData.date ? initialData.date.slice(0, 10) : '',
        note: initialData.note || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
      date: new Date(form.date),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-100">
            {initialData ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-100"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 px-4 py-4 text-sm">
          <div>
            <label className="mb-1 block text-xs text-slate-300">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g. Grocery shopping"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-300">Amount</label>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-300">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-300">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-300">Note</label>
            <textarea
              name="note"
              rows={2}
              value={form.note}
              onChange={handleChange}
              className="input resize-none"
              placeholder="Optional details"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs">
              {initialData ? 'Save changes' : 'Add expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;


