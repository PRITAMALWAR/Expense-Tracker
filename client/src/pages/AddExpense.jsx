import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { expenseApi } from '../utils/api';

const defaultForm = {
  title: '',
  amount: '',
  category: 'Food',
  date: '',
  note: '',
};

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];

const AddExpense = () => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date) {
      toast.error('Please select a date');
      return;
    }
    setLoading(true);
    try {
      await expenseApi.create({
        ...form,
        amount: Number(form.amount),
        date: new Date(form.date),
      });
      toast.success('Expense added');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-6xl items-center justify-center px-4 pb-10 pt-6">
        <div className="card w-full max-w-lg p-6 text-sm">
          <h1 className="mb-1 text-lg font-semibold text-slate-100">Add Expense</h1>
          <p className="mb-5 text-xs text-slate-400">
            Capture a new transaction with title, amount, category, date, and an optional note.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
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
                rows={3}
                value={form.note}
                onChange={handleChange}
                className="input resize-none"
                placeholder="Optional details"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs" disabled={loading}>
                {loading ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddExpense;


