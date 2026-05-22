import { useSelector } from "react-redux";
import { useHistoryQuery } from "../../Redux/slices/apiSlice";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PUNCH = "#FF3D1F";
const PUNCH_2 = "#0030FF";

function ChartPanel({ index, title, subtitle, children, isEmpty }) {
  return (
    <div className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute mb-2">
            <span className="text-[var(--color-punch)]">{index}</span> / {title}
          </p>
          <p className="text-xs text-mute">{subtitle}</p>
        </div>
      </div>
      {isEmpty ? (
        <div className="w-full h-56 flex items-center justify-center border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-4">
          <p className="text-sm text-mute">Run a draw to populate this chart.</p>
        </div>
      ) : (
        <div className="w-full h-56">{children}</div>
      )}
    </div>
  );
}

function GiveawayInsights() {
  const theme = useSelector((state) => state.theme.mode);
  const { accessToken } = useSelector((state) => state.auth);

  const { data: historyData } = useHistoryQuery(undefined, {
    skip: !accessToken,
    refetchOnMountOrArgChange: true,
  });

  const chartData = historyData
    ? historyData.map((item, index) => ({
        id: index + 1,
        winnersCount: item.winnersCount,
        commentCount: item.commentCount,
        date: new Date(item.createdAt).toLocaleDateString(),
      }))
    : [];

  const axisColor = theme === "dark" ? "#8a8a8a" : "#8a8a8a";
  const gridColor = theme === "dark" ? "#1f1f1d" : "#e6e6e1";
  const tooltipBg = theme === "dark" ? "#0a0a0a" : "#fafaf7";
  const tooltipText = theme === "dark" ? "#fafaf7" : "#0a0a0a";

  return (
    <div className="w-full border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span className="text-[var(--color-punch)]">03</span> / Insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPanel
          index="A"
          title="Winners over time"
          subtitle="Per giveaway run"
          isEmpty={chartData.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="date"
                stroke={axisColor}
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={axisColor}
                domain={[0, "auto"]}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${gridColor}`,
                  color: tooltipText,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  borderRadius: 0,
                }}
              />
              <Line
                type="monotone"
                dataKey="winnersCount"
                stroke={PUNCH}
                strokeWidth={2}
                dot={{ r: 3, fill: PUNCH, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: PUNCH, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          index="B"
          title="Comments analyzed"
          subtitle="Per giveaway run"
          isEmpty={chartData.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="date"
                stroke={axisColor}
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={axisColor}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: `${PUNCH}1A` }}
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${gridColor}`,
                  color: tooltipText,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  borderRadius: 0,
                }}
              />
              <Bar dataKey="commentCount" fill={PUNCH_2} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </div>
  );
}

export default GiveawayInsights;
