import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Info,
  Lock,
  Eye,
  UserCheck,
  Database,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "../../components/Common";

const lastUpdated = "January 22, 2026";

const sections = [
  {
    Icon: Info,
    title: "Information we collect",
    content: [
      {
        label: "Account information",
        desc: "When you sign in using Google OAuth, we receive your name, email and profile image as provided by Google.",
      },
      {
        label: "Giveaway & usage data",
        desc: "Video URLs, number of winners, keywords, and selection history are stored to power dashboard insights.",
      },
      {
        label: "YouTube comment data",
        desc: "Public comments are fetched temporarily via the YouTube Data API for winner selection. We don't permanently store comment content.",
      },
    ],
  },
  {
    Icon: ShieldCheck,
    title: "How we use it",
    content: [
      {
        label: "Core functionality",
        desc: "To fetch YouTube comments, apply filters, select winners, and display results.",
      },
      {
        label: "Account management",
        desc: "Authentication, subscription tracking, and dashboard quota display.",
      },
      {
        label: "Essential communication",
        desc: "Account-related updates and essential notifications about your usage.",
      },
    ],
  },
  {
    Icon: Lock,
    title: "Data protection",
    content: [
      {
        label: "Secure transmission",
        desc: "All traffic between your browser and our servers uses HTTPS and industry-standard TLS encryption.",
      },
      {
        label: "Restricted access",
        desc: "User data is only accessible to authorized systems needed to operate the service.",
      },
      {
        label: "Session security",
        desc: "Secure tokens maintain sessions; your credentials are never exposed.",
      },
    ],
  },
  {
    Icon: Eye,
    title: "Third-party services",
    content: [
      {
        label: "Google OAuth",
        desc: "For secure authentication. We only access the basic profile details you approve.",
      },
      {
        label: "YouTube Data API",
        desc: "For retrieving public comments. We comply with all YouTube API Services Terms of Service.",
      },
      {
        label: "No data selling",
        desc: "We do not sell, rent, or trade your personal information.",
      },
    ],
  },
  {
    Icon: UserCheck,
    title: "Your rights & controls",
    content: [
      {
        label: "Account access",
        desc: "View and update your profile and giveaway history from your dashboard.",
      },
      {
        label: "Data deletion",
        desc: "Request account deletion at any time to remove your personal data from our active systems.",
      },
      {
        label: "Usage tracking",
        desc: "Full transparency on your usage quotas and subscription status.",
      },
    ],
  },
];

function PrivacyPolicy() {
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
          Privacy
        </span>
      </div>

      <main className="px-6 sm:px-10 py-16 max-w-4xl">
        <div className="mb-12 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-3">
              <span className="text-[var(--color-punch)]">▮</span> Privacy policy
            </p>
            <h1
              className="font-display font-semibold tracking-[-0.04em] leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
            >
              How we handle your data
              <span className="text-[var(--color-punch)]">.</span>
            </h1>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-3 py-1.5">
            Updated · {lastUpdated}
          </span>
        </div>

        <div className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 mb-12 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Database size={18} className="text-[var(--color-punch)]" strokeWidth={1.75} />
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              Introduction
            </p>
          </div>
          <p className="text-sm sm:text-base text-mute leading-relaxed">
            CommentDraw is built to help creators run fair YouTube giveaways. We collect only the information required to operate the platform and select winners reliably. For any concerns, reach out at{" "}
            <a
              href="mailto:privacy@commentdraw.com"
              className="text-[var(--color-punch)] underline underline-offset-4"
            >
              privacy@commentdraw.com
            </a>
            .
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
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-12 mt-8 flex flex-col items-start gap-4">
          <Mail size={20} className="text-[var(--color-punch)]" strokeWidth={1.75} />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            Questions?
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

export default PrivacyPolicy;
