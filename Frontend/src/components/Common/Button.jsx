const SIZE = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const VARIANT = {
  primary:
    "bg-ink text-paper border-2 border-ink hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] dark:bg-paper dark:text-ink dark:border-paper dark:hover:bg-[var(--color-punch)] dark:hover:text-paper dark:hover:border-[var(--color-punch)]",
  secondary:
    "bg-paper text-ink border-2 border-ink hover:bg-ink hover:text-paper dark:bg-ink dark:text-paper dark:border-paper dark:hover:bg-paper dark:hover:text-ink",
  ghost:
    "bg-transparent text-ink dark:text-paper border-0 px-0 underline-offset-4 hover:underline hover:text-[var(--color-punch)] dark:hover:text-[var(--color-punch)]",
  punch:
    "bg-[var(--color-punch)] text-paper border-2 border-[var(--color-punch)] hover:bg-ink hover:border-ink dark:hover:bg-paper dark:hover:text-ink dark:hover:border-paper",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-none uppercase font-mono transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${SIZE[size]} ${VARIANT[variant]} ${className}`;

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
