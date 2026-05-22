import { AlertTriangle } from "lucide-react";

export default function CautionModal({ isOpen, onClose, onConfirm, data }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4">
      <div className="w-full max-w-md border-2 border-ink dark:border-paper bg-paper dark:bg-ink text-ink dark:text-paper">
        <div className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 py-4 flex items-center gap-3">
          <AlertTriangle
            size={18}
            strokeWidth={2.25}
            className={data.isDangerous ? "text-[var(--color-punch)]" : "text-mute"}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            {data.isDangerous ? "Destructive action" : "Confirm"}
          </span>
        </div>

        <div className="px-6 py-6">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] mb-3">
            {data.title}
          </h2>
          <p className="text-sm text-mute leading-relaxed">{data.message}</p>

          {data.warnings && (
            <div className="mt-6 border border-[var(--color-punch)] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-punch)] mb-3">
                Will be {data.actionType}
              </p>
              <ul className="space-y-2">
                {data.warnings.map((w, i) => (
                  <li
                    key={i}
                    className="text-sm flex items-center gap-2 text-ink dark:text-paper"
                  >
                    <span className="h-1 w-1 bg-[var(--color-punch)] rounded-full" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="h-10 px-5 border-2 border-ink dark:border-paper bg-transparent font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`h-10 px-5 border-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer ${
              data.isDangerous
                ? "border-[var(--color-punch)] bg-[var(--color-punch)] text-paper hover:bg-ink hover:border-ink"
                : "border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper"
            }`}
          >
            {data.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
