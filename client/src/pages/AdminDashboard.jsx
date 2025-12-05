import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { adminApi } from '../utils/api';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes] = await Promise.all([adminApi.overview(), adminApi.users()]);
      setOverview(overviewRes.data);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Admin Panel</h1>
            <p className="text-xs text-slate-400">
              High-level view of users and expenses across the platform.
            </p>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <section className="mb-4 grid gap-4 md:grid-cols-4">
              <div className="card p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Users
                </p>
                <p className="mt-2 text-2xl font-bold">{overview?.userCount ?? 0}</p>
              </div>
              <div className="card p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Expenses
                </p>
                <p className="mt-2 text-2xl font-bold">{overview?.expenseCount ?? 0}</p>
              </div>
              <div className="card p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Total Spent
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-300">
                  ₹{Number(overview?.totalAmount || 0).toFixed(2)}
                </p>
              </div>
              <div className="card p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Today&apos;s Spend
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-300">
                  ₹{Number(overview?.todayTotal || 0).toFixed(2)}
                </p>
              </div>
            </section>

            <section className="card overflow-hidden text-xs sm:text-sm">
              <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold text-slate-100">
                Users by Spending
              </div>
              <div className="max-h-[420px] overflow-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead className="bg-slate-900/80">
                    <tr>
                      <th className="px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Role
                      </th>
                      <th className="px-4 py-2 text-right text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Total Spent
                      </th>
                      <th className="px-4 py-2 text-right text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        # Expenses
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-xs text-slate-500"
                        >
                          No user stats yet.
                        </td>
                      </tr>
                    )}
                    {users.map((u) => (
                      <tr key={u.userId}>
                        <td className="px-4 py-2 text-slate-100">{u.name}</td>
                        <td className="px-4 py-2 text-slate-300">{u.email}</td>
                        <td className="px-4 py-2 text-slate-300">
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px]">
                            {u.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-right font-semibold text-emerald-300">
                          ₹{u.totalAmount.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-right text-slate-200">
                          {u.expenseCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;


