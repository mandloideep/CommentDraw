import {
  Menu,
  House,
  ChartColumn,
  Settings,
  History,
  X,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../Redux/slices/themeSlice";
import { useState } from "react";
import { Logo, InfoModal } from "../Common";
import CautionModal from "../Settings/CautionModal";
import { useLogout } from "./hooks/useLogout";

const menuItems = [
  { label: "Home", to: "/home", Icon: House },
  { label: "Dashboard", to: "/dashboard", Icon: ChartColumn },
  { label: "History", to: "/history", Icon: History },
  { label: "Settings", to: "/settings", Icon: Settings },
];

// eslint-disable-next-line no-unused-vars
function NavItem({ to, Icon, label, index, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 pl-6 pr-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
          isActive
            ? "text-ink dark:text-paper"
            : "text-mute hover:text-ink dark:hover:text-paper"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
              isActive ? "bg-[var(--color-punch)]" : "bg-transparent"
            }`}
          />
          <span className="text-[var(--color-punch)] font-mono text-[10px] w-6 shrink-0">
            {index}
          </span>
          <Icon size={16} strokeWidth={1.75} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function AppHeader({ navigationLocked }) {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [logoutErrorOpen, setLogoutErrorOpen] = useState(false);
  const { logout } = useLogout({ onError: () => setLogoutErrorOpen(true) });

  const openLogoutConfirm = () => {
    setIsMenuOpen(false);
    setConfirmLogoutOpen(true);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-paper dark:bg-ink">
      <div className="px-6 py-6 border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
        <Logo size={22} />
      </div>

      <p className="px-6 pt-6 pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
        Navigation
      </p>

      <nav className="flex flex-col flex-1">
        {menuItems.map((item, i) => (
          <NavItem
            key={item.to}
            to={item.to}
            Icon={item.Icon}
            label={item.label}
            index={String(i + 1).padStart(2, "0")}
            onClick={() => setIsMenuOpen(false)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] flex flex-col gap-2">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-full h-11 flex items-center justify-center gap-2 border-2 border-ink dark:border-paper bg-transparent hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink font-mono text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
        <button
          onClick={openLogoutConfirm}
          className="w-full h-11 flex items-center justify-center gap-2 border-2 border-[var(--color-punch)] text-[var(--color-punch)] bg-transparent hover:bg-[var(--color-punch)] hover:text-paper font-mono text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className="lg:hidden w-full flex items-center justify-between border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-4 py-3 bg-paper dark:bg-ink">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="h-9 w-9 grid place-items-center text-ink dark:text-paper"
          >
            <Menu size={20} />
          </button>
          <Logo size={20} />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            className="h-9 w-9 grid place-items-center text-mute hover:text-[var(--color-punch)]"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={openLogoutConfirm}
            aria-label="Logout"
            className="h-9 w-9 grid place-items-center text-mute hover:text-[var(--color-punch)]"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="relative">
        <aside
          className={`fixed top-0 left-0 z-50 h-screen w-72
            ${navigationLocked ? "pointer-events-none opacity-60" : ""}
            border-r border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] transition-transform duration-300 ease-in-out
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:block shrink-0`}
        >
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} className="text-ink dark:text-paper" />
            </button>
          </div>

          {SidebarContent}
        </aside>

        {navigationLocked && (
          <div className="absolute inset-0 z-[60] cursor-not-allowed" />
        )}
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-ink/60 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <CautionModal
        isOpen={confirmLogoutOpen}
        onClose={() => setConfirmLogoutOpen(false)}
        onConfirm={() => {
          setConfirmLogoutOpen(false);
          logout();
        }}
        data={{
          title: "Confirm logout",
          message: "Sign out from CommentDraw on this device?",
          confirmText: "Logout",
          isDangerous: false,
        }}
      />

      <InfoModal
        isOpen={logoutErrorOpen}
        title="Logout Failed"
        message="Could not log you out. Please try again."
        type="error"
        okText="OK"
        onOk={() => setLogoutErrorOpen(false)}
      />
    </>
  );
}

export default AppHeader;
