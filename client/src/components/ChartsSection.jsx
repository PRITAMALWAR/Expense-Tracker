import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#facc15', '#f97316', '#f43f5e'];

const ChartsSection = ({ totalMonthly, categoryBreakdown, highestCategory, monthlyTrend }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card col-span-1 p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          This Month
        </h3>
        <p className="text-2xl font-bold text-emerald-300">
          ₹{Number(totalMonthly || 0).toFixed(2)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Highest category:{' '}
          <span className="font-medium text-slate-100">
            {highestCategory?.category || 'N/A'}
          </span>
        </p>
      </div>

      <div className="card col-span-1 p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Category Split
        </h3>
        <div className="flex h-40 items-center">
          {categoryBreakdown?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="totalAmount"
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  labelLine={false}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${entry.category}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #1e293b',
                    fontSize: 12,
                    color: '#e5e7eb',
                  }}
                  itemStyle={{ color: '#e5e7eb' }}
                  labelStyle={{ color: '#e5e7eb' }}
                  formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-500">No data for this month yet.</p>
          )}
        </div>
      </div>

      <div className="card col-span-1 p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          6-Month Trend
        </h3>
        <div className="h-40">
          {monthlyTrend?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(m) => `M${m}`}
                  stroke="#64748b"
                  fontSize={10}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #1e293b',
                    fontSize: 12,
                  }}
                  formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Spent']}
                />
                <Bar dataKey="totalAmount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-500">Trend will appear as you add expenses.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;


