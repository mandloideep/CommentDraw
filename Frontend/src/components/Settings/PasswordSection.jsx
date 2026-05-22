import { Lock, Check, X } from "lucide-react";
import { usePasswordLogic } from "./hooks/usePasswordLogic";

function PwInput({ placeholder, value, onChange }) {
  return (
    <input
      type="password"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-0 border-b-2 border-ink/30 dark:border-paper/30 px-0 py-3 text-base text-ink dark:text-paper placeholder:text-mute focus:border-[var(--color-punch)] focus:outline-none transition-colors"
    />
  );
}

function Rule({ pass, children }) {
  return (
    <li className="flex items-center gap-2 text-xs font-mono">
      {pass ? (
        <Check size={12} className="text-[var(--color-punch-2)]" strokeWidth={2.5} />
      ) : (
        <X size={12} className="text-mute" strokeWidth={2} />
      )}
      <span className={pass ? "text-ink dark:text-paper" : "text-mute"}>
        {children}
      </span>
    </li>
  );
}

function PasswordSection({ setModal }) {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleChangePassword,
  } = usePasswordLogic(setModal);

  const rules = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    digit: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };
  const allPass = Object.values(rules).every(Boolean);
  const disabled =
    !currentPassword ||
    !newPassword ||
    !confirmPassword ||
    newPassword !== confirmPassword ||
    !allPass;

  return (
    <section className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span className="text-[var(--color-punch)]">02</span> / Password
        </p>
        <Lock size={16} className="text-mute" strokeWidth={1.75} />
      </div>

      <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] mb-2">
        Change password
      </h2>
      <p className="text-sm text-mute mb-8">Update your account password.</p>

      <div className="space-y-6 max-w-xl">
        <PwInput
          placeholder="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <PwInput
          placeholder="New password"
          value={newPassword}
          onChange={setNewPassword}
        />

        {newPassword && (
          <ul className="space-y-2 border-l border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pl-4">
            <Rule pass={rules.length}>At least 8 characters</Rule>
            <Rule pass={rules.upper}>One uppercase letter</Rule>
            <Rule pass={rules.lower}>One lowercase letter</Rule>
            <Rule pass={rules.digit}>One number</Rule>
            <Rule pass={rules.special}>One special character</Rule>
          </ul>
        )}

        <PwInput
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="text-xs text-[var(--color-punch)] font-mono">
            Passwords do not match
          </p>
        )}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleChangePassword}
          disabled={disabled}
          className="h-10 px-5 border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Update password
        </button>
      </div>
    </section>
  );
}

export default PasswordSection;
