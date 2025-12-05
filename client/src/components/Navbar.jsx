import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-primary-600 px-2 py-1 text-xs font-semibold text-white">
            Smart
          </span>
          <span className="text-sm font-semibold text-slate-100 sm:text-base">
            Expense Tracker
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          {isAuthenticated && user ? (
            <>
              <Link
                to="/add-expense"
                className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800"
              >
                Add Expense
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800"
                >
                  Admin
                </Link>
              )}
              <span className="hidden text-slate-300 sm:inline">
                <span className="font-semibold text-slate-100">{user.name}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden rounded-lg bg-primary-600 px-3 py-1 text-xs font-medium text-white shadow hover:bg-primary-500 sm:inline-block"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


