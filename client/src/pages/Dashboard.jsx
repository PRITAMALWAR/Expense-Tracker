import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import ChartsSection from '../components/ChartsSection';
import { expenseApi } from '../utils/api';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: 'All',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [expRes, analyticsRes] = await Promise.all([
        expenseApi.list(filters),
        expenseApi.analytics({}),
      ]);
      setExpenses(expRes.data.expenses || []);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const expRes = await expenseApi.list(filters);
      setExpenses(expRes.data.expenses || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to filter expenses');
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingExpense) {
        await expenseApi.update(editingExpense._id, data);
        toast.success('Expense updated');
      } else {
        await expenseApi.create(data);
        toast.success('Expense added');
      }
      setIsFormOpen(false);
      setEditingExpense(null);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = async (expense) => {
    // Simple confirmation; could be replaced with a nicer modal
    // eslint-disable-next-line no-alert
    const ok = window.confirm(`Delete expense "${expense.title}"?`);
    if (!ok) return;
    try {
      await expenseApi.remove(expense._id);
      toast.success('Expense deleted');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Dashboard</h1>
            <p className="text-xs text-slate-400">
              Track daily expenses, visualize spending, and stay in control.
            </p>
          </div>
          <button type="button" className="btn-primary text-xs" onClick={openAddForm}>
            + Add Expense
          </button>
        </div>

        <section className="mb-4 card p-4 text-xs sm:text-sm">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-[11px] text-slate-300">From</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-slate-300">To</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-slate-300">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="All">All</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              type="button"
              onClick={applyFilters}
              className="btn-primary mt-5 text-xs"
            >
              Apply Filters
            </button>
          </div>
        </section>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <section className="mb-4">
              <ChartsSection
                totalMonthly={analytics?.totalMonthly}
                categoryBreakdown={analytics?.categoryBreakdown || []}
                highestCategory={analytics?.highestCategory}
                monthlyTrend={analytics?.monthlyTrend || []}
              />
            </section>

            <section>
              <ExpenseTable
                expenses={expenses}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </section>
          </>
        )}
      </main>
      <Footer />
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
      />
    </div>
  );
};

export default Dashboard;


