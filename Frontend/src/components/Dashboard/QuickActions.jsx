import { Trophy, Crown, History, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ACTIONS = [
  {
    label: "Start new draw",
    description: "Paste links, pick winners.",
    Icon: Trophy,
    to: "/home",
    primary: true,
  },
  {
    label: "Past giveaways",
    description: "Review previous winners.",
    Icon: History,
    to: "/history",
  },
  {
    label: "Manage plan",
    description: "Upgrade or change billing.",
    Icon: Crown,
    to: "/settings#sub",
  },
];

function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="w-full border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span className="text-[var(--color-punch)]">04</span> / Quick actions
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.to)}
            className={`group relative text-left p-5 border-2 transition-colors cursor-pointer flex flex-col gap-3 min-h-[140px] ${
              action.primary
                ? "bg-ink text-paper border-ink dark:bg-paper dark:text-ink dark:border-paper hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper"
                : "border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] hover:border-ink dark:hover:border-paper"
            }`}
          >
            <div className="flex items-start justify-between">
              <action.Icon size={20} strokeWidth={1.75} />
              <ArrowUpRight
                size={16}
                strokeWidth={2}
                className="opacity-40 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="mt-auto">
              <p className="font-display text-lg font-semibold tracking-[-0.02em] leading-tight">
                {action.label}
              </p>
              <p
                className={`text-xs mt-1 ${
                  action.primary
                    ? "text-paper/70 dark:text-ink/70 group-hover:text-paper/70"
                    : "text-mute"
                }`}
              >
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
