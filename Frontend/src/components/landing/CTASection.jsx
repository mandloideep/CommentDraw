import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-ink dark:bg-paper text-paper dark:text-ink border-b border-[var(--color-rule-dark)] dark:border-[var(--color-rule)]">
      <div className="px-5 sm:px-8 lg:px-12 py-20 sm:py-32">
        <div className="grid lg:grid-cols-12 gap-y-10 lg:gap-x-12">
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60 dark:text-ink/60">
              <span className="text-[var(--color-punch)]">06</span> / Begin
            </p>
          </div>
          <div className="lg:col-span-9 flex flex-col gap-10">
            <h2
              className="font-display font-semibold leading-[0.9] tracking-[-0.04em] max-w-4xl"
              style={{ fontSize: "clamp(2.5rem, 9vw, 7rem)" }}
            >
              Run a fair draw
              <span className="text-[var(--color-punch)]">.</span>
              <br />
              In thirty seconds
              <span className="text-[var(--color-punch)]">.</span>
            </h2>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => navigate("/signup")}
                className="h-12 px-7 font-mono text-xs uppercase tracking-[0.14em] border-2 border-paper dark:border-ink bg-paper text-ink dark:bg-ink dark:text-paper hover:bg-[var(--color-punch)] hover:text-paper hover:border-[var(--color-punch)] transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                Get started
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="h-12 px-7 font-mono text-xs uppercase tracking-[0.14em] border-2 border-paper/40 dark:border-ink/40 text-paper dark:text-ink hover:border-paper dark:hover:border-ink transition-colors cursor-pointer"
              >
                I already have an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
