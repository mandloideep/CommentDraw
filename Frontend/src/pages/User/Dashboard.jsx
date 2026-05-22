import { Loader, InfoModal } from "../../components/Common";
import { useDashboardAPIQuery } from "../../Redux/slices/apiSlice";
import {
  AccountInformation,
  GiveawayInsights,
  QuickActions,
} from "../../components/Dashboard";

function Dashboard() {
  const { data, error, isLoading } = useDashboardAPIQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <InfoModal
        isOpen={true}
        title="Error"
        message="Failed to load dashboard data. Please try again later."
        type="error"
        okText="OK"
        isContainsResendBtn={false}
      />
    );
  }

  const firstName = data?.user?.firstName
    ? data.user.firstName.charAt(0).toUpperCase() + data.user.firstName.slice(1)
    : "";

  return (
    <div className="w-full bg-paper dark:bg-ink text-ink dark:text-paper">
      <div className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 sm:px-10 py-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-4">
          <span className="text-[var(--color-punch)]">▮</span> Dashboard / Overview
        </p>
        <h1
          className="font-display font-semibold tracking-[-0.04em] leading-[0.95]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Welcome back, {firstName || "creator"}
          <span className="text-[var(--color-punch)]">.</span>
        </h1>
        <p className="text-sm sm:text-base text-mute mt-3 max-w-xl">
          Run a fair draw, check your quota, and review past winners.
        </p>
      </div>

      <div className="px-6 sm:px-10 py-10 flex flex-col gap-8">
        <QuickActions />
        <AccountInformation data={data} />
        <GiveawayInsights />
      </div>
    </div>
  );
}

export default Dashboard;
