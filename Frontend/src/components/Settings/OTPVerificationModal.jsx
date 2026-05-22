import { useState, useRef } from "react";

export default function OTPVerificationModal({
  isOpen,
  onClose,
  onVerify,
  isVerifying,
}) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== "" && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/80 p-4">
      <div className="w-full max-w-sm border-2 border-ink dark:border-paper bg-paper dark:bg-ink text-ink dark:text-paper p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-4">
          <span className="text-[var(--color-punch)]">●</span> Verify deletion
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] mb-2">
          Enter your code
        </h2>
        <p className="text-sm text-mute mb-8">
          We sent a 6-digit code to your email.
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-display font-semibold border-2 border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] bg-transparent text-ink dark:text-paper focus:border-[var(--color-punch)] focus:outline-none transition-colors"
            />
          ))}
        </div>

        <button
          onClick={() => onVerify(otp.join(""))}
          disabled={otp.join("").length < 6 || isVerifying}
          className="w-full h-11 border-2 border-[var(--color-punch)] bg-[var(--color-punch)] text-paper font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-ink hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isVerifying ? "Verifying..." : "Confirm & delete"}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-3 text-mute hover:text-ink dark:hover:text-paper font-mono text-[10px] uppercase tracking-[0.18em] cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
