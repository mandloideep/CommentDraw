import { Link2, Filter, Dices, Trophy } from "lucide-react";

const steps = [
  {
    Icon: Link2,
    title: "Paste links",
    description: "Drop up to 3 YouTube video URLs into the draw setup.",
  },
  {
    Icon: Filter,
    title: "Fetch comments",
    description: "We pull every comment via the official YouTube Data API — quick, clean, read-only.",
  },
  {
    Icon: Dices,
    title: "Filter & draw",
    description: "Add optional keyword filters. Deduplicate by user. One tap runs the random draw.",
  },
  {
    Icon: Trophy,
    title: "Reveal winners",
    description: "Instant animated reveal. Export the list, or run another draw to replace no-shows.",
  },
];

function WorkingSection() {
  return (
    <section
      id="working"
      className="w-full border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]"
    >
      <div className="px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-y-10 lg:gap-x-12 mb-16">
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              <span className="text-[var(--color-punch)]">02</span> / How it works
            </p>
          </div>
          <div className="lg:col-span-9">
            <h2
              className="font-display font-semibold leading-[0.95] tracking-[-0.04em] max-w-3xl"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Four steps. Zero spreadsheets.
              <span className="text-[var(--color-punch)]">.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`p-6 sm:p-8 flex flex-col gap-4 border-b sm:border-b-0 border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] ${
                i !== steps.length - 1
                  ? "sm:border-r border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <step.Icon
                  size={28}
                  strokeWidth={1.75}
                  className="text-ink dark:text-paper"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-punch)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.02em] mt-2">
                {step.title}
              </h3>
              <p className="text-sm text-mute leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkingSection;
