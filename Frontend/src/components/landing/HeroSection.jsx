import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
      <div className="grid lg:grid-cols-12 px-5 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-32 gap-y-12 lg:gap-x-12">
        <div className="lg:col-span-2 flex flex-col justify-between gap-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">01</span> / Giveaways, reimagined
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute hidden lg:block">
            Est. 2025 · Built for creators
          </p>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-8">
          <h1
            className="font-display font-semibold leading-[0.92] tracking-[-0.045em] text-ink dark:text-paper"
            style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)" }}
          >
            Pick winners.
            <br />
            From comments.
            <br />
            <span className="text-[var(--color-punch)]">Fairly.</span>
          </h1>

          <p className="max-w-xl text-lg sm:text-xl text-mute leading-relaxed">
            CommentDraw is the quiet, fair way to run a YouTube giveaway. Paste a link, let us
            fetch every comment, and a single tap picks the winners.
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => navigate("/signup")}
              className="h-12 px-7 font-mono text-xs uppercase tracking-[0.14em] border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              Start drawing
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </button>
            <button
              className="h-12 px-7 font-mono text-xs uppercase tracking-[0.14em] border-2 border-ink dark:border-paper bg-transparent text-ink dark:text-paper hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <Play size={14} fill="currentColor" />
              Watch demo
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col justify-end gap-6">
          <div className="border-t-2 border-ink dark:border-paper pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute mb-2">
              ● Trusted by creators
            </p>
            <p className="font-display text-3xl font-semibold tracking-[-0.03em]">
              10,000+
              <span className="text-[var(--color-punch)]">.</span>
            </p>
            <p className="text-xs text-mute mt-1">draws completed worldwide</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { k: "API", v: "Official" },
              { k: "Fair", v: "100%" },
              { k: "Setup", v: "30 sec" },
            ].map((s) => (
              <div
                key={s.k}
                className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-3"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-mute">
                  {s.k}
                </p>
                <p className="font-display text-sm font-semibold mt-1">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
