// eslint-disable-next-line no-unused-vars
function SocialIcon({ icon: Icon, onClick, label, size = 18 }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="h-10 w-10 grid place-items-center border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] text-mute hover:text-paper hover:bg-ink dark:hover:text-ink dark:hover:bg-paper transition-colors cursor-pointer"
    >
      <Icon size={size} strokeWidth={1.75} />
    </button>
  );
}

export default SocialIcon;
