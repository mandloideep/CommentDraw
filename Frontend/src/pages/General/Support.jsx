import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Minus,
  ArrowLeft,
  ExternalLink,
  Github,
  Mail,
} from "lucide-react";
import { Logo } from "../../components/Common";

const supportCards = [
  {
    title: "How it works",
    desc: "Learn about the YouTube API and our winner selection logic.",
    Icon: BookOpen,
    action: "View docs",
  },
  {
    title: "Source code",
    desc: "Check out the project repository and contribution guidelines.",
    Icon: Github,
    action: "GitHub repo",
  },
];

const faqs = [
  {
    q: "How do I run a giveaway on CommentDraw?",
    a: "Paste your YouTube video link, set optional filters, then click 'Pick winners'. We fetch comments in real time and run a fair random draw.",
  },
  {
    q: "Is the winner selection truly random?",
    a: "Yes. We use a deterministic random draw across the deduplicated commenter pool — every eligible commenter has equal weight.",
  },
  {
    q: "How many videos can I process at once?",
    a: "Up to 3 video URLs per draw. Comments from all of them are merged into a single pool.",
  },
];

function Support() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper">
      <div className="sticky top-0 z-30 border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] bg-paper/90 dark:bg-ink/90 backdrop-blur-sm px-6 sm:px-10 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute hover:text-[var(--color-punch)] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <Logo />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute hidden sm:inline">
          Support
        </span>
      </div>

      <main className="px-6 sm:px-10 py-16 max-w-5xl">
        <div className="grid lg:grid-cols-12 gap-y-8 lg:gap-x-12 mb-16">
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              <span className="text-[var(--color-punch)]">▮</span> Support
            </p>
          </div>
          <div className="lg:col-span-9">
            <h1
              className="font-display font-semibold tracking-[-0.04em] leading-[0.95] mb-4 max-w-3xl"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              How can we help
              <span className="text-[var(--color-punch)]">?</span>
            </h1>
            <p className="text-base sm:text-lg text-mute max-w-xl">
              Answers to common questions, plus links into the deeper bits.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {supportCards.map((card, idx) => (
            <div
              key={idx}
              className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 hover:border-ink dark:hover:border-paper transition-colors flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <card.Icon size={22} strokeWidth={1.75} />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-medium">{card.title}</h3>
                <p className="text-xs text-mute leading-relaxed mt-1">
                  {card.desc}
                </p>
              </div>
              <button className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-punch)] hover:underline underline-offset-4 inline-flex items-center gap-1 self-start cursor-pointer">
                {card.action}
                <ExternalLink size={11} />
              </button>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-y-8 lg:gap-x-12 mb-12">
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              <span className="text-[var(--color-punch)]">▮</span> FAQ
            </p>
          </div>
          <div className="lg:col-span-9 border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                  aria-expanded={openFaq === idx}
                >
                  <span className="flex items-baseline gap-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-punch)]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base sm:text-lg font-medium">
                      {item.q}
                    </span>
                  </span>
                  {openFaq === idx ? (
                    <Minus size={18} className="shrink-0" />
                  ) : (
                    <Plus size={18} className="shrink-0" />
                  )}
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    openFaq === idx ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm text-mute leading-relaxed pb-6 pl-10 max-w-3xl">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-12 flex flex-col items-start gap-4">
          <Mail size={20} className="text-[var(--color-punch)]" strokeWidth={1.75} />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            Still need help?
          </p>
          <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">
            Email us
          </h3>
          <a
            href="mailto:support@commentdraw.com"
            className="font-mono text-base text-[var(--color-punch)] underline underline-offset-4 hover:text-ink dark:hover:text-paper transition-colors"
          >
            support@commentdraw.com
          </a>
        </div>
      </main>
    </div>
  );
}

export default Support;
