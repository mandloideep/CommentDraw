import { useNavigate } from "react-router-dom";
import { PlanCard } from "../Common";

const subscriptionPlan = [
  {
    id: 1,
    name: "FREE",
    price: "$0",
    description: "Get a feel for fair draws — no card needed.",
    features: [
      "3 giveaways per month",
      "Up to 300 comments per draw",
      "2 winners per giveaway",
    ],
    cta: "Start free",
  },
  {
    id: 2,
    name: "GOLD",
    price: "$9",
    description: "For regulars who run a draw most weeks.",
    features: [
      "10 giveaways per month",
      "Up to 600 comments per draw",
      "Up to 5 winners per giveaway",
    ],
    cta: "Go Gold",
  },
  {
    id: 3,
    name: "DIAMOND",
    price: "$19",
    description: "Unlimited draws for high-volume creators.",
    features: [
      "Unlimited giveaways",
      "Up to 1,000 comments per draw",
      "10 winners per giveaway",
    ],
    cta: "Go Diamond",
  },
];

function Subscription() {
  const navigate = useNavigate();

  const handleClick = (planName) => {
    if (planName === "FREE") {
      navigate("/signup");
      return;
    }
    localStorage.setItem("redirectEndpoint", `/review-order?plan=${planName}`);
    navigate("/signup");
  };

  return (
    <section
      id="pricing"
      className="w-full border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]"
    >
      <div className="px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-y-10 lg:gap-x-12 mb-16">
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              <span className="text-[var(--color-punch)]">04</span> / Pricing
            </p>
          </div>
          <div className="lg:col-span-9 flex flex-col gap-4">
            <h2
              className="font-display font-semibold leading-[0.95] tracking-[-0.04em] max-w-3xl"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Free to start. Cheap to scale
              <span className="text-[var(--color-punch)]">.</span>
            </h2>
            <p className="text-base sm:text-lg text-mute max-w-2xl">
              All plans include the same fair draw engine. The price is for volume — pick
              what matches your audience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {subscriptionPlan.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onClick={() => handleClick(plan.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Subscription;
