import { useState } from "react";
import { PlanCard, InfoModal } from "../../components/Common";
import { useDashboardAPIQuery } from "../../Redux/slices/apiSlice";
import { usePayment } from "../../components/Settings/hooks/usePayment";

const subscriptionPlan = [
  {
    id: 1,
    name: "Free",
    price: "$0",
    description: "Perfect to try out a fair draw.",
    features: [
      "3 giveaways per month",
      "Up to 300 comments per draw",
      "2 winners per giveaway",
    ],
    cta: "Start free",
  },
  {
    id: 2,
    name: "Gold",
    price: "$9",
    description: "For creators running regular draws.",
    features: [
      "10 giveaways per month",
      "Up to 600 comments per draw",
      "Up to 5 winners per giveaway",
    ],
    cta: "Go Gold",
  },
  {
    id: 3,
    name: "Diamond",
    price: "$29",
    description: "Unlimited draws for power users.",
    features: [
      "Unlimited giveaways",
      "Up to 1,000 comments per draw",
      "10 winners per giveaway",
    ],
    cta: "Go Diamond",
  },
];

function UpgradePlan() {
  const { data: dashboardData } = useDashboardAPIQuery();
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    okText: "OK",
    isContainsResendBtn: false,
    onOk: () => setModal((prev) => ({ ...prev, open: false })),
  });

  const currentPlan = dashboardData?.user?.subscriptionType || "FREE";
  const userEmail = dashboardData?.user?.email || "";
  const { handlePayment } = usePayment(userEmail, setModal);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper">
      <div className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 sm:px-10 py-12">
        <div className="grid lg:grid-cols-12 gap-y-6 lg:gap-x-12">
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              <span className="text-[var(--color-punch)]">▮</span> Pricing
            </p>
          </div>
          <div className="lg:col-span-9 flex flex-col gap-4">
            <h1
              className="font-display font-semibold tracking-[-0.04em] leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Choose your plan
              <span className="text-[var(--color-punch)]">.</span>
            </h1>
            <p className="text-base sm:text-lg text-mute max-w-2xl">
              Unlock CommentDraw's full power with a plan that fits your audience.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl">
          {subscriptionPlan.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={currentPlan === plan.name.toUpperCase()}
              onClick={() => handlePayment(plan.name)}
            />
          ))}
        </div>
      </div>

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

export default UpgradePlan;
