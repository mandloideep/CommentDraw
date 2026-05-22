import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Terminal,
  Scale,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "../../components/Common";

const lastUpdated = "January 22, 2026";

const sections = [
  {
    Icon: User,
    title: "User accounts & eligibility",
    content: [
      {
        label: "Account access",
        desc: "You must sign in using Google OAuth to access CommentDraw. You are responsible for maintaining the security of your account and any activity performed under it.",
      },
      {
        label: "Age requirement",
        desc: "You must be at least 13 years old. If you are under 18, you confirm parent or legal guardian consent.",
      },
      {
        label: "Accurate information",
        desc: "You agree to provide accurate, up-to-date information and not to impersonate another person or entity.",
      },
    ],
  },
  {
    Icon: CreditCard,
    title: "Subscription & billing",
    content: [
      {
        label: "Plan availability",
        desc: "CommentDraw offers Free and paid subscription plans with usage limits as displayed in your dashboard.",
      },
      {
        label: "Billing & payments",
        desc: "Paid subscriptions are billed in advance through third-party payment providers. We do not store payment card information.",
      },
      {
        label: "Renewals & cancellation",
        desc: "Subscriptions may auto-renew unless canceled before the next billing cycle. Manage from account settings.",
      },
    ],
  },
  {
    Icon: CheckCircle,
    title: "Acceptable use",
    content: [
      {
        label: "Permitted purpose",
        desc: "Use CommentDraw only to select winners from YouTube comments for legitimate, transparent giveaways.",
      },
      {
        label: "Compliance",
        desc: "Comply with YouTube's Terms of Service, community guidelines, and all applicable laws.",
      },
      {
        label: "Winner responsibility",
        desc: "We only select winners. You are responsible for delivering prizes and honoring giveaway commitments.",
      },
    ],
  },
  {
    Icon: AlertCircle,
    title: "Prohibited activities",
    desc: "You may not misuse CommentDraw for illegal, misleading, or abusive purposes. This includes bypassing usage limits, manipulating results, scraping the service, reverse-engineering the platform, or automating access beyond intended usage.",
  },
  {
    Icon: Terminal,
    title: "YouTube API & third-party services",
    content: [
      {
        label: "YouTube data usage",
        desc: "We use the YouTube Data API to fetch public comments from videos you provide. Comment data is processed temporarily and not permanently stored.",
      },
      {
        label: "Third-party services",
        desc: "Authentication, payments, and analytics may be provided by third parties governed by their own terms and privacy policies.",
      },
    ],
  },
  {
    Icon: Scale,
    title: "Disclaimer & liability",
    content: [
      {
        label: "Service availability",
        desc: "CommentDraw is provided on an 'as-is' and 'as-available' basis. We do not guarantee uninterrupted or error-free operation.",
      },
      {
        label: "Limitation of liability",
        desc: "To the maximum extent permitted by law, CommentDraw shall not be liable for indirect, incidental, or consequential damages. Total liability shall not exceed the amount paid by you in the preceding 12 months.",
      },
    ],
  },
];

function TermsOfService() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper">
      <div className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-30 bg-paper/90 dark:bg-ink/90 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute hover:text-[var(--color-punch)] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <Logo />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute hidden sm:inline">
          Terms
        </span>
      </div>

      <main className="px-6 sm:px-10 py-16 max-w-4xl">
        <div className="mb-12 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-3">
              <span className="text-[var(--color-punch)]">▮</span> Terms of service
            </p>
            <h1
              className="font-display font-semibold tracking-[-0.04em] leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
            >
              The rules of the road
              <span className="text-[var(--color-punch)]">.</span>
            </h1>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-3 py-1.5">
            Updated · {lastUpdated}
          </span>
        </div>

        <div className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 mb-12 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-[var(--color-punch)]" strokeWidth={1.75} />
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              Welcome
            </p>
          </div>
          <p className="text-sm sm:text-base text-mute leading-relaxed">
            These Terms govern your access to and use of CommentDraw. By using the platform you agree to comply with these Terms, our Privacy Policy, and all applicable third-party terms.
          </p>
        </div>

        <div className="flex flex-col">
          {sections.map((section, idx) => (
            <section
              key={idx}
              className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] py-10"
            >
              <div className="grid lg:grid-cols-12 gap-y-6 lg:gap-x-12">
                <div className="lg:col-span-3 flex items-start gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-punch)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <section.Icon size={16} strokeWidth={1.75} className="text-mute" />
                </div>
                <div className="lg:col-span-9">
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] mb-6">
                    {section.title}
                  </h2>
                  {section.content ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {section.content.map((item, i) => (
                        <div key={i} className="flex flex-col gap-2">
                          <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-punch)]">
                            {item.label}
                          </h4>
                          <p className="text-sm text-mute leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-mute leading-relaxed max-w-2xl">
                      {section.desc}
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-12 mt-8 flex flex-col items-start gap-4">
          <Mail size={20} className="text-[var(--color-punch)]" strokeWidth={1.75} />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            Questions about these terms?
          </p>
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

export default TermsOfService;
