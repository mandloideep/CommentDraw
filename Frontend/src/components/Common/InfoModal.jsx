import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import useTimeout from "../../hook/useTimeout";
import { useLazyResendVerificationQuery } from "../../Redux/slices/apiSlice";
import Loader from "./Loader";

const TYPE_ICON = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const TYPE_ACCENT = {
  success: "text-[#1e8a4a]",
  error: "text-[var(--color-punch)]",
  info: "text-[var(--color-punch-2)]",
};

export default function InfoModal({
  isOpen,
  title = "Information",
  message = "",
  type = "info",
  okText = "OK",
  cancelText = null,
  onOk,
  onCancel,
  redirectUrl = null,
  isContainsResendBtn = false,
  userEmail = "",
}) {
  if (!isOpen) return null;

  const MAX_ATTEMPTS = 3;
  const COOL_DOWN_15M = 15 * 60;
  const RESET_TIME_24H = 24 * 60 * 60 * 1000;

  const ATTEMPTS_KEY = `resendAttempts_${userEmail}`;
  const TIMESTAMP_KEY = `resendTimestamp_${userEmail}`;

  const [resendAttempts, setResendAttempts] = useState(
    Number(localStorage.getItem(ATTEMPTS_KEY) || 0)
  );

  const { secondsLeft, setSecondsLeft } = useTimeout(COOL_DOWN_15M);
  const [disableBtn, setDisableBtn] = useState(true);

  const [modalMsg, setModalMsg] = useState(message);
  const [modalType, setModalType] = useState(type);
  const [modalTitle, setModalTitle] = useState(title);

  const [resendVerification, { data, isError, isLoading, isSuccess, error }] =
    useLazyResendVerificationQuery();

  useEffect(() => {
    const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();
    if (storedTimestamp && now - Number(storedTimestamp) >= RESET_TIME_24H) {
      localStorage.setItem(ATTEMPTS_KEY, "0");
      localStorage.removeItem(TIMESTAMP_KEY);
      setResendAttempts(0);
    }
  }, [ATTEMPTS_KEY, TIMESTAMP_KEY]);

  useEffect(() => {
    if (isContainsResendBtn) setSecondsLeft(COOL_DOWN_15M);
  }, [isContainsResendBtn]);

  useEffect(() => {
    if (secondsLeft === 0) setDisableBtn(false);
  }, [secondsLeft]);

  useEffect(() => {
    if (isLoading) {
      setModalTitle("Please wait");
      setModalMsg("Resending verification email...");
      setModalType("info");
    }
    if (isSuccess) {
      setModalTitle("Sent");
      setModalMsg("Verification email sent successfully.");
      setModalType("success");
      if (data?.token) localStorage.setItem("SignUpToken", data.token);
    }
    if (isError) {
      if (error?.status === 429) {
        setModalTitle("Limit reached");
        setModalMsg("You hit the daily limit for resending. Try again tomorrow.");
        setModalType("error");
        setResendAttempts(MAX_ATTEMPTS);
        localStorage.setItem(ATTEMPTS_KEY, MAX_ATTEMPTS.toString());
        setDisableBtn(true);
        return;
      }
      setModalTitle("Error");
      setModalMsg(error?.data?.Error || "Failed to resend. Try again later.");
      setModalType("error");
    }
  }, [isLoading, isSuccess, isError]);

  const handleResend = () => {
    if (resendAttempts >= MAX_ATTEMPTS) {
      setModalTitle("Limit reached");
      setModalMsg("Maximum resends reached. Sign up again to start fresh.");
      setModalType("error");
      return;
    }
    const token = localStorage.getItem("SignUpToken");
    resendVerification(token);
    const updated = resendAttempts + 1;
    setResendAttempts(updated);
    localStorage.setItem(ATTEMPTS_KEY, updated.toString());
    if (updated === 1) localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    setDisableBtn(true);
    setSecondsLeft(COOL_DOWN_15M);
  };

  const handleOk = () => {
    if (redirectUrl) window.location.href = redirectUrl;
    else if (onOk) onOk();
  };
  const handleCancel = () => onCancel && onCancel();

  const Icon = TYPE_ICON[modalType] || Info;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/70 px-4">
      <div className="relative w-full max-w-md bg-paper dark:bg-ink text-ink dark:text-paper border-2 border-ink dark:border-paper rounded-none">
        <div className="flex items-start justify-between border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 py-4">
          <div className="flex items-center gap-3">
            <Icon size={18} className={TYPE_ACCENT[modalType]} strokeWidth={2.25} />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-mute">
              {modalType}
            </span>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              aria-label="Close"
              className="text-mute hover:text-ink dark:hover:text-paper"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-6 py-8">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] mb-3">
            {modalTitle}
          </h2>
          {isLoading ? (
            <div className="py-4">
              <Loader />
            </div>
          ) : (
            <p className="text-sm text-mute leading-relaxed">{modalMsg}</p>
          )}
        </div>

        <div className="px-6 pb-6 flex flex-col gap-3">
          <div className="flex gap-3 justify-end">
            {cancelText && (
              <button
                onClick={handleCancel}
                className="h-10 px-5 font-mono text-xs uppercase tracking-tight border-2 border-ink dark:border-paper bg-paper text-ink dark:bg-ink dark:text-paper hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors cursor-pointer"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleOk}
              className="h-10 px-5 font-mono text-xs uppercase tracking-tight border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper transition-colors cursor-pointer"
            >
              {okText}
            </button>
          </div>

          {isContainsResendBtn && (
            <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-3 mt-1">
              {resendAttempts < MAX_ATTEMPTS ? (
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={handleResend}
                    disabled={disableBtn}
                    className={`font-mono text-xs uppercase tracking-[0.14em] underline-offset-4 ${
                      disableBtn
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:underline hover:text-[var(--color-punch)] cursor-pointer"
                    }`}
                  >
                    Resend verification
                  </button>
                  {disableBtn && (
                    <span className="font-mono text-xs text-mute">
                      {Math.floor(secondsLeft / 60)}m
                      {String(secondsLeft % 60).padStart(2, "0")}s
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs font-mono uppercase tracking-tight text-[var(--color-punch)]">
                  Daily resend limit reached
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
