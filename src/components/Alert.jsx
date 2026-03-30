import React from 'react';

const styles = {
  error: {
    ring: 'ring-red-100',
    border: 'border-red-200',
    bg: 'bg-red-50/80',
    text: 'text-red-900',
    iconBg: 'bg-red-100',
    icon: 'text-red-700',
  },
  success: {
    ring: 'ring-emerald-100',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50/80',
    text: 'text-emerald-900',
    iconBg: 'bg-emerald-100',
    icon: 'text-emerald-700',
  },
  warning: {
    ring: 'ring-amber-100',
    border: 'border-amber-200',
    bg: 'bg-amber-50/80',
    text: 'text-amber-900',
    iconBg: 'bg-amber-100',
    icon: 'text-amber-700',
  },
  info: {
    ring: 'ring-slate-100',
    border: 'border-slate-200',
    bg: 'bg-slate-50/80',
    text: 'text-slate-900',
    iconBg: 'bg-slate-100',
    icon: 'text-slate-700',
  },
};

const icons = {
  error: (
    <path d="M12 8v5m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  success: (
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  warning: (
    <path d="M12 9v4m0 4h.01M10.29 3.86l-7.4 12.6A1.5 1.5 0 004.2 19h15.6a1.5 1.5 0 001.31-2.24l-7.4-12.6a1.5 1.5 0 00-2.42 0z" />
  ),
  info: (
    <path d="M12 8h.01M11 12h1v4h1m9-4a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
};

export default function Alert({ type = 'info', title, children, className = '' }) {
  const palette = styles[type] || styles.info;

  return (
    <div className={`rounded-xl border ${palette.border} ${palette.bg} px-4 py-3 shadow-sm ring-1 ${palette.ring} ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full ${palette.iconBg} ${palette.icon}`}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {icons[type] || icons.info}
          </svg>
        </div>
        <div className={`text-left text-sm ${palette.text}`}>
          {title && <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{title}</p>}
          <div className="mt-0.5">{children}</div>
        </div>
      </div>
    </div>
  );
}
