import { useState, useRef } from "react";
import { Input, InfoModal } from "./";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Form({
  formData = [],
  headingData = {},
  subHeadingData = {},
  onSubmit,
  errors = {},
  className = "",
  btnClassName = "",
  submitBtnText = "Submit",
  showCheckMark = false,
  isContainsGoogleSignIn = false,
  isSignInPage = false,
  isAuthenticationForm = false,
}) {
  const navigate = useNavigate();
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const formRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (showCheckMark && !isChecked) {
      setModalOpen(true);
      return;
    }
    if (onSubmit) onSubmit(e);
  };

  const togglePassword = (id) =>
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAuthWithGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope = "openid email profile";
    const responseType = "code";
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  };

  return (
    <form
      ref={formRef}
      className={`w-full ${className}`}
      onSubmit={handleFormSubmit}
      noValidate
    >
      {(headingData.heading || subHeadingData.subHeading) && (
        <div className="flex flex-col gap-2 mb-8">
          {headingData.heading && (
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-ink dark:text-paper">
              {headingData.heading}
            </h1>
          )}
          {subHeadingData.subHeading && (
            <p className="text-sm text-mute leading-relaxed">
              {subHeadingData.subHeading}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-5">
        {formData.map((input, index) => {
          const isPassword = input.type === "password";
          const inputId = input.id || `input-${index}`;
          const hasError = !!errors[input.register?.name];

          return (
            <div key={inputId} className="flex flex-col">
              {input.label && (
                <label
                  htmlFor={inputId}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute mb-1"
                >
                  {input.label}
                </label>
              )}

              <div className="relative w-full">
                {input.icon && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-mute">
                    {input.icon}
                  </div>
                )}

                <Input
                  id={inputId}
                  type={
                    isPassword
                      ? visiblePasswords[inputId]
                        ? "text"
                        : "password"
                      : input.type
                  }
                  placeholder={input.placeholder}
                  {...(input.register || {})}
                  className={`${input.icon ? "pl-7" : ""} ${
                    isPassword ? "pr-8" : ""
                  } ${hasError ? "border-[var(--color-punch)]" : ""}`}
                />

                {isPassword && (
                  <button
                    type="button"
                    onClick={() => togglePassword(inputId)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-mute hover:text-ink dark:hover:text-paper"
                    aria-label={
                      visiblePasswords[inputId] ? "Hide password" : "Show password"
                    }
                  >
                    {visiblePasswords[inputId] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                )}
              </div>

              {hasError && (
                <span className="text-xs text-[var(--color-punch)] mt-1 font-mono">
                  {errors[input.register?.name]?.message}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {isSignInPage && (
        <div className="mt-3 text-right">
          <button
            type="button"
            onClick={() => navigate("/signIn/forgot-password")}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute hover:text-[var(--color-punch)] underline-offset-4 hover:underline"
          >
            Forgot password?
          </button>
        </div>
      )}

      {showCheckMark && (
        <div className="flex items-start gap-3 mt-6 text-sm">
          <input
            id="terms"
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[var(--color-punch)] cursor-pointer"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="terms" className="text-mute leading-snug">
            I agree to the{" "}
            <button
              type="button"
              onClick={() => navigate("/terms-of-service")}
              className="text-ink dark:text-paper underline underline-offset-4 hover:text-[var(--color-punch)]"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => navigate("/privacy-policy")}
              className="text-ink dark:text-paper underline underline-offset-4 hover:text-[var(--color-punch)]"
            >
              Privacy Policy
            </button>
          </label>
        </div>
      )}

      <button
        type="submit"
        className={`w-full mt-8 h-12 font-mono text-xs uppercase tracking-[0.14em] border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper transition-colors cursor-pointer ${btnClassName}`}
      >
        {submitBtnText}
      </button>

      {isContainsGoogleSignIn && (
        <>
          <div className="flex items-center justify-center gap-4 w-full mt-8">
            <span className="flex-grow border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
              or
            </span>
            <span className="flex-grow border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]" />
          </div>

          <button
            type="button"
            onClick={handleAuthWithGoogle}
            className="w-full mt-5 h-12 flex items-center justify-center gap-3 border-2 border-ink dark:border-paper bg-transparent text-ink dark:text-paper font-mono text-xs uppercase tracking-[0.14em] hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </>
      )}

      {isAuthenticationForm && (
        <p className="w-full text-center mt-8 text-sm text-mute">
          {isSignInPage ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => navigate(isSignInPage ? "/signup" : "/signin")}
            className="text-ink dark:text-paper underline underline-offset-4 hover:text-[var(--color-punch)] font-medium"
          >
            {isSignInPage ? "Sign up" : "Sign in"}
          </button>
        </p>
      )}

      <InfoModal
        isOpen={modalOpen}
        type="info"
        title="Action required"
        message="Please agree to the Terms and Privacy Policy before continuing."
        okText="Got it"
        isContainsResendBtn={false}
        onOk={() => setModalOpen(false)}
      />
    </form>
  );
}
