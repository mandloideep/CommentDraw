import { useState, useEffect } from "react";
import {
  Trophy,
  Link2,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  Gamepad2,
  ShoppingBag,
  Gift,
  ArrowUpRight,
} from "lucide-react";
import {
  useGetSubscriptionQuery,
  useGetWinnersMutation,
} from "../../Redux/slices/apiSlice";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { InfoModal } from "../../components/Common";
import { useOutletContext } from "react-router-dom";

const REWARD_PLATFORMS = [
  { name: "Codashop", url: "https://www.codashop.com", Icon: Gamepad2 },
  { name: "Amazon Gift", url: "https://www.amazon.com/gc", Icon: ShoppingBag },
  { name: "Razer Gold", url: "https://gold.razer.com", Icon: Gift },
];

function Home() {
  const [urls, setUrls] = useState([""]);
  const [winnersCount, setWinnersCount] = useState(1);
  const [keyword, setKeyword] = useState("");
  const { setNavigationLocked } = useOutletContext();

  const [gameState, setGameState] = useState("input");
  const [countdown, setCountdown] = useState(3);
  const [finalWinners, setFinalWinners] = useState([]);

  const [getWinners, { isLoading }] = useGetWinnersMutation();

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const { data: subscriptionData, error: subError } = useGetSubscriptionQuery();

  useEffect(() => {
    if (subError) {
      setModal({
        open: true,
        type: "error",
        title: "Error",
        message: subError?.data?.message || "Something went wrong.",
      });
    }
  }, [subError]);

  const getWinnerOptions = () => {
    const max = subscriptionData?.maxWinners;
    if (!max) return [1, 2];
    if (max <= 5) return Array.from({ length: max }, (_, i) => i + 1);
    return [1, 2, 3, 5, 7, 10, 15, 20];
  };

  const addInput = () => urls.length < 3 && setUrls([...urls, ""]);
  const removeInput = (index) => {
    if (urls.length > 1) setUrls(urls.filter((_, i) => i !== index));
  };
  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handlePickWinner = async () => {
    try {
      setNavigationLocked(true);
      setGameState("fetching");
      const response = await getWinners({
        videoLinks: urls.filter((url) => url.trim() !== ""),
        keyword: keyword.trim(),
        numberOfWinners: parseInt(winnersCount),
      }).unwrap();

      if (response?.winners?.length > 0) {
        setFinalWinners(response.winners);
        setCountdown(3);
        setGameState("countdown");
      } else {
        throw new Error("No eligible comments found.");
      }
    } catch (err) {
      setNavigationLocked(false);
      setGameState("input");
      setModal({
        open: true,
        type: "error",
        title: "Could not pick winners",
        message:
          err?.data?.message ||
          "Could not fetch comments. Check URL or privacy settings.",
      });
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === "countdown") {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setNavigationLocked(false);
            setGameState("result");
            triggerConfetti();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const triggerConfetti = () => {
    const duration = 2500;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 28,
      spread: 360,
      ticks: 60,
      zIndex: 100,
      colors: ["#0A0A0A", "#FF3D1F", "#0030FF"],
    };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 40 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const resetGiveaway = () => {
    setGameState("input");
    setNavigationLocked(false);
    setCountdown(3);
    setUrls([""]);
    setKeyword("");
    setFinalWinners([]);
  };

  if (gameState === "fetching") {
    return (
      <div className="w-full min-h-[60vh] bg-paper dark:bg-ink text-ink dark:text-paper flex flex-col items-center justify-center gap-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span className="text-[var(--color-punch)]">02</span> / Fetching comments
        </p>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-4 h-4 bg-ink dark:bg-paper"
              style={{
                animation: "cd-pulse-square 1s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        <p className="font-display text-2xl font-semibold tracking-[-0.02em] text-mute">
          Reading every comment, fairly.
        </p>
      </div>
    );
  }

  if (gameState === "countdown") {
    return (
      <div className="w-full min-h-[60vh] bg-paper dark:bg-ink text-ink dark:text-paper flex flex-col items-center justify-center relative overflow-hidden">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-8">
          <span className="text-[var(--color-punch)]">03</span> / Drawing winners
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={countdown}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="font-display leading-none font-semibold tracking-[-0.06em]"
            style={{ fontSize: "clamp(8rem, 28vw, 22rem)" }}
          >
            {countdown}
            <span className="text-[var(--color-punch)]">.</span>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (gameState === "result" && finalWinners.length > 0) {
    return (
      <div className="w-full bg-paper dark:bg-ink text-ink dark:text-paper">
        <div className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 sm:px-10 py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-4">
              <span className="text-[var(--color-punch)]">▮</span> Winners 🎉
            </p>
            <h1
              className="font-display font-semibold tracking-[-0.04em] leading-[0.95]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              The draw is in
              <span className="text-[var(--color-punch)]">.</span>
            </h1>
          </div>
          <button
            onClick={resetGiveaway}
            className="h-11 px-5 inline-flex items-center gap-2 border-2 border-ink dark:border-paper bg-transparent font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            New giveaway
          </button>
        </div>

        <div className="px-6 sm:px-10 py-10 flex flex-col gap-6 max-w-4xl">
          {finalWinners.map((winner, index) => (
            <div
              key={index}
              className="border-2 border-ink dark:border-paper p-6 sm:p-8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-punch)]">
                  Winner · {String(index + 1).padStart(2, "0")}
                </p>
                <Trophy
                  size={20}
                  strokeWidth={1.75}
                  className="text-[var(--color-punch)]"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 grid place-items-center border-2 border-ink dark:border-paper font-display text-2xl font-semibold">
                  {winner.authorName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-display font-semibold tracking-[-0.03em] truncate"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
                  >
                    {winner.authorName}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute mt-1">
                    Verified · {new Date(winner.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-base sm:text-lg leading-relaxed border-l-2 border-[var(--color-punch)] pl-4 italic">
                "{winner.message}"
              </p>

              <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-4">
                  Send reward via
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {REWARD_PLATFORMS.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group h-12 px-4 border-2 border-ink dark:border-paper bg-transparent inline-flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors"
                    >
                      <span className="inline-flex items-center gap-2">
                        <platform.Icon size={14} strokeWidth={1.75} />
                        {platform.name}
                      </span>
                      <ExternalLink size={12} className="opacity-60 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-paper dark:bg-ink text-ink dark:text-paper">
      <div className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 sm:px-10 py-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-4">
          <span className="text-[var(--color-punch)]">▮</span> New draw
        </p>
        <h1
          className="font-display font-semibold tracking-[-0.04em] leading-[0.95]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Start a giveaway
          <span className="text-[var(--color-punch)]">.</span>
        </h1>
        <p className="text-sm sm:text-base text-mute mt-3 max-w-xl">
          Paste up to 3 YouTube URLs. We'll pull every comment and draw winners
          fairly.
        </p>
      </div>

      <div className="px-6 sm:px-10 py-10 max-w-3xl flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">01</span> / Video links
          </p>
          {urls.map((url, index) => (
            <div key={index} className="flex items-stretch gap-2">
              <div className="relative flex-1">
                <Link2
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-mute pointer-events-none"
                />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  placeholder={`YouTube URL #${index + 1}`}
                  className="w-full h-12 pl-9 pr-3 bg-transparent border-2 border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] focus:border-ink dark:focus:border-paper outline-none text-sm transition-colors"
                />
              </div>
              {urls.length > 1 && (
                <button
                  onClick={() => removeInput(index)}
                  aria-label="Remove URL"
                  className="h-12 w-12 grid place-items-center border-2 border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] text-[var(--color-punch)] hover:border-[var(--color-punch)] hover:bg-[var(--color-punch)] hover:text-paper transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          {urls.length < 3 && (
            <button
              onClick={addInput}
              className="h-12 inline-flex items-center justify-center gap-2 border-2 border-dashed border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] text-mute hover:text-ink dark:hover:text-paper hover:border-ink dark:hover:border-paper font-mono text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add another URL
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              <span className="text-[var(--color-punch)]">02</span> / Keyword filter
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Optional
            </span>
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. Winner2025"
            className="w-full h-12 px-3 bg-transparent border-2 border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] focus:border-ink dark:focus:border-paper outline-none text-sm transition-colors"
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">03</span> / Number of winners
          </p>
          <select
            value={winnersCount}
            onChange={(e) => setWinnersCount(Number(e.target.value))}
            className="w-full h-12 px-3 bg-transparent border-2 border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] focus:border-ink dark:focus:border-paper outline-none text-sm transition-colors cursor-pointer"
          >
            {getWinnerOptions().map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "winner" : "winners"}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={isLoading || !urls[0]}
          onClick={handlePickWinner}
          className="h-14 inline-flex items-center justify-center gap-3 border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink font-mono text-xs uppercase tracking-[0.18em] hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Trophy size={16} strokeWidth={2} />
          {isLoading
            ? "Fetching..."
            : `Pick ${winnersCount} ${winnersCount === 1 ? "winner" : "winners"}`}
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      {modal.open && (
        <InfoModal
          isOpen={modal.open}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          okText="OK"
          onOk={() => setModal({ ...modal, open: false })}
          isContainsResendBtn={false}
        />
      )}
    </div>
  );
}

export default Home;
