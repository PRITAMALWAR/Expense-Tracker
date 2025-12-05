import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px]">
          Smart Expense Tracker <span className="text-slate-600">·</span>{' '}
          <span className="text-slate-400">Stay on top of your daily spending.</span>
        </p>
        <p className="text-[11px]">
          Simple summaries to help you see where your money goes.
        </p>
      </div>
    </footer>
  );
};

export default Footer;


