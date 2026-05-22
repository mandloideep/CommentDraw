import { Plus } from "lucide-react";

function PlanCard({ plan, onClick, isCurrent }) {
  const recommended = plan.id === 2;
  const indexLabel = String(plan.id).padStart(2, "0");

  return (
    <div
      className={`relative flex flex-col w-full md:w-80 min-h-[480px] p-8 gap-6 border-2 transition-colors duration-200 rounded-none
        ${
          recommended
            ? "border-ink dark:border-paper bg-paper dark:bg-ink"
            : "border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] bg-transparent hover:border-ink dark:hover:border-paper"
        }`}
    >
      {recommended && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-punch)] text-paper font-mono text-[10px] uppercase tracking-[0.18em]">
          Recommended
        </span>
      )}

      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-mute">
          {indexLabel} / {plan.name}
        </span>
        {isCurrent && (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-punch-2)]">
            ● Active
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-6xl font-semibold tracking-[-0.04em] text-ink dark:text-paper">
          {plan.price}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-mute">
          {plan.name.toUpperCase() === "FREE" ? "/ forever" : "/ month"}
        </span>
      </div>

      <p className="text-sm text-mute leading-relaxed border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-5">
        {plan.description}
      </p>

      <ul className="flex flex-col gap-3 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <Plus
              size={14}
              strokeWidth={2.75}
              className="mt-1 shrink-0 text-[var(--color-punch)]"
            />
            <span className="text-ink dark:text-paper">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onClick(plan)}
        disabled={isCurrent}
        className={`mt-2 h-12 px-6 font-mono text-xs uppercase tracking-[0.14em] border-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
          ${
            recommended
              ? "bg-ink text-paper border-ink dark:bg-paper dark:text-ink dark:border-paper hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper"
              : "bg-transparent text-ink dark:text-paper border-ink dark:border-paper hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink"
          }`}
      >
        {isCurrent ? "Current plan" : plan.cta}
      </button>
    </div>
  );
}
export default PlanCard;
