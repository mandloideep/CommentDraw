import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/Common";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const redirectEndpoint = localStorage.getItem("redirectEndpoint") || "/home";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectEndpoint, { replace: true });
      localStorage.removeItem("redirectEndpoint");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, redirectEndpoint]);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper flex flex-col">
      <div className="px-6 sm:px-10 py-6 border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
        <Logo />
      </div>
      <div className="flex-1 grid place-items-center px-6 py-16">
        <div className="text-center">
          <div className="flex gap-2 justify-center mb-8">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-3 h-3 bg-ink dark:bg-paper"
                style={{
                  animation: "cd-pulse-square 1s ease-in-out infinite",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-3">
            <span className="text-[var(--color-punch)]">●</span> Authenticating
          </p>
          <p
            className="font-display font-semibold tracking-[-0.03em]"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            Signing you in
            <span className="text-[var(--color-punch)]">.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
