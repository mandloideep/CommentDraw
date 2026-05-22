import { useSearchParams } from "react-router-dom";
import { useSavePasswordMutation } from "../../Redux/slices/apiSlice";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import { Form, Loader, Logo } from "../../components/Common";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const formData = [
    {
      label: "New password",
      type: "password",
      icon: <Lock size={14} />,
      placeholder: "Create a new password",
      register: register("password", {
        required: "Password is required",
        minLength: { value: 8, message: "Min 8 characters" },
        maxLength: { value: 50, message: "Max 50 characters" },
        pattern: {
          value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
          message: "Must contain letters and numbers",
        },
      }),
    },
    {
      label: "Confirm password",
      type: "password",
      icon: <Lock size={14} />,
      placeholder: "Repeat the password",
      register: register("confirmPassword", {
        required: "Please confirm your password",
        validate: (value) =>
          value === getValues("password") || "Passwords do not match",
      }),
    },
  ];

  const [savePassword, { isLoading }] = useSavePasswordMutation();

  const handleForgotPassword = (data) =>
    savePassword({ password: data.password, token });

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper flex flex-col">
      <div className="px-6 sm:px-10 py-6 border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] flex items-center justify-between">
        <Logo />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          Reset password
        </p>
      </div>

      {isLoading && <Loader />}

      <main className="flex-1 grid lg:grid-cols-12 px-6 sm:px-10 py-12">
        <div className="lg:col-span-3 mb-8 lg:mb-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">02</span> / Choose new password
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-4">
          <h1
            className="font-display font-semibold tracking-[-0.04em] leading-[0.95] mb-3"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
          >
            Set a new password
            <span className="text-[var(--color-punch)]">.</span>
          </h1>
          <p className="text-sm sm:text-base text-mute mb-10">
            Pick something memorable and strong.
          </p>

          <Form
            formData={formData}
            errors={errors}
            submitBtnText="Change password"
            isContainsGoogleSignIn={false}
            isAuthenticationForm={false}
            onSubmit={handleSubmit(handleForgotPassword)}
          />
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
