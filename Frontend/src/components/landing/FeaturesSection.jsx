import { Trophy, Play, Users, Zap, ShieldCheck, Sparkles } from "lucide-react";

const featuresData = [
  {
    Icon: Play,
    title: "Fetch comments",
    description:
      "Pull comments from any public YouTube video using the official API. No scraping, no shenanigans.",
  },
  {
    Icon: Trophy,
    title: "Random by design",
    description:
      "A deterministic random draw over a deduplicated commenter pool. Auditable, every time.",
  },
  {
    Icon: Users,
    title: "Multi-winner draws",
    description:
      "Pick one winner or ten in a single run. Optional filters narrow down to qualifying comments.",
  },
  {
    Icon: Zap,
    title: "Instant reveal",
    description:
      "Winner cards animate in with a built-in countdown. Export to CSV or re-run with a single click.",
  },
  {
    Icon: ShieldCheck,
    title: "Read-only Google",
    description:
      "We use OAuth and only request the comments scope. Your YouTube credentials never touch us.",
  },
  {
    Icon: Sparkles,
    title: "Quota that scales",
    description:
      "Free for casual draws, Gold for the regulars, Diamond when comment counts go big.",
  },
];

function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] bg-paper dark:bg-ink"
    >
      <div className="px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-y-10 lg:gap-x-12 mb-16">
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              <span className="text-[var(--color-punch)]">03</span> / Features
            </p>
          </div>
          <div className="lg:col-span-9">
            <h2
              className="font-display font-semibold leading-[0.95] tracking-[-0.04em] max-w-3xl"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Everything for a fair draw. Nothing else
              <span className="text-[var(--color-punch)]">.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
          {featuresData.map((feature, i) => (
            <div
              key={feature.title}
              className="p-8 border-b border-r border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] flex flex-col gap-4 hover:bg-ink/[0.02] dark:hover:bg-paper/[0.03] transition-colors"
            >
              <div className="flex items-start justify-between">
                <feature.Icon
                  size={26}
                  strokeWidth={1.75}
                  className="text-ink dark:text-paper"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold tracking-[-0.02em] mt-2">
                {feature.title}
              </h3>
              <p className="text-sm text-mute leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
