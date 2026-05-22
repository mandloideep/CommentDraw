import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistoryQuery } from "../../Redux/slices/apiSlice";
import {
  Search,
  Trophy,
  Users,
  MessageSquare,
  Download,
  Calendar,
  Hash,
  ExternalLink,
  X,
  Youtube,
  Tag,
} from "lucide-react";
import { Loader } from "../../components/Common";

// eslint-disable-next-line no-unused-vars
function StatCard({ Icon, label, value }) {
  return (
    <div className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Icon size={18} strokeWidth={1.75} className="text-[var(--color-punch)]" />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          {label}
        </p>
      </div>
      <p className="font-display text-3xl font-semibold tracking-[-0.03em]">
        {value}
      </p>
    </div>
  );
}

function HistoryRow({ item, onView }) {
  return (
    <button
      onClick={onView}
      className="w-full text-left border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] py-5 px-2 flex flex-col sm:flex-row gap-4 hover:bg-ink/[0.02] dark:hover:bg-paper/[0.03] transition-colors cursor-pointer"
    >
      <div className="flex gap-2 shrink-0">
        {item.videoDetails.slice(0, 2).map((video, idx) => (
          <img
            key={idx}
            src={video.thumbnail}
            alt=""
            className="w-20 h-12 sm:w-24 sm:h-14 object-cover border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]"
          />
        ))}
        {item.videoDetails.length > 2 && (
          <div className="w-20 h-12 sm:w-24 sm:h-14 grid place-items-center border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] font-mono text-[10px] uppercase tracking-tight text-mute">
            +{item.videoDetails.length - 2}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-display text-base sm:text-lg font-medium truncate">
          {item.videoDetails[0]?.title || `Giveaway #${item.id}`}
        </p>
        <div className="flex flex-wrap gap-4 mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} />
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare size={11} />
            {item.commentCount} comments
          </span>
          <span className="flex items-center gap-1.5">
            <Hash size={11} />
            ID {item.id}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {item.winners.slice(0, 4).map((handle, idx) => (
            <span
              key={idx}
              className="font-mono text-[10px] uppercase tracking-[0.14em] border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-2 py-0.5"
            >
              {handle}
            </span>
          ))}
          {item.winners.length > 4 && (
            <span className="font-mono text-[10px] text-mute">
              +{item.winners.length - 4}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 self-start sm:self-center">
        <ExternalLink size={16} className="text-mute" />
      </div>
    </button>
  );
}

// eslint-disable-next-line no-unused-vars
function DetailStat({ Icon, label, value }) {
  return (
    <div className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute flex items-center gap-1.5">
        <Icon size={11} />
        {label}
      </p>
      <p className="font-display text-lg font-medium mt-1">{value}</p>
    </div>
  );
}

function DetailModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-ink dark:border-paper bg-paper dark:bg-ink text-ink dark:text-paper">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] bg-paper dark:bg-ink">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            <span className="text-[var(--color-punch)]">▮</span> Giveaway · #{item.id}
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-mute hover:text-ink dark:hover:text-paper"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <DetailStat Icon={Hash} label="ID" value={`#${item.id}`} />
            <DetailStat
              Icon={Calendar}
              label="Date"
              value={new Date(item.createdAt).toLocaleDateString()}
            />
            <DetailStat
              Icon={MessageSquare}
              label="Comments"
              value={item.commentCount}
            />
            <DetailStat Icon={Users} label="Winners" value={item.winnersCount} />
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute flex items-center gap-2">
              <Youtube size={12} /> Videos
            </p>
            {item.videoDetails.map((video, idx) => (
              <div
                key={idx}
                className="flex gap-3 border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-3"
              >
                <img
                  src={video.thumbnail}
                  alt=""
                  className="w-24 h-14 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{video.title}</p>
                  <a
                    href={`https://youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[var(--color-punch)] font-mono uppercase tracking-tight mt-1 inline-flex items-center gap-1"
                  >
                    View on YouTube
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute flex items-center gap-2">
              <Tag size={12} /> Filters
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailStat
                Icon={Tag}
                label="Keyword"
                value={item.keywordUsed || "None"}
              />
              <DetailStat
                Icon={Tag}
                label="Loyalty filter"
                value={item.loyaltyFilterApplied ? "Enabled" : "Disabled"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute flex items-center gap-2">
              <Trophy size={12} /> Winners
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {item.winners.map((handle, idx) => (
                <div
                  key={idx}
                  className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-3 flex items-center gap-3"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-punch)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-base font-medium truncate">
                    {handle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function History() {
  const { accessToken } = useSelector((state) => state.auth);
  const { data, isLoading } = useHistoryQuery(undefined, { skip: !accessToken });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  if (isLoading) return <Loader />;
  const history = Array.isArray(data) ? data : [];

  const filteredHistory = history.filter(
    (item) =>
      item.winners.some((w) =>
        w.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      item.videoDetails.some((v) =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      item.id.toString().includes(searchTerm)
  );

  const totalWinners = filteredHistory.reduce(
    (acc, curr) => acc + curr.winnersCount,
    0
  );
  const totalComments = filteredHistory.reduce(
    (acc, curr) => acc + curr.commentCount,
    0
  );

  const handleExport = () => {
    if (filteredHistory.length === 0) return;
    const headers = ["Date", "ID", "Comments", "Winners", "Keyword", "Loyalty"];
    const csvRows = filteredHistory.map((item) => [
      new Date(item.createdAt).toLocaleDateString(),
      item.id,
      item.commentCount,
      item.winners.join(" | "),
      item.keywordUsed || "N/A",
      item.loyaltyFilterApplied ? "Yes" : "No",
    ]);
    const csvContent = [headers, ...csvRows]
      .map((e) => e.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CommentDraw_History.csv`;
    link.click();
  };

  return (
    <div className="w-full bg-paper dark:bg-ink text-ink dark:text-paper min-h-full">
      <div className="border-b border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] px-6 sm:px-10 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-4">
              <span className="text-[var(--color-punch)]">▮</span> History
            </p>
            <h1
              className="font-display font-semibold tracking-[-0.04em] leading-[0.95]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Past draws
              <span className="text-[var(--color-punch)]">.</span>
            </h1>
            <p className="text-sm sm:text-base text-mute mt-3 max-w-xl">
              Review winners and export records.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={filteredHistory.length === 0}
            className="h-11 px-5 inline-flex items-center gap-2 border-2 border-ink dark:border-paper bg-transparent font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="px-6 sm:px-10 py-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard Icon={Trophy} label="Total runs" value={filteredHistory.length} />
          <StatCard Icon={Users} label="Total winners" value={totalWinners} />
          <StatCard Icon={MessageSquare} label="Comments" value={totalComments} />
        </div>

        <div className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] flex items-center gap-3 px-4">
          <Search size={16} className="text-mute" />
          <input
            type="text"
            placeholder="Search winner, video title or ID…"
            className="flex-1 bg-transparent border-0 outline-none py-3 text-sm placeholder:text-mute"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <HistoryRow
                key={item.id}
                item={item}
                onView={() => setSelectedItem(item)}
              />
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="font-display text-3xl font-semibold tracking-[-0.02em] mb-2">
                No draws yet
                <span className="text-[var(--color-punch)]">.</span>
              </p>
              <p className="text-sm text-mute">Run a giveaway to populate this list.</p>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

export default History;
