import { Crown, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Limit({ label, value }) {
  return (
    <div className="flex items-center justify-between border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
        {label}
      </p>
      <span className="font-display text-base font-medium">{value}</span>
    </div>
  );
}

function SubscriptionSection({ dashboardData }) {
  const navigate = useNavigate();
  const handlePlanUpgrade = () => navigate("/upgrade-plan");
  const plan = (dashboardData?.user?.subscriptionType || "FREE").toUpperCase();
  const canUpgrade =
    plan !== "DIAMOND" &&
    (plan === "FREE" ||
      (plan === "GOLD" && (dashboardData?.user?.remainingGiveaways ?? 0) <= 0));

  return (
    <section
      id="sub"
      className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 sm:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span className="text-[var(--color-punch)]">03</span> / Subscription
        </p>
        <Crown size={16} className="text-mute" strokeWidth={1.75} />
      </div>

      <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] mb-2">
        Plan and limits
      </h2>
      <p className="text-sm text-mute mb-8">
        Your current plan and quota for this cycle.
      </p>

      <div className="flex items-center justify-between border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-5 mb-6">
        <div className="flex items-center gap-4">
          <Crown size={24} className="text-[var(--color-punch)]" strokeWidth={1.75} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Current plan
            </p>
            <p className="font-display text-xl font-semibold tracking-[-0.02em]">
              {plan}
            </p>
          </div>
        </div>
        {canUpgrade && (
          <button
            onClick={handlePlanUpgrade}
            className="h-10 px-4 inline-flex items-center gap-2 border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper transition-colors cursor-pointer"
          >
            Upgrade plan
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="flex flex-col">
        <Limit
          label="Max comments per giveaway"
          value={dashboardData?.user?.maxComments ?? "—"}
        />
        <Limit
          label="Max winners per giveaway"
          value={dashboardData?.user?.maxWinners ?? "—"}
        />
        <Limit
          label="Remaining giveaways"
          value={
            plan === "DIAMOND"
              ? "Unlimited"
              : dashboardData?.user?.remainingGiveaways ?? "—"
          }
        />
      </div>
    </section>
  );
}

export default SubscriptionSection;
