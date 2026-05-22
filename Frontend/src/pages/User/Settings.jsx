import { useState, useEffect } from "react";
import { useDashboardAPIQuery } from "../../Redux/slices/apiSlice";
import { InfoModal, Loader } from "../../components/Common";
import {
  ProfileSection,
  PasswordSection,
  SubscriptionSection,
  LastPaymentSection,
  AccountActionsSection,
} from "../../components/Settings";
import { useLocation } from "react-router-dom";

export default function Settings() {
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const {
    data: dashboardData,
    error: dashboardError,
    isLoading: dashboardLoading,
    refetch: refetchDashboard,
  } = useDashboardAPIQuery();

  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#sub") {
      const timer = setTimeout(() => {
        const element = document.getElementById("sub");
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location, dashboardLoading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get("session_id")) return;

    // Stripe redirected us back after a successful checkout. The webhook may not have
    // fired yet, so poll the dashboard a few times before giving up.
    const delays = [1000, 3000, 6000];
    const timers = delays.map((d) => setTimeout(() => refetchDashboard(), d));
    return () => timers.forEach(clearTimeout);
  }, [location.search, refetchDashboard]);

  if (dashboardLoading) return <Loader />;

  if (dashboardError) {
    return (
      <InfoModal
        isOpen={true}
        title="Error"
        message="Something went wrong, please try again later!"
        type="error"
        okText="OK"
        isContainsResendBtn={false}
        onOk={() => setModal({ ...modal, open: false })}
      />
    );
  }

  return (
    <div className="w-full bg-paper dark:bg-ink text-ink dark:text-paper">
      <div className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 sm:px-10 py-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-4">
          <span className="text-[var(--color-punch)]">▮</span> Settings
        </p>
        <h1
          className="font-display font-semibold tracking-[-0.04em] leading-[0.95]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Account & preferences
          <span className="text-[var(--color-punch)]">.</span>
        </h1>
        <p className="text-sm sm:text-base text-mute mt-3 max-w-xl">
          Manage your profile, password, subscription and billing.
        </p>
      </div>

      <div className="px-6 sm:px-10 py-10 flex flex-col gap-8 max-w-5xl">
        <ProfileSection
          dashboardData={dashboardData}
          refetchDashboard={refetchDashboard}
          setModal={setModal}
        />
        <PasswordSection setModal={setModal} />
        <SubscriptionSection dashboardData={dashboardData} />
        <LastPaymentSection />
        <AccountActionsSection setModal={setModal} />
      </div>

      {modal.open && (
        <InfoModal
          isOpen={modal.open}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          okText="OK"
          isContainsResendBtn={false}
          onOk={() => setModal({ ...modal, open: false })}
        />
      )}
    </div>
  );
}
