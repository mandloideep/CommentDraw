import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqData = [
  {
    question: "How does CommentDraw select giveaway winners?",
    answer:
      "We fetch comments via the official YouTube Data API, deduplicate by commenter, then run a uniform random draw across the qualifying pool. No manual interference, no weighting.",
  },
  {
    question: "Does CommentDraw need my YouTube password?",
    answer:
      "Never. We sign you in with Google OAuth and only request the read-only comments scope. Your password never reaches us — that's by design.",
  },
  {
    question: "Can I filter comments using keywords?",
    answer:
      "Yes. Add one or more keywords before drawing and only comments containing them will enter the pool. Filtering happens before deduplication.",
  },
  {
    question: "Can CommentDraw pick multiple winners?",
    answer:
      "Yes. Choose how many winners you want — up to 10 on Diamond — and we return a single set of unique winners in one draw.",
  },
  {
    question: "Can I draw across multiple YouTube videos?",
    answer:
      "Yes. Add up to 3 URLs and we'll pool comments across all of them for the draw.",
  },
  {
    question: "Is there a usage limit?",
    answer:
      "Yes — limits depend on plan. Free covers casual draws; Gold and Diamond expand monthly giveaways, comment counts, and winners per draw.",
  },
  {
    question: "How does subscription tracking work?",
    answer:
      "Your dashboard shows giveaways and winners used in the current cycle, and the remaining quota updates in real time.",
  },
  {
    question: "Can I view my previous giveaways and payments?",
    answer:
      "Yes. Past draws and your last payment are available from the dashboard at any time.",
  },
];

function FAQItem({ faq, isOpen, onToggle, index }) {
  return (
    <div className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group cursor-pointer"
      >
        <div className="flex items-baseline gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-punch)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-lg sm:text-xl font-medium tracking-[-0.01em] pr-4 group-hover:text-[var(--color-punch)] transition-colors">
            {faq.question}
          </span>
        </div>
        {isOpen ? (
          <Minus size={20} strokeWidth={2} className="shrink-0" />
        ) : (
          <Plus size={20} strokeWidth={2} className="shrink-0" />
        )}
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm sm:text-base text-mute leading-relaxed pb-6 pl-11 max-w-3xl">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="w-full border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]"
    >
      <div className="px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-y-10 lg:gap-x-12 mb-12">
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              <span className="text-[var(--color-punch)]">05</span> / FAQ
            </p>
          </div>
          <div className="lg:col-span-9">
            <h2
              className="font-display font-semibold leading-[0.95] tracking-[-0.04em] max-w-2xl"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Common questions
              <span className="text-[var(--color-punch)]">.</span>
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-3" />
          <div className="lg:col-span-9 border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
