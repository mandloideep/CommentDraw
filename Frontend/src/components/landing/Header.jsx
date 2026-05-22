import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as ScrollLink } from "react-scroll";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleTheme } from "../../Redux/slices/themeSlice";
import { Logo } from "../Common";

const NAV = [
  { to: "features", label: "Features", offset: -70 },
  { to: "working", label: "How it works", offset: -70 },
  { to: "pricing", label: "Pricing", offset: 60 },
  { to: "faq", label: "FAQ", offset: 55 },
];

function Header() {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-paper/90 dark:bg-ink/90 backdrop-blur-sm border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 h-16">
        <Logo />

        <nav className="hidden lg:flex items-center gap-10 font-mono text-[11px] uppercase tracking-[0.18em]">
          {NAV.map((item, i) => (
            <ScrollLink
              key={item.to}
              to={item.to}
              smooth={true}
              duration={500}
              offset={item.offset}
              className="cursor-pointer text-mute hover:text-ink dark:hover:text-paper transition-colors"
            >
              <span className="text-[var(--color-punch)] mr-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.label}
            </ScrollLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            className="h-9 w-9 grid place-items-center text-mute hover:text-[var(--color-punch)] transition-colors cursor-pointer"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={() => navigate("/signin")}
            className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink dark:hover:text-paper transition-colors cursor-pointer px-2"
          >
            Sign in
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="h-9 sm:h-10 px-4 sm:px-5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper transition-colors cursor-pointer"
          >
            Get started →
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden h-9 w-9 grid place-items-center text-ink dark:text-paper cursor-pointer"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-5 sm:px-8 py-4 flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.18em]">
          {NAV.map((item, i) => (
            <ScrollLink
              key={item.to}
              to={item.to}
              smooth={true}
              duration={500}
              offset={item.offset}
              onClick={() => setOpen(false)}
              className="cursor-pointer text-mute hover:text-ink dark:hover:text-paper"
            >
              <span className="text-[var(--color-punch)] mr-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.label}
            </ScrollLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;
