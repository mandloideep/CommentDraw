import { Trophy, User, Mail, MessageSquare } from "lucide-react";

// eslint-disable-next-line no-unused-vars
function Stat({ label, value, caption, Icon }) {
  return (
    <div className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Icon size={18} strokeWidth={1.75} className="text-[var(--color-punch)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          {label}
        </span>
      </div>
      <span className="font-display text-3xl font-semibold tracking-[-0.03em] mt-1">
        {value}
      </span>
      <p className="text-xs text-mute leading-relaxed">{caption}</p>
    </div>
  );
}

function AccountInformation({ data }) {
  const total = Number(data?.user?.maxGiveaways) || 0;
  const remaining = Number(data?.user?.remainingGiveaways) || 0;
  const used = Math.min(total, total - remaining);
  const percent = total > 0 ? Math.min(Math.round((used / total) * 100), 100) : 0;

  const firstName = data?.user?.firstName
    ? data.user.firstName.charAt(0).toUpperCase() + data.user.firstName.slice(1)
    : "";
  const lastName = data?.user?.lastName
    ? data.user.lastName.charAt(0).toUpperCase() + data.user.lastName.slice(1)
    : "";

  const plan = data?.user?.subscriptionType || "Free";

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">01</span> / Account
          </p>
          <User size={16} strokeWidth={1.75} className="text-mute" />
        </div>

        <div className="flex items-center gap-4">
          {data?.user?.avatarUrl ? (
            <img
              src={data.user.avatarUrl}
              alt=""
              className="w-14 h-14 object-cover border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]"
            />
          ) : (
            <div className="w-14 h-14 grid place-items-center border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] font-display text-xl">
              {firstName.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] truncate">
              {firstName} {lastName}
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-mute mt-1 truncate">
              <Mail size={12} />
              <span className="truncate">{data?.user?.email}</span>
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Plan
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] border ${
                plan.toLowerCase() === "gold"
                  ? "border-[var(--color-punch)] text-[var(--color-punch)]"
                  : plan.toLowerCase() === "diamond"
                  ? "border-[var(--color-punch-2)] text-[var(--color-punch-2)]"
                  : "border-mute text-mute"
              }`}
            >
              ● {plan}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Member since
            </span>
            <span className="text-sm">
              {data?.user?.createdAt && !isNaN(new Date(data.user.createdAt))
                ? new Date(data.user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">02</span> / This month
          </p>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            {percent}% used
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="font-display text-2xl font-semibold tracking-[-0.02em]">
              {used}
              <span className="text-mute font-normal text-base"> / {total}</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              giveaways
            </span>
          </div>
          <div className="w-full h-1 bg-[var(--color-rule)] dark:bg-[var(--color-rule-dark)]">
            <div
              className="h-1 bg-[var(--color-punch)] transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-mute">{remaining} remaining this cycle</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-6">
          <Stat
            label="Max comments"
            value={data?.user?.maxComments ?? "—"}
            caption="Comments processed per draw"
            Icon={MessageSquare}
          />
          <Stat
            label="Max winners"
            value={data?.user?.maxWinners ?? "—"}
            caption="Winners drawn per giveaway"
            Icon={Trophy}
          />
        </div>
      </div>
    </div>
  );
}

export default AccountInformation;
