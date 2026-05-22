import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper flex flex-col">
      <div className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 sm:px-12 py-6 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-mute">
          Error · Not Found
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-mute">
          404 / 404
        </span>
      </div>

      <main className="flex-1 grid place-items-center px-6 sm:px-12 py-20">
        <div className="w-full max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-punch)] mb-6">
            ▮ This page does not exist.
          </p>
          <h1
            className="font-display font-semibold leading-[0.85] tracking-[-0.04em]"
            style={{ fontSize: "clamp(6rem, 22vw, 18rem)" }}
          >
            404<span className="text-[var(--color-punch)]">.</span>
          </h1>
          <p className="mt-10 max-w-xl text-lg text-mute leading-relaxed">
            The link you followed may be broken, or the page may have been moved. Head back to the home page and start again.
          </p>
          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono uppercase text-sm tracking-tight bg-ink text-paper dark:bg-paper dark:text-ink px-6 h-11 border-2 border-ink dark:border-paper hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper transition-colors"
            >
              Back home
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotFound;
