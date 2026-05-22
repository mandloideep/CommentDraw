import { Form, Logo } from "../../components/Common";
import { useForm } from "react-hook-form";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../Redux/slices/apiSlice";

function ForgotPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formData = [
    {
      label: "Email",
      type: "email",
      icon: <Mail size={14} />,
      placeholder: "you@domain.com",
      register: register("email", {
        required: "Email is required",
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Invalid email address",
        },
      }),
    },
  ];

  const [forgotPasswordData] = useForgotPasswordMutation();

  const handleForgotPassword = async (data) => {
    try {
      await forgotPasswordData(data).unwrap();
    } catch {
      // surfaced via parent error UI in apiSlice if needed
    }
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper flex flex-col">
      <div className="px-6 sm:px-10 py-6 border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] flex items-center justify-between">
        <Logo />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          Reset password
        </p>
      </div>

      <main className="flex-1 grid lg:grid-cols-12 px-6 sm:px-10 py-12">
        <div className="lg:col-span-3 mb-8 lg:mb-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">01</span> / Forgot password
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-4">
          <h1
            className="font-display font-semibold tracking-[-0.04em] leading-[0.95] mb-3"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
          >
            Reset your password
            <span className="text-[var(--color-punch)]">.</span>
          </h1>
          <p className="text-sm sm:text-base text-mute mb-10">
            We'll email you a secure reset link.
          </p>

          <Form
            formData={formData}
            errors={errors}
            submitBtnText="Send reset link"
            isContainsGoogleSignIn={false}
            isAuthenticationForm={false}
            onSubmit={handleSubmit(handleForgotPassword)}
          />

          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute hover:text-[var(--color-punch)] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </button>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
