import { Form, Loader, InfoModal, Logo } from "../../components/Common";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSignInMutation } from "../../Redux/slices/apiSlice";
import { setAuth } from "../../Redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    {
      label: "Password",
      type: "password",
      icon: <Lock size={14} />,
      placeholder: "Enter your password",
      register: register("password", {
        required: "Password is required",
        minLength: { value: 8, message: "Password must be at least 8 characters" },
        maxLength: { value: 50, message: "Password too long" },
      }),
    },
  ];

  const [signIn, { data, isLoading, isSuccess, isError, error, reset }] =
    useSignInMutation();

  const handleSignIn = (formValues) => signIn(formValues);

  const unverifiedEmail = error?.data?.email || "";
  const resendAttempts = Number(
    localStorage.getItem(`resendAttempts_${unverifiedEmail}`) || 0
  );

  useEffect(() => {
    if (isSuccess && data) {
      localStorage.setItem("isSignIn", "true");
      dispatch(
        setAuth({
          isAuthenticated: true,
          user: data.user || null,
          isCheckingAuth: false,
        })
      );
    }
  }, [isSuccess, data, dispatch]);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper flex flex-col">
      <div className="px-6 sm:px-10 py-6 border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] flex items-center justify-between">
        <Logo />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          Sign in
        </p>
      </div>

      {isLoading && <Loader />}

      {isSuccess && (
        <InfoModal
          isOpen={true}
          type="success"
          title="Signed in"
          message="Welcome back."
          isContainsResendBtn={false}
          okText="Continue"
          redirectUrl={"/home"}
          onOk={() => {
            reset();
            navigate("/home");
          }}
        />
      )}

      {isError && (
        <InfoModal
          isOpen={true}
          type="error"
          title={resendAttempts >= 3 ? "Limit reached" : "Sign in failed"}
          isContainsResendBtn={error?.data?.status === "UNVERIFIED"}
          message={
            resendAttempts >= 3
              ? "Maximum attempts reached. Try again tomorrow."
              : error?.data?.message || "Something went wrong."
          }
          okText={error?.data?.status === "UNVERIFIED" ? "Open Gmail" : "Try again"}
          redirectUrl={
            error?.data?.status === "UNVERIFIED"
              ? "https://mail.google.com/"
              : null
          }
          onOk={() => {
            if (error?.data?.status === "UNVERIFIED" && error?.data?.token) {
              localStorage.setItem("SignUpToken", error?.data?.token);
            }
            reset();
          }}
          userEmail={error?.data?.email || ""}
        />
      )}

      <main className="flex-1 grid lg:grid-cols-12 px-6 sm:px-10 py-12">
        <div className="lg:col-span-3 mb-8 lg:mb-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">01</span> / Welcome back
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-4">
          <h1
            className="font-display font-semibold tracking-[-0.04em] leading-[0.95] mb-3"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
          >
            Sign in
            <span className="text-[var(--color-punch)]">.</span>
          </h1>
          <p className="text-sm sm:text-base text-mute mb-10">
            Pick up where you left off.
          </p>

          <Form
            formData={formData}
            errors={errors}
            submitBtnText="Sign in"
            isContainsGoogleSignIn={true}
            isSignInPage={true}
            isAuthenticationForm={true}
            onSubmit={handleSubmit(handleSignIn)}
          />
        </div>
      </main>
    </div>
  );
}

export default SignIn;
