import { useState } from "react";
import { User, Trash2 } from "lucide-react";
import { useAccountActions } from "./hooks/useAccountActions";
import CautionModal from "./CautionModal";
import OTPVerificationModal from "./OTPVerificationModal";

function AccountActionsSection({ setModal }) {
  const {
    handleCautionConfirm,
    handleVerifyOTP,
    closeModals,
    showOtpModal,
    isVerifying,
  } = useAccountActions(setModal);

  const [cautionModal, setCautionModal] = useState({
    isOpen: false,
    onClose: {},
    onConfirm: {},
    data: {},
  });

  const handleCloseCaution = () =>
    setCautionModal((prev) => ({ ...prev, isOpen: false }));

  const actions = [
    {
      title: "Delete account",
      description: "Permanently delete your account and all associated data.",
      Icon: Trash2,
      destructive: true,
      onClick: () =>
        setCautionModal({
          isOpen: true,
          onClose: closeModals,
          onConfirm: handleCautionConfirm,
          data: {
            title: "Are you absolutely sure?",
            message:
              "This action cannot be undone. All your data will be removed.",
            confirmText: "Yes, delete my account",
            isDangerous: true,
            actionType: "deleted",
            warnings: ["Giveaway history", "Profile data", "Subscriptions"],
          },
        }),
    },
  ];

  return (
    <>
      <section className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">05</span> / Account
          </p>
          <User size={16} className="text-mute" strokeWidth={1.75} />
        </div>

        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] mb-2">
          Account actions
        </h2>
        <p className="text-sm text-mute mb-8">
          Permanently delete your account and all associated data.
        </p>

        <div className="flex flex-col">
          {actions.map((action, i) => (
            <div
              key={action.title}
              className={`flex items-center justify-between gap-4 py-5 ${
                i !== actions.length - 1
                  ? "border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]"
                  : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-display text-base sm:text-lg font-medium">
                  {action.title}
                </p>
                <p className="text-xs sm:text-sm text-mute mt-1">
                  {action.description}
                </p>
              </div>
              <button
                onClick={action.onClick}
                className={`h-10 px-4 inline-flex items-center gap-2 border-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer ${
                  action.destructive
                    ? "border-[var(--color-punch)] text-[var(--color-punch)] hover:bg-[var(--color-punch)] hover:text-paper"
                    : "border-ink dark:border-paper hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink"
                }`}
              >
                <action.Icon size={14} />
                {action.title}
              </button>
            </div>
          ))}
        </div>
      </section>

      <CautionModal
        isOpen={cautionModal.isOpen}
        onClose={handleCloseCaution}
        onConfirm={() => {
          handleCloseCaution();
          cautionModal.onConfirm();
        }}
        data={cautionModal.data}
      />
      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={closeModals}
        onVerify={handleVerifyOTP}
        isVerifying={isVerifying}
      />
    </>
  );
}

export default AccountActionsSection;
