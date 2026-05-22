import { Link } from "react-router-dom";
import { Asterisk } from "lucide-react";

function Logo({ size = 22, to = "/", className = "", showWordmark = true }) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Asterisk
        size={size}
        strokeWidth={2.75}
        className="text-[var(--color-punch)] shrink-0"
      />
      {showWordmark && (
        <span className="font-display font-semibold tracking-[-0.02em] text-[1.05rem] sm:text-[1.15rem] text-ink dark:text-paper">
          CommentDraw
        </span>
      )}
    </span>
  );

  if (to) {
    return (
      <Link to={to} aria-label="CommentDraw home">
        {inner}
      </Link>
    );
  }
  return inner;
}

export default Logo;
