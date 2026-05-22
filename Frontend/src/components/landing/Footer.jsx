import { Link } from "react-router-dom";
import { Twitter, Linkedin, Mail } from "lucide-react";
import { Logo } from "../Common";
import SocialIcon from "./SocialIcon";

function Footer() {
  return (
    <footer className="w-full bg-paper dark:bg-ink">
      <div className="px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Logo size={24} />
            <p className="text-sm text-mute max-w-sm leading-relaxed">
              Fair YouTube comment draws. Built quietly, used loudly.
            </p>
            <div className="flex gap-3 mt-2">
              <SocialIcon
                icon={Twitter}
                label="Twitter / X"
                onClick={() => window.open("https://x.com/Prabhatsingh415", "_blank")}
              />
              <SocialIcon
                icon={Linkedin}
                label="LinkedIn"
                onClick={() =>
                  window.open("https://www.linkedin.com/in/thedeepmandloi/", "_blank")
                }
              />
              <SocialIcon
                icon={Mail}
                label="Email"
                onClick={() => (window.location.href = "mailto:support@commentdraw.com")}
              />
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              Product
            </p>
            <Link to="/signup" className="text-sm hover:text-[var(--color-punch)] transition-colors">
              Get started
            </Link>
            <Link to="/upgrade-plan" className="text-sm hover:text-[var(--color-punch)] transition-colors">
              Pricing
            </Link>
            <Link to="/support" className="text-sm hover:text-[var(--color-punch)] transition-colors">
              Support
            </Link>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              Legal
            </p>
            <Link to="/privacy-policy" className="text-sm hover:text-[var(--color-punch)] transition-colors">
              Privacy policy
            </Link>
            <Link to="/terms-of-service" className="text-sm hover:text-[var(--color-punch)] transition-colors">
              Terms of service
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            © 2025 CommentDraw. All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Built by Deep Mandloi
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
