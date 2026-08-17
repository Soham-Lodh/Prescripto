import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const toneClasses = {
  primary: {
    header: "from-blue-600 via-indigo-600 to-violet-600",
    accent: "bg-blue-50 text-blue-700 border-blue-100",
    button: "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
  },
  danger: {
    header: "from-rose-600 via-red-600 to-orange-500",
    accent: "bg-rose-50 text-rose-700 border-rose-100",
    button: "from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700",
  },
  success: {
    header: "from-emerald-600 via-teal-600 to-cyan-600",
    accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
    button: "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
  },
};

const PremiumConfirmModal = ({
  open,
  title,
  subtitle,
  children,
  tone = "primary",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
  confirmDisabled = false,
  meta,
}) => {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const theme = toneClasses[tone] || toneClasses.primary;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      onClick={onCancel}
      role="presentation"
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_30%)]" />

      <div
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/20 bg-white/90 shadow-[0_40px_150px_rgba(15,23,42,0.42)] ring-1 ring-white/30 backdrop-blur-2xl animate-popIn select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-r ${theme.header} px-6 py-5 text-white`}>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86l-7.42 12.8A2 2 0 004.6 20h14.8a2 2 0 001.73-3.34l-7.42-12.8a2 2 0 00-3.46 0z"
                />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
              {subtitle && <p className="mt-1 text-sm text-white/90">{subtitle}</p>}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            {meta && (
              <div className={`mb-5 rounded-2xl border px-4 py-3 ${theme.accent}`}>
                {meta}
              </div>
            )}

            <div className="space-y-4 text-sm text-slate-600">{children}</div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/90 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || confirmDisabled}
            className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 transition ${theme.button} disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" className="opacity-25" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {loading ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes popIn {
            from { opacity: 0; transform: translateY(18px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-popIn {
            animation: popIn 180ms ease-out;
          }
        `}
      </style>
    </div>,
    document.body
  );
};

export default PremiumConfirmModal;
