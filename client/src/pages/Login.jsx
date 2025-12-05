import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../utils/api';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      login(res.data.user, res.data.token);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
        <div className="card w-full max-w-md p-6">
        <h1 className="mb-1 text-lg font-semibold text-slate-100">Welcome back</h1>
        <p className="mb-5 text-xs text-slate-400">
          Sign in to your Smart Expense Tracker dashboard.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="mb-1 block text-xs text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              className="input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">
          New here?{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-400">
            Create an account
          </Link>
        </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;


