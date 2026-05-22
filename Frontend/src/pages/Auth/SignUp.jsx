import { Form, Loader, InfoModal, Logo } from "../../components/Common";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Mail, Lock, User, Check, X } from "lucide-react";
import { useSignUpMutation } from "../../Redux/slices/apiSlice";

function Rule({ pass, children }) {
  return (
    <li className="flex items-center gap-2 font-mono text-[11px]">
      {pass ? (
        <Check size={11} strokeWidth={2.5} className="text-[var(--color-punch-2)]" />
      ) : (
        <X size={11} strokeWidth={2} className="text-mute" />
      )}
      <span className={pass ? "text-ink dark:text-paper" : "text-mute"}>
        {children}
      </span>
    </li>
  );
}

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password", "");

  const formData = [
    {
      label: "First name",
      type: "text",
      icon: <User size={14} />,
      placeholder: "First name",
      register: register("firstName", {
        required: "First name is required",
        minLength: { value: 2, message: "Too short" },
        maxLength: { value: 50, message: "Max 50 characters" },
      }),
    },
    {
      label: "Last name",
      type: "text",
      icon: <User size={14} />,
      placeholder: "Last name",
      register: register("lastName", {
        required: "Last name is required",
        minLength: { value: 2, message: "Too short" },
        maxLength: { value: 50, message: "Max 50 characters" },
      }),
    },
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
        maxLength: { value: 100, message: "Email too long" },
      }),
    },
    {
      label: "Password",
      type: "password",
      icon: <Lock size={14} />,
      placeholder: "Create a password",
      register: register("password", {
        required: "Password is required",
        pattern: {
          value:
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=\S+$).{8,50}$/,
          message: "Does not meet requirements",
        },
      }),
    },
  ];

  const [signUpData, { data, isLoading, isSuccess, isError, error, reset }] =
    useSignUpMutation();

  const handleSignup = (formValues) => signUpData(formValues);

  useEffect(() => {
    if (isSuccess && data?.token) {
      localStorage.setItem("SignUpToken", data.token);
    }
  }, [isSuccess, data]);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper flex flex-col">
      <div className="px-6 sm:px-10 py-6 border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] flex items-center justify-between">
        <Logo />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          Create account
        </p>
      </div>

      {isLoading && <Loader />}

      {isSuccess && (
        <InfoModal
          isOpen={true}
          type="success"
          title="Account created 🎉"
          message="Check your inbox to verify your email."
          okText="Open Gmail"
          redirectUrl="https://mail.google.com/"
          onOk={() => reset()}
          userEmail={data?.email}
          isContainsResendBtn={true}
        />
      )}

      {isError && (
        <InfoModal
          isOpen={true}
          type="error"
          title="Sign up failed"
          isContainsResendBtn={false}
          message={error?.data?.message || "Something went wrong."}
          okText="Try again"
          onOk={() => reset()}
        />
      )}

      <main className="flex-1 grid lg:grid-cols-12 px-6 sm:px-10 py-12">
        <div className="lg:col-span-3 mb-8 lg:mb-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">01</span> / Join
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-4">
          <h1
            className="font-display font-semibold tracking-[-0.04em] leading-[0.95] mb-3"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
          >
            Create account
            <span className="text-[var(--color-punch)]">.</span>
          </h1>
          <p className="text-sm sm:text-base text-mute mb-10">
            Start with a free draw — no card required.
          </p>

          <Form
            formData={formData}
            errors={errors}
            showCheckMark={true}
            submitBtnText="Create account"
            isContainsGoogleSignIn={true}
            isAuthenticationForm={true}
            onSubmit={handleSubmit(handleSignup)}
          />

          {password.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-3">
                Password requirements
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <Rule pass={password.length >= 8}>At least 8 characters</Rule>
                <Rule pass={/[A-Z]/.test(password)}>One uppercase letter</Rule>
                <Rule pass={/[a-z]/.test(password)}>One lowercase letter</Rule>
                <Rule pass={/[0-9]/.test(password)}>One number</Rule>
                <Rule pass={/[^A-Za-z0-9]/.test(password)}>One special character</Rule>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SignUp;
