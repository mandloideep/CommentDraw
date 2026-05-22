function Input({
  placeholder = "",
  className = "",
  type = "text",
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full bg-transparent border-0 border-b-2 border-ink/30 dark:border-paper/30 px-0 py-3 text-base text-ink dark:text-paper placeholder:text-mute focus:border-[var(--color-punch)] focus:outline-none transition-colors duration-200 ${className}`}
      {...props}
    />
  );
}

export default Input;
