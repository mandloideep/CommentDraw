import { useState, useEffect } from "react";
import { Check, ArrowLeft, ShieldCheck, ArrowUpRight } from "lucide-react";
import SUBSCRIPTION_PLANS from "../../../config/subscriptionPlans";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePayment } from "../../components/Settings/hooks/usePayment";
import { InfoModal, Loader, Logo } from "../../components/Common";
import { useDashboardAPIQuery } from "../../Redux/slices/apiSlice";

function ReviewOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useDashboardAPIQuery();

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    okText: "OK",
    isContainsResendBtn: false,
    onOk: () => setModal((prev) => ({ ...prev, open: false })),
  });

  const planName = searchParams.get("plan")?.toUpperCase() || "GOLD";
  const isValidPlan =
    Object.keys(SUBSCRIPTION_PLANS).includes(planName) && planName !== "FREE";

  const userEmail = dashboardData?.user?.email || "";
  const { handlePayment } = usePayment(userEmail, setModal);

  useEffect(() => {
    if (!isDashboardLoading && !isValidPlan) {
      navigate("/home", { replace: true });
    }
  }, [isValidPlan, navigate, isDashboardLoading]);

  if (isDashboardLoading) return <Loader />;
  if (!isValidPlan) return <Loader />;

  const planDetails = SUBSCRIPTION_PLANS[planName] || SUBSCRIPTION_PLANS.GOLD;
  const price = planDetails.price;
  const planTitle = planName.charAt(0) + planName.slice(1).toLowerCase();

  const features = [
    planDetails.maxGiveaways === -1
      ? "Unlimited giveaways"
      : `${planDetails.maxGiveaways} giveaways per month`,
    `Up to ${planDetails.maxComments.toLocaleString()} comments per draw`,
    `Up to ${planDetails.maxWinners} winners per giveaway`,
  ];

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper flex flex-col">
      <div className="px-6 sm:px-10 py-6 border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute hover:text-[var(--color-punch)] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <Logo />
        <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          <ShieldCheck size={14} className="text-[var(--color-punch-2)]" />
          Secure checkout
        </div>
      </div>

      <main className="flex-1 grid lg:grid-cols-12 px-6 sm:px-10 py-12">
        <div className="lg:col-span-3 mb-8 lg:mb-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">▮</span> Review order
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-4">
          <h1
            className="font-display font-semibold tracking-[-0.04em] leading-[0.95] mb-3"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
          >
            One step away
            <span className="text-[var(--color-punch)]">.</span>
          </h1>
          <p className="text-sm sm:text-base text-mute mb-10">
            Confirm your plan and complete checkout.
          </p>

          <div className="border-2 border-ink dark:border-paper p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-2">
                  Plan
                </p>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">
                  {planTitle}
                </h2>
                <p className="text-xs text-mute mt-1">Monthly subscription</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 border border-[var(--color-punch)] text-[var(--color-punch)] font-mono text-[10px] uppercase tracking-[0.18em]">
                ● {planTitle}
              </span>
            </div>

            <ul className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-5 flex flex-col gap-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    className="text-[var(--color-punch)] shrink-0"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-5 flex flex-col gap-3">
              <div className="flex justify-between font-mono text-xs uppercase tracking-tight text-mute">
                <span>Subtotal</span>
                <span className="text-ink dark:text-paper">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-mono text-xs uppercase tracking-tight text-mute">
                <span>Tax (0%)</span>
                <span className="text-ink dark:text-paper">$0.00</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-4 mt-1">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-mute">
                  Total
                </span>
                <div className="text-right">
                  <span className="font-display text-4xl font-semibold tracking-[-0.03em]">
                    ${price.toFixed(2)}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute ml-2">
                    / month
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePayment(planName)}
              className="w-full h-12 inline-flex items-center justify-center gap-2 border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink font-mono text-xs uppercase tracking-[0.18em] hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper transition-colors cursor-pointer"
            >
              Confirm & pay
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>

            <p className="text-xs text-mute text-center">
              By confirming, you agree to our{" "}
              <button
                onClick={() => navigate("/terms-of-service")}
                className="underline underline-offset-4 hover:text-ink dark:hover:text-paper cursor-pointer"
              >
                Terms
              </button>{" "}
              and{" "}
              <button
                onClick={() => navigate("/privacy-policy")}
                className="underline underline-offset-4 hover:text-ink dark:hover:text-paper cursor-pointer"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </main>

      {modal.open && (
        <InfoModal
          isOpen={modal.open}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          okText={modal.okText}
          isContainsResendBtn={false}
          onOk={modal.onOk}
        />
      )}
    </div>
  );
}

export default ReviewOrder;
