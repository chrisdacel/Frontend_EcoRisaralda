import React from 'react';

const tones = {
  danger: {
    ring: 'ring-rose-200/70',
    border: 'border-rose-200',
    bg: 'bg-rose-50/90',
    text: 'text-rose-900',
    iconBg: 'bg-rose-100',
    icon: 'text-rose-700',
    confirm: 'bg-rose-600 hover:bg-rose-700',
  },
  warning: {
    ring: 'ring-amber-200/70',
    border: 'border-amber-200',
    bg: 'bg-amber-50/90',
    text: 'text-amber-900',
    iconBg: 'bg-amber-100',
    icon: 'text-amber-700',
    confirm: 'bg-amber-500 hover:bg-amber-600',
  },
  info: {
    ring: 'ring-slate-200/70',
    border: 'border-slate-200',
    bg: 'bg-slate-50/90',
    text: 'text-slate-900',
    iconBg: 'bg-slate-100',
    icon: 'text-slate-700',
    confirm: 'bg-emerald-600 hover:bg-emerald-700',
  },
};

export default function ConfirmDialog({
  open,
  title = 'Confirmar accion',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'warning',
  onConfirm,
  onClose,
}) {
  if (!open) return null;
  const palette = tones[tone] || tones.warning;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-2xl border ${palette.border} ${palette.bg} p-6 shadow-xl ring-1 ${palette.ring}`}>
        <div className="flex items-center gap-3">
          <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${palette.iconBg} ${palette.icon}`}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 9v4m0 4h.01M10.29 3.86l-7.4 12.6A1.5 1.5 0 004.2 19h15.6a1.5 1.5 0 001.31-2.24l-7.4-12.6a1.5 1.5 0 00-2.42 0z" />
            </svg>
          </div>
          <div className={`text-left text-sm ${palette.text}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{title}</p>
            <p className="mt-1 text-sm">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${palette.confirm}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
