import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Check, AlertTriangle } from "lucide-react";
import {
  useVerifyUserQuery,
  useLazyResendVerificationQuery,
} from "../../Redux/slices/apiSlice";
import { setCredentials } from "../../Redux/slices/credentialSlice";
import { setAuth } from "../../Redux/slices/authSlice";
import { Loader, Logo } from "../../components/Common";

function VerifyUserPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading, isError, error, isSuccess } =
    useVerifyUserQuery(token);

  const [triggerResend, { isLoading: isResending, isSuccess: resendSuccess }] =
    useLazyResendVerificationQuery();

  useEffect(() => {
    if (isSuccess && data?.accessToken) {
      dispatch(setCredentials({ token: data.accessToken }));
      dispatch(
        setAuth({
          isAuthenticated: true,
          user: data.user || { email: data.email },
          isCheckingAuth: false,
        })
      );
      const timer = setTimeout(() => handleContinue(), 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, data, dispatch]);

  const handleResend = async () => triggerResend(token);

  const handleContinue = () => {
    const userEmail = data?.email;
    const redirectEndpoint = localStorage.getItem("redirectEndpoint") || "/home";
    if (userEmail) {
      localStorage.removeItem(`resendAttempts_${userEmail}`);
      localStorage.removeItem(`resendTimestamp_${userEmail}`);
    }
    localStorage.removeItem("SignUpToken");
    localStorage.removeItem("redirectEndpoint");
    navigate(redirectEndpoint);
  };

  if (isLoading) return <Loader />;

  let errorMessage = "Something went wrong. Please try again later.";
  if (error?.data?.error === "Token must not be empty") {
    errorMessage = "Verification link is missing or invalid.";
  } else if (error?.data?.Error === "Invalid Old Token , Try Sign up again !") {
    errorMessage = "Your verification link has expired. Please sign up again.";
  } else if (error?.status === "FETCH_ERROR") {
    errorMessage = "Network error. Check your internet connection.";
  } else if (error?.data?.message) {
    errorMessage = error.data.message;
  }

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper flex flex-col">
      <div className="px-6 sm:px-10 py-6 border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] flex items-center justify-between">
        <Logo />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          Verify email
        </p>
      </div>

      <main className="flex-1 grid place-items-center px-6 sm:px-10 py-16">
        <div className="w-full max-w-lg text-center">
          {isSuccess ? (
            <>
              <div className="w-16 h-16 mx-auto mb-8 grid place-items-center border-2 border-[var(--color-punch)] text-[var(--color-punch)]">
                <Check size={28} strokeWidth={2.5} />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-4">
                <span className="text-[var(--color-punch)]">▮</span> Verified
              </p>
              <h2
                className="font-display font-semibold tracking-[-0.04em] leading-[0.95] mb-3"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
              >
                {data?.message || "Email verified"}
                <span className="text-[var(--color-punch)]">.</span>
              </h2>
              <p className="text-mute mb-10">
                Redirecting you to CommentDraw...
              </p>
              <button
                onClick={handleContinue}
                className="h-12 px-7 inline-flex items-center gap-2 border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink font-mono text-xs uppercase tracking-[0.18em] hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper transition-colors cursor-pointer"
              >
                Continue now →
              </button>
            </>
          ) : isError ? (
            <>
              <div className="w-16 h-16 mx-auto mb-8 grid place-items-center border-2 border-[var(--color-punch)] text-[var(--color-punch)]">
                <AlertTriangle size={28} strokeWidth={2} />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-punch)] mb-4">
                Verification failed
              </p>
              <h2
                className="font-display font-semibold tracking-[-0.04em] leading-[0.95] mb-3"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
              >
                Something went wrong
                <span className="text-[var(--color-punch)]">.</span>
              </h2>
              <p className="text-mute mb-10">{errorMessage}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="h-12 px-6 inline-flex items-center justify-center gap-2 border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink font-mono text-xs uppercase tracking-[0.18em] hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isResending
                    ? "Resending..."
                    : resendSuccess
                    ? "Email sent ✓"
                    : "Resend verification"}
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="h-12 px-6 inline-flex items-center justify-center gap-2 border-2 border-ink dark:border-paper bg-transparent font-mono text-xs uppercase tracking-[0.18em] hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors cursor-pointer"
                >
                  Back to sign up
                </button>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default VerifyUserPage;
